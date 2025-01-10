import { EditorState } from "draft-js";

const codeTextHandler = (
  selectionState,
  contentState,
  block,
  text,
  blockKey,
  editorState
) => {
  const blockSelection = selectionState.merge({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: text.length,
  });

  const updatedContentState = contentState.merge({
    blockMap: contentState.getBlockMap().merge({
      [blockKey]: block.merge({
        type: "code-block",
        text: text.slice(3).trim(),
      }),
    }),
  });

  const newEditorState = EditorState.push(
    editorState,
    updatedContentState,
    "change-block-data"
  );

  return EditorState.forceSelection(newEditorState, blockSelection);
};

export default codeTextHandler;
