import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

import HomePage, { loader as postsLoader } from "./pages/Home";
import RootLayout from "./pages/Root";
import PostPage, {
  loader as postLoader,
  action as deletePostAction,
} from "./pages/Post";
import NewPostPage, { action as newPostAction } from "./pages/NewPost";
import EditPostPage, { action as editPostAction } from "./pages/EditPost";
import AuthPage from "./pages/Auth";
import UserPage, { loader as userLoader } from "./pages/User";
import EditUserPage, { action as editUserAction } from "./pages/EditUser";
import ReadLaterPage, { loader as readLaterLoader } from "./pages/ReadLater";

import PrivateRoute from "./utils/PrivateRoute";

import AuthContext, { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: postsLoader,
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
            loader: postLoader,
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
            loader: readLaterLoader,
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

function App() {
  return <RouterProvider router={router} />;
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
