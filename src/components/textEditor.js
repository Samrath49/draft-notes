import { useEffect, useRef, useState } from "react";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import {
  headingTextHandler,
  boldTextHandler,
  redTextHandler,
  underlineTextHandler,
  codeTextHandler,
} from "../utils/index.js";

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const refElement = useRef(null);

  useEffect(() => {
    let localItem = localStorage.getItem("draftContext");
    if (localItem) {
      const context = convertFromRaw(JSON.parse(localItem));
      setEditorState(EditorState.createWithContent(context));
    }
  }, []);

  const saveTextHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(
      "draftContext",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  function blockStyle(contentBlock) {
    const type = contentBlock.getType();
    switch (type) {
      case "block-bold":
        return "BoldBlock";
      case "block-red":
        return "RedBlock";
      case "block-underline":
        return "UnderlineBlock";
      case "code-block":
        return "CodeBlock";
      default:
        return null;
    }
  }

  const onChangeHandler = (editorState) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = block.getKey();

    if (text.startsWith("# ")) {
      const newEditorState = headingTextHandler(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("*** ")) {
      const newEditorState = underlineTextHandler(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("** ")) {
      const newEditorState = redTextHandler(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("* ")) {
      const newEditorState = boldTextHandler(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    } else if (text.startsWith("```")) {
      const newEditorState = codeTextHandler(
        selectionState,
        contentState,
        block,
        text,
        blockKey,
        editorState
      );
      setEditorState(newEditorState);
      return true;
    }
    setEditorState(editorState);

    return false;
  };

  return (
    <>
      <div className="NavContainer">
        <p></p>
        <h2 className="TextTitle">Demo editor by <a target="_blank" href="https://www.linkedin.com/in/samrath49/" rel="noreferrer">Samrath</a></h2>
        <button onClick={saveTextHandler} className="Button">
          Save Text
        </button>
      </div>
      <div
        onClick={() => {
          refElement.current && refElement.current.focus();
        }}
        className="TextEditorContainer"
      >
        <Editor
          ref={refElement}
          editorState={editorState}
          onChange={onChangeHandler}
          blockStyleFn={blockStyle}
        />
      </div>
    </>
  );
};

export default TextEditor;
