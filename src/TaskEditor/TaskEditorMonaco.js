//import { graphql, StaticQuery } from 'gatsby';
import React, { useEffect, useRef, useState } from 'react';
import Editor from "@monaco-editor/react";

// loader.config({
//   paths: {
//     vs: '/vs',
//   }
// });
// loader.config({ paths: { vs: 'monaco-editor' } });

function updateHeight(editor, width) {
  const contentHeight = editor.getContentHeight()
  editor.layout({ width: width, height: contentHeight });

  console.log("Updating width to " + width + " and height to: " + contentHeight)
}

function TaskEditorMonaco(props) {
  const monacoRef = useRef(null);
  const [isEdited, setIsEdited] = useState(false)

  const widthRef = useRef()
  widthRef.current = props.width

  function handleEditorWillMount(monaco) {
    fetch('monokai.json')
    .then(data => data.json())
    .then(data => {
      monaco.editor.defineTheme('monokai', data);
      monaco.editor.setTheme('monokai');
    })
  }

  function handleEditorDidMount(editor, monaco) {
    monacoRef.current = editor
    editor.onDidContentSizeChange(() => {updateHeight(editor, widthRef.current)})

    updateHeight(editor, widthRef.current)
  }

  if(isEdited !== props.isEdited) {
    const shouldBlur = isEdited === true
    if(shouldBlur) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      monacoRef.current.focus()
    }
    setIsEdited(props.isEdited)
  }
  return (
      <Editor 
        defaultLanguage='markdown' 
        theme='vs-dark' 
        beforeMount={handleEditorWillMount} 
        onMount={handleEditorDidMount} 
        path={props.id}
        options={{
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingStrategy: 'advanced',
          minimap: {
              enabled: false
          },
          overviewRulerLanes: 0
        }}
      />
  );
}

export default TaskEditorMonaco;
