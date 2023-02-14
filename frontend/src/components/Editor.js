import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import { useNavigate } from "react-router-dom";

const Editor = ({ onSave, data }) => {
  const navigate = useNavigate();
  const imageRef = useRef();
  const titleRef = useRef();

  const configuration = {
    holder: "editorjs",
    autofocus: true,
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "localhost:8000/api/blog/posts/file_upload/",
          },

          uploader: {
            async uploadByFile(file) {
              console.log("UPLOADING");
              try {
                const formData = new FormData();
                formData.append("image", file);
                const response = await fetch(
                  process.env.REACT_APP_API_URL + `blog/posts/file_upload/`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const resData = await response.json();
                console.log("RESDATA: ", resData);
                return resData;
              } catch (err) {
                console.log("ERROR: ", err.message);
              }
            },
          },
        },
      },
    },
    ...(data && { data: JSON.parse(data.text) }),
  };

  const editor = useRef();

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS(configuration);
    }
  }, []);

  let files = [];

  const fileChangeHandler = (e) => {
    files = Array.from(e.target.files);
  };

  const saveHandler = async () => {
    const outputData = await editor.current.save();
    const text = JSON.stringify(outputData);
    onSave({
      image_url: files[0],
      title: titleRef.current.value,
      text,
    });
  };

  return (
    <div className="editor">
      <h1 className="editor__title">New Post</h1>
      <button
        className="editor__save-btn account-btn"
        onClick={saveHandler}
        type="button"
      >
        Save
      </button>
      <div className="editor__top">
        <input
          className="editor__img-input"
          type="file"
          id="cover_img"
          required
          ref={imageRef}
          onChange={fileChangeHandler}
        />
        <label className="editor__img-label" htmlFor="cover_img">
          Add cover image
        </label>
        <input
          className="editor__title-input"
          type="text"
          id="title"
          placeholder="Post title"
          ref={titleRef}
        />
      </div>
      <div id="editorjs" className="editor__editor" />
    </div>
  );
};

export default Editor;
