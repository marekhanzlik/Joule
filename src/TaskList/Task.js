import React, { setState, useState } from 'react';
import TaskEditor from '../TaskEditor/TaskEditor.js'

class Task extends React.Component {
    constructor(props) {
        super(props)

        this.id = props.taskData.id
        this.content = props.taskData['content']
    }

    render() {
        return (
            <div onClick={this.props.onClick} className={'task-item ' + (this.props.isEdited ? 'edited' : this.props.isActive ? 'active' : '')}>
                <TaskEditor isEdited={this.props.isEdited} content={this.content} onTaskEditorChanged={(content) => this.onTaskEditorChanged(content)} />
            </div>
        )
    }

    onTaskEditorChanged(newContent) {
        this.content = newContent
        this.props.onTaskDataChanged(this.serialize())
    }

    serialize() {
        return {
            id: this.id,
            content: this.content
        }
    }

    getTitleFromContent(content) {
        if (content == null) {
            return ''
        }

        return content.split('\n')[0].replace('#', '');
    }
}

export default Task