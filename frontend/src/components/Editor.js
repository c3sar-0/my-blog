import React, { useEffect, useState, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import { useNavigate } from "react-router-dom";

const Editor = ({ method, data }) => {
  const navigate = useNavigate();

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
    onReady: () => {
      console.log("Editor.js READY");
    },
    onChange: (api, event) => {
      console.log("Now I know that Editor's content changed!", event);
    },
  };

  // const [editor, setEditor] = useState({ isReady: false });
  // let editor = { isReady: false };
  const editor = useRef();

  useEffect(() => {
    // if (!editor.isReady) {
    if (!editor.current) {
      // editor = new EditorJS(configuration);
      // setEditor(new EditorJS(configuration));
      editor.current = new EditorJS(configuration);
    }
  }, []);

  const onSave = async () => {
    const outputData = await editor.current.save();

    const formData = new FormData();
    formData.append("text", JSON.stringify(outputData));

    let url = process.env.REACT_APP_API_URL + "blog/posts/";
    url = method == "PUT" ? url + data.id + "/" : url;
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: "Bearer " + localStorage.access,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    console.log("success");
    navigate("/");
  };

  return (
    <div>
      <h1>My Editor</h1>
      <button onClick={onSave}>Save</button>
      <div id="editorjs" />
    </div>
  );
};

export default Editor;
