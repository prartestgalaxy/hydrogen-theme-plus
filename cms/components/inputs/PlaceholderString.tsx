import {StringInputProps, useFormValue, SanityDocument, StringSchemaType} from 'sanity'

type Props = StringInputProps<StringSchemaType & {options?: {field?: string}}>

const getByPath = (obj: Record<string, unknown>, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj)

const PlaceholderStringInput = (props: Props) => {
  const {schemaType} = props

  const path = schemaType?.options?.field
  const doc = useFormValue([]) as SanityDocument

  const proxyValue = path ? (getByPath(doc as Record<string, unknown>, path) as string) : ''

  return props.renderDefault({
    ...props,
    elementProps: {...props.elementProps, placeholder: proxyValue},
  })
}

export default PlaceholderStringInput
