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
import MePage, { loader as meLoader } from "./pages/Me";

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
            element: <PrivateRoute />,
            children: [
              {
                path: "posts/new",
                element: <NewPostPage />,
                action: newPostAction,
              },
            ],
          },
          //
          {
            path: "me",
            element: <MePage />,
          },
          //
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
