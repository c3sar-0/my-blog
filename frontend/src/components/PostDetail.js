import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useSubmit } from "react-router-dom";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

const PostDetail = (props) => {
  const authCtx = useContext(AuthContext);
  const post = props.post;
  const submit = useSubmit();
  const navigate = useNavigate();
  const [commentFormError, setCommentFormError] = useState(null);

  const deletePostHandler = () => {
    submit(null, { method: "DELETE" });
  };
  const editPostHandler = () => {
    navigate("edit");
  };

  const commentSubmitHandler = async (text) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `blog/posts/${post.id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.access,
          },
          body: JSON.stringify({
            text: text,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setCommentFormError(data.text[0]);
      }
      navigate("");
    } catch (err) {
      setCommentFormError("Something went wrong.");
    }
  };
  console.log(post.image_url);

  return (
    <>
      <div className="post-detail">
        <div className="post-detail__image">
          <img src={post.image_url} alt="Post" />
        </div>
        <div className="post-detail__info">
          <div className="post-detail__title">
            <h1>{post.title}</h1>
          </div>
          <div className="post-detail__date">
            <p>{new Date(post.created).toDateString()}</p>
          </div>
        </div>
        <div className="post-detail__text">
          {/* <p>{post.text}</p> */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            sint minus accusantium pariatur nobis error facilis quia, dolore
            quisquam sunt a odio porro suscipit quidem fugiat? Non, nam veniam?
            Explicabo! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Optio deserunt cupiditate nostrum, reprehenderit architecto id dolor
            maxime voluptatum odit, quia est quod magnam nisi inventore
            dignissimos repellendus obcaecati harum eum? Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Suscipit soluta quasi iure
            corrupti accusamus itaque repellat unde at autem possimus quia
            consequatur ratione molestias reprehenderit quos, officia quod
            distinctio necessitatibus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptatum sint minus accusantium pariatur nobis
            error facilis quia, dolore quisquam sunt a odio porro suscipit
            quidem fugiat? Non, nam veniam? Explicabo! Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Optio deserunt cupiditate
            nostrum, reprehenderit architecto id dolor maxime voluptatum odit,
            quia est quod magnam nisi inventore dignissimos repellendus
            obcaecati harum eum? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Suscipit soluta quasi iure corrupti accusamus
            itaque repellat unde at autem possimus quia consequatur ratione
            molestias reprehenderit quos, officia quod distinctio
            necessitatibus. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Voluptatum sint minus accusantium pariatur nobis error facilis
            quia, dolore quisquam sunt a odio porro suscipit quidem fugiat? Non,
            nam veniam? Explicabo! Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Optio deserunt cupiditate nostrum, reprehenderit
            architecto id dolor maxime voluptatum odit, quia est quod magnam
            nisi inventore dignissimos repellendus obcaecati harum eum? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Suscipit soluta
            quasi iure corrupti accusamus itaque repellat unde at autem possimus
            quia consequatur ratione molestias reprehenderit quos, officia quod
            distinctio necessitatibus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptatum sint minus accusantium pariatur nobis
            error facilis quia, dolore quisquam sunt a odio porro suscipit
            quidem fugiat? Non, nam veniam? Explicabo! Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Optio deserunt cupiditate
            nostrum, reprehenderit architecto id dolor maxime voluptatum odit,
            quia est quod magnam nisi inventore dignissimos repellendus
            obcaecati harum eum? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Suscipit soluta quasi iure corrupti accusamus
            itaque repellat unde at autem possimus quia consequatur ratione
            molestias reprehenderit quos, officia quod distinctio
            necessitatibus. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Voluptatum sint minus accusantium pariatur nobis error facilis
            quia, dolore quisquam sunt a odio porro suscipit quidem fugiat? Non,
            nam veniam? Explicabo! Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Optio deserunt cupiditate nostrum, reprehenderit
            architecto id dolor maxime voluptatum odit, quia est quod magnam
            nisi inventore dignissimos repellendus obcaecati harum eum? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Suscipit soluta
            quasi iure corrupti accusamus itaque repellat unde at autem possimus
            quia consequatur ratione molestias reprehenderit quos, officia quod
            distinctio necessitatibus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptatum sint minus accusantium pariatur nobis
            error facilis quia, dolore quisquam sunt a odio porro suscipit
            quidem fugiat? Non, nam veniam? Explicabo! Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Optio deserunt cupiditate
            nostrum, reprehenderit architecto id dolor maxime voluptatum odit,
            quia est quod magnam nisi inventore dignissimos repellendus
            obcaecati harum eum? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Suscipit soluta quasi iure corrupti accusamus
            itaque repellat unde at autem possimus quia consequatur ratione
            molestias reprehenderit quos, officia quod distinctio
            necessitatibus. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Voluptatum sint minus accusantium pariatur nobis error facilis
            quia, dolore quisquam sunt a odio porro suscipit quidem fugiat? Non,
            nam veniam? Explicabo! Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Optio deserunt cupiditate nostrum, reprehenderit
            architecto id dolor maxime voluptatum odit, quia est quod magnam
            nisi inventore dignissimos repellendus obcaecati harum eum? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Suscipit soluta
            quasi iure corrupti accusamus itaque repellat unde at autem possimus
            quia consequatur ratione molestias reprehenderit quos, officia quod
            distinctio necessitatibus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptatum sint minus accusantium pariatur nobis
            error facilis quia, dolore quisquam sunt a odio porro suscipit
            quidem fugiat? Non, nam veniam? Explicabo! Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Optio deserunt cupiditate
            nostrum, reprehenderit architecto id dolor maxime voluptatum odit,
            quia est quod magnam nisi inventore dignissimos repellendus
            obcaecati harum eum? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Suscipit soluta quasi iure corrupti accusamus
            itaque repellat unde at autem possimus quia consequatur ratione
            molestias reprehenderit quos, officia quod distinctio
            necessitatibus.
          </p>
        </div>
        <div className="post-detail__actions">Like Comment Save</div>
      </div>
    </>
  );
};

export default PostDetail;

// <h1>
//   {post.title} - {post.author?.name} (
//   {new Date(post.created).toLocaleDateString()})
// </h1>
// <img src={post.image_url} alt="post image" style={{ height: "300px" }} />
// <button>{post.is_liked_by_user ? "Already liked" : "Like"}</button>
// <p>{post.text}</p>
// {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
//   <button onClick={deletePostHandler}>Delete</button>
// )}
// {authCtx.isLoggedIn && post.author.name === authCtx.user?.name && (
//   <button onClick={editPostHandler}>Edit</button>
// )}
// <CommentForm
//   postId={post.id}
//   onSubmit={commentSubmitHandler}
//   error={commentFormError}
// />
// <ul>
//   {post.comments.map((comment) => {
//     return (
//       <li key={comment.id}>
//         <Comment
//           author={comment.author}
//           text={comment.text}
//           postId={post.id}
//           commentId={comment.id}
//         />
//       </li>
//     );
//   })}
// </ul>
