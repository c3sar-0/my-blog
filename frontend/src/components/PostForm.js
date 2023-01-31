import React from "react";
import classes from "./PostForm.module.css";
import { Form } from "react-router-dom";

const PostForm = (props) => {
  return (
    <div className={classes.card}>
      <Form className={classes.form} method="POST" action={props.action}>
        {props.errors?.title && <p>{props.errors.title[0]}</p>}
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className={classes.input}
          name="title"
          defaultValue={props.title || ""}
        />
        {props.errors?.text && <p>{props.errors.text[0]}</p>}
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          className={classes.text}
          name="text"
          defaultValue={props.text || ""}
        />
        <button type="submit">{props.button}</button>
      </Form>
    </div>
  );
};

export default PostForm;
