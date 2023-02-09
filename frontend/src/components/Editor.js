import React, { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// import { Paragraph } from "@editorjs/paragraph";

const Editor = (props) => {
  const configuration = {
    holder: "editorjs",
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
    },
    data: {},
    onReady: () => {
      console.log("Editor.js READY");
    },
    onChange: (api, event) => {
      console.log("Now I know that Editor's content changed!", event);
    },
  };

  const [editor, seteditor] = useState({});

  useEffect(() => {
    const editor = new EditorJS(configuration);
    seteditor(editor);
  }, []);

  const onSave = () => {
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  return (
    <div>
      <h1>My Editor</h1>
      <button onClick={onSave}>Save</button>
      <div id="editorjs" />
    </div>
  );

  // return (
  //   <>
  //     <div>
  //       <h3>My Editor</h3>
  //       <div className="container">
  //         <div id="editor"></div>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default Editor;
