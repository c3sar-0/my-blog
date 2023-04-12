import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import PostPage, {
  loader as postLoader,
  action as deletePostAction,
} from "./pages/Post";
import NewPostPage, { action as newPostAction } from "./pages/NewPost";
import EditPostPage, {
  action as editPostAction,
  loader as editPostLoader,
} from "./pages/EditPost";
import AuthPage from "./pages/Auth";
import UserPage, { loader as userLoader } from "./pages/User";
import EditUserPage, { action as editUserAction } from "./pages/EditUser";
import ReadLaterPage from "./pages/ReadLater";
import ErrorPage from "./pages/Error";

import PrivateRoute from "./utils/PrivateRoute";

import AuthContext, { AuthProvider } from "./context/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "posts/:id",
            element: <PostPage />,
            loader: postLoader,
            action: deletePostAction,
          },
          {
            path: "posts/:id/edit",
            element: <EditPostPage />,
            loader: editPostLoader,
            action: editPostAction,
          },
          {
            path: "user/:slug",
            element: <UserPage />,
            loader: userLoader,
          },
          {
            path: "user/:slug/edit",
            element: <EditUserPage />,
            action: editUserAction,
          },
          {
            path: "read-later",
            element: <ReadLaterPage />,
          },
          {
            element: <PrivateRoute />,
            children: [
              {
                path: "posts/new",
                element: <NewPostPage />,
                action: newPostAction,
              },
            ],
          },
          {
            path: "auth",
            element: <AuthPage />,
          },
        ],
      },
    ],
  },
]);

const client = new QueryClient();

function App() {
  return (
    <div>
      <div className="background"></div>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
    // <RouterProvider router={router}>
    //   <QueryClientProvider client={client} />
    // </RouterProvider>
  );
}

export default App;

{
  /* <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="posts/" element={<PostsPage />} loader={postsLoader} />
            <Route
              path="posts/:id"
              element={<PostPage />}
              loader={postLoader}
              action={deletePostAction}
            />
            <Route
              path="posts/:id/edit"
              element={<EditPostPage />}
              loader={postLoader}
              action={editPostAction}
            />
            <Route
              path="posts/new"
              element={<NewPostPage />}
              action={newPostAction}
            />
            <Route path="auth" element={<AuthPage />} action={authAction} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter> */
}
