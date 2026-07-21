import {Link, useRouteError, isRouteErrorResponse} from 'react-router';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request}) {
  
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "We can’t seem to find the page you’re looking for.";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <div className="text-center max-w-lg">

        {/* Robot Image */}
        <img
          src="/images/404-robot.svg"
          alt="404 robot"
          className="mx-auto w-[300px] mb-6"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Oops...
        </h1>

        <p className="text-gray-500 mb-6">
          {message}
        </p>

        <Link
          to="/"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
        >
          Back to Home
        </Link>


<div className = 'mt-5'>
  <p className="font-semibold text-lg mb-3">
    Are you looking for...
  </p>
  </div>

<div className="mt-5 text-center">
  <ul className="flex flex-col items-center gap-[10px]">
    <li>
      <Link
        to="/"
        className="flex items-center gap-2 w-[120px] text-left text-gray-700 hover:text-blue-500"
      >
        <span className="text-blue-500">›</span>
        Home
      </Link>
    </li>

    <li>
      <Link
        to="/blogs"
        className="flex items-center gap-2 w-[120px] text-left text-gray-700 hover:text-blue-500"
      >
        <span className="text-blue-500">›</span>
        Blog
      </Link>
    </li>

    <li>
      <Link
        to="/contact"
        className="flex items-center gap-2 w-[120px] text-left text-gray-700 hover:text-blue-500"
      >
        <span className="text-blue-500">›</span>
        Contact
      </Link>
    </li>
  </ul>
</div>

      </div>
    </div>
  );
}

/** @typedef {import('./+types/$').Route} Route */
