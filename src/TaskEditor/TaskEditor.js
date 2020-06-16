import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/clike/clike'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

class TaskEditor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = null
    this.wasEdited = false
  }

  render() {
    if(this.props.isEdited === false && this.wasEdited) {
      this.editor.display.input.blur()
    } else if(this.props.isEdited && this.wasEdited === false) {
      this.editor.display.input.focus()
    }

    this.wasEdited = this.props.isEdited
    return (
      <CodeMirror
        className='task-editor'
        value={this.props.content}
        options={{
          mode: 'text/markdown',
          theme: 'monokai',
          lineNumbers: true,
          readOnly: false//props.isEdited ? false : 'nocursor',
        }}
        onChange={(editor, data, value) => {
          this.props.onTaskEditorChanged(value)
        }}
        editorDidMount={editor => { this.editor = editor }}
      />
    )
  }
}

export default TaskEditor