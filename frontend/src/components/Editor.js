import apiRequest from "../utils/apiRequest";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import { useLocation } from "react-router-dom";

const Editor = ({ onSave, data }) => {
  const coverImageRef = useRef();
  const titleRef = useRef();
  const tagsRef = useRef();
  const editor = useRef();
  const coverImageUrl = data?.image_url;

  const [coverImage, setCoverImage] = useState(); // this was file, setFile before
  // const [formState, setFormState] = useState("unchanged");

  // The effect where we show an exit prompt, but only if the formState is NOT
  // unchanged. When the form is being saved, or is already modified by the user,
  // sudden page exit could be a destructive action. Our goal is to prevent that.
  /*   useEffect(() => {
    // the handler for actually showing the prompt
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    // if the form is NOT unchanged, then set the onbeforeunload
    if (formState !== "unchanged") {
      window.addEventListener("beforeunload", handler);
      // clean it up, if the dirty state changes
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }
    // since this is not dirty, don't do anything
    return () => {};
  }, [formState]); */

  // i need to compare the initial data and the new data from the editor

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
              try {
                const formData = new FormData();
                formData.append("image", file);
                console.log("FORMDATA: ", formData);
                const resData = await apiRequest(
                  process.env.REACT_APP_API_URL + `blog/posts/file_upload/`,
                  "POST",
                  true,
                  formData
                );
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
    // onChange: async (api, event) => {
    //   const content = await editor.current.save();
    //   setFormState("changed");
    // },
  };

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS(configuration);
    }
  }, []);

  const coverImgChangeHandler = (e) => {
    setCoverImage(Array.from(e.target.files));
  };

  const removeCoverImgHandler = () => {
    setCoverImage(null);
  };

  const saveHandler = async () => {
    const outputData = await editor.current.save();
    const text = JSON.stringify(outputData);
    let tags;
    if (tagsRef.current.value) {
      tags = tagsRef.current.value.split(",");
    } else {
      tags = [];
    }
    onSave({
      image_url: coverImage?.[0],
      title: titleRef.current.value,
      tags,
      text,
    });
  };

  let coverImageLabel;
  if (!coverImage?.[0].name && !coverImageUrl) {
    coverImageLabel = "Add cover image";
  } else if (coverImage?.[0].name) {
    coverImageLabel = coverImage?.[0].name;
  } else if (coverImageUrl) {
    coverImageLabel = "Change cover image";
  }

  return (
    <div className="editor">
      {/* <h1 className="editor__title">New Post</h1> */}
      <button
        className="editor__save-btn account-btn"
        onClick={saveHandler}
        type="button"
      >
        Save
      </button>
      <div className="editor__top">
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover image"
            className="editor__cover-img-preview"
          />
        )}
        <input
          className="editor__img-input"
          type="file"
          id="cover_img"
          required
          ref={coverImageRef}
          onChange={coverImgChangeHandler}
        />
        <label className="editor__img-label" htmlFor="cover_img">
          {coverImageLabel}
        </label>
        <button
          className="editor__remove-img-btn"
          onClick={removeCoverImgHandler}
        >
          Remove cover image
        </button>
        <input
          className="editor__title-input"
          type="text"
          id="title"
          placeholder="Post title..."
          ref={titleRef}
          defaultValue={data ? data.title : ""}
          maxLength="150"
        />
        <input
          type="text"
          className="editor__tags-input"
          placeholder="add,your,tags,like,this"
          name="tags"
          ref={tagsRef}
        />
      </div>
      <div id="editorjs" className="editor__editor" />
    </div>
  );
};

export default Editor;
