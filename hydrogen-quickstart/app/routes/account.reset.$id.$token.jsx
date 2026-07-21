import {Form, useActionData, redirect} from "react-router";

export async function action({request, params, context}) {
  const formData = await request.formData();
  const password = formData.get("password");

  const mutation = `#graphql
    mutation customerReset($id: ID!, $input: CustomerResetInput!) {
      customerReset(id: $id, input: $input) {
        customer {
          id
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await context.storefront.mutate(mutation, {
    variables: {
      id: `gid://shopify/Customer/${params.id}`,
      input: {
        password,
        resetToken: params.token,
      },
    },
  });

  const errors = data?.customerReset?.customerUserErrors;

  if (errors?.length) {
    return {error: errors[0].message};
  }

  return redirect("/login");
}

export default function ResetPassword() {
  const result = useActionData();

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

      {result?.error && (
        <div className="text-red-500 mb-4">{result.error}</div>
      )}

      <Form method="post">
        <input
          name="password"
          type="password"
          required
          placeholder="New Password"
          className="border p-2 w-full mb-4"
        />

        <button className="bg-green-600 text-white px-4 py-2">
          Update Password
        </button>
      </Form>
    </div>
  );
}