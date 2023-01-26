import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import PostsPage, { loader as postsLoader } from "./pages/Posts";
import PostPage, {
  loader as postLoader,
  action as deletePostAction,
} from "./pages/Post";
import NewPostPage, { action as newPostAction } from "./pages/NewPost";
import EditPostPage, { action as editPostAction } from "./pages/EditPost";
import AuthPage, { action as authAction } from "./pages/Auth";

import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "posts",
        element: <PostsPage />,
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
        path: "posts/new",
        element: <NewPostPage />,
        action: newPostAction,
      },
      //
      {
        path: "auth",
        element: <AuthPage />,
        action: authAction,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}

export default App;
