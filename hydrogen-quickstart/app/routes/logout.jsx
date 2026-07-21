import { redirect } from 'react-router';

export const action = async ({ request }) => {
  // Clear the customer access token cookie
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    `customerAccessToken=; Path=/;  SameSite=Lax; Max-Age=0`
  );

  // Redirect to signin page
  return redirect('/signin', { headers });
};

// Optional: handle GET request in case user hits /account/logout directly
export const loader = async () => redirect('/signin');
