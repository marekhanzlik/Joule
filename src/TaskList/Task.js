import React, { useEffect, useState, useRef } from 'react';
import TaskEditor from '../TaskEditor/TaskEditor.js'
import TaskEditorMonaco from '../TaskEditor/TaskEditorMonaco.js'
import TaskEditorMonacoPure from '../TaskEditor/TaskEditorMonacoPure.js'

function Task(props) {
  const id = props.taskData['id']
  var content = props.taskData['content']
  const [width, setWidth] = useState(0)
  
  const taskItemRef = useRef()

  useEffect(() => {
    setWidth(taskItemRef.current.offsetWidth)
    window.addEventListener('resize', () => {
      setWidth(taskItemRef.current.offsetWidth)
    });
  }, [])

  function onTaskEditorChanged(newContent) {
    content = newContent

    function serialize() {
      return {
        id: id,
        content: content
      }
    }
    props.onTaskDataChanged(serialize())
  }
  return (
    <div ref={taskItemRef} onClick={props.onClick} className={'task-item ' + (props.isEdited ? 'edited' : props.isActive ? 'active' : '')}>
      <TaskEditorMonacoPure key={id} width={width} isEdited={props.isEdited} id={id} content={content} onTaskEditorChanged={(content) => onTaskEditorChanged(content)} />
    </div>
  )
}

export default Task