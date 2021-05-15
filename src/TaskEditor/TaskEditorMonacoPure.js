//import { graphql, StaticQuery } from 'gatsby';
import React, { useEffect, useRef, useState } from 'react';
import * as monaco from "monaco-editor";

function updateHeight(editor, width) {
  const contentHeight = editor.getContentHeight()
  width -= 5
  editor.layout({ width: width, height: contentHeight });
}

function TaskEditorMonacoPure(props) {
  const editorRef = useRef(null);
  const [isEdited, setIsEdited] = useState(false)
  const widthRef = useRef()
  widthRef.current = props.width

  // init monaco
  useEffect(() => {
    const container = document.getElementById(props.id);
    const editor = monaco.editor.create(container, {
      value: props.content,
      language: "markdown",
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
      minimap: {
          enabled: false
      },
      overviewRulerLanes: 0,
      readOnly: !isEdited,
    });
    editor.getModel().updateOptions({ tabSize: 2 })
    editor.onDidContentSizeChange(() => {updateHeight(editor, widthRef.current)})
    editor.onDidChangeModelContent((event) => {
      const value = editor.getModel().getValue()
      props.onTaskEditorChanged(value)
    })
    editorRef.current = editor
  }, [])

  useEffect(() => {
    updateHeight(editorRef.current, props.width)
  })

  useEffect(() => {
    fetch('monokai.json')
    .then(data => data.json())
    .then(data => {
      monaco.editor.defineTheme('monokai', data);
      monaco.editor.setTheme('monokai');
    })
  })

  if(isEdited !== props.isEdited) {
    const shouldBlur = isEdited === true
    if(shouldBlur) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      editorRef.current.focus()
    }
    setIsEdited(props.isEdited)
    editorRef.current.updateOptions({readOnly: !props.isEdited})
  }

  return (
      <div style={{ width: "100%", height:"100%" }} id={props.id}></div>
  );
}

export default TaskEditorMonacoPure;
