import {Form, useActionData} from "react-router";

export async function action({request, context}) {
  const formData = await request.formData();
  const email = formData.get("email");

  const mutation = `#graphql
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          message
        }
      }
    }
  `;

  const data = await context.storefront.mutate(mutation, {
    variables: {email},
  });

  const errors = data?.customerRecover?.customerUserErrors;

  if (errors?.length) {
    return {error: errors[0].message};
  }

  return {success: true};
}

export default function ForgotPassword() {
  const result = useActionData();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Forgot Password
      </h1>

      {result?.success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
          Password reset email sent. Please check your inbox.
        </div>
      )}

      {result?.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {result.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Send Reset Link
        </button>
      </Form>
    </div>
  );
}