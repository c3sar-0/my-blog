import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import PostsPage, { loader as postsLoader } from "./pages/Posts";
import PostPage, { loader as postLoader } from "./pages/Post";
import NewPostPage from "./pages/NewPost";

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
      },
      {
        path: "posts/new",
        element: <NewPostPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
