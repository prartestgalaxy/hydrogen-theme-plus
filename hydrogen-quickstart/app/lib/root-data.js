import { useRouteLoaderData } from 'react-router';

export function useRootLoaderData() {
    const data = useRouteLoaderData('root');
    return data;
}
