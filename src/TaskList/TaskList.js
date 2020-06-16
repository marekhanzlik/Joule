import React from 'react';
import Task from './Task.js'
import { ulid } from 'ulid'
import isHotkey from 'is-hotkey'

class TaskList extends React.Component {
    constructor(props) {
        super(props)

        this.isNewTaskHotkey = isHotkey('insert')
        this.isSaveHotkey = isHotkey('mod+s')
        this.isDeleteHotkey = isHotkey('delete')

        let tasks = JSON.parse(localStorage.getItem('joule.tasks')) // [{id:0, content:{...}}]
        let selectedTaskIndex = JSON.parse(localStorage.getItem('joule.tasks.selectedTaskIndex')) // int

        tasks = tasks == null ? [] : tasks
        selectedTaskIndex = selectedTaskIndex == null ? 0 : selectedTaskIndex

        this.state = {
            tasks: tasks,
            selectedTaskIndex: selectedTaskIndex,
            isEdited: false
        }
    }

    render() {
        let childrenData = this.state.tasks
        let children = []
        if(childrenData != null) {
            for(let i = 0; i < childrenData.length; i++) {
                let data = childrenData[i]
                children.push(
                    (<Task key={data['id']} 
                    isActive={i === this.state.selectedTaskIndex}
                    isEdited={i === this.state.selectedTaskIndex && this.state.isEdited}
                    taskData={data} 
                    onTaskDataChanged={(newData) => this.onTaskDataChanged(newData)}
                    onClick={() => {
                        this.selectTask(i)
                    }}
                    />
                ))
            }
        }

        let container
        if(children.length > 0) {
            container = (
                <div className='task-list'>{children}</div>
            )
        } else {
            container = (
                <div className='no-task'>
                    Press `insert` key to create new task <br/><br/>
                    <div className='help'>
                        <h3>Shortcuts</h3>
                        <pre><b>insert</b>: new task</pre>
                        <pre><b>delete</b>: delete task</pre>
                        <pre><b>arrow keys</b>: traverse tasks</pre>
                        <pre><b>enter or click on selected task</b>: edit task</pre>
                        <pre><b>escape</b>: cancel edit</pre>
                    </div>
                </div>

                
            )
        }

        return container
    }

    selectTask(index) {
        //console.log(`Onclicked ${index}`)
        this.setState({
            isEdited: true,
            selectedTaskIndex: index
        })
    }

    onTaskDataChanged(data) {
        this.state.tasks.forEach((task, index) => {
            if(task.id === data.id) {
                this.state.tasks[index].content = data.content
            }
        }, this.state.tasks);

        this.saveState()
    }

    saveState() {
        localStorage.setItem('joule.tasks', JSON.stringify(this.state.tasks))
        localStorage.setItem('joule.tasks.selectedTaskIndex', JSON.stringify(this.state.selectedTaskIndex))
    }

    componentDidMount() {
        document.addEventListener('keydown', event => {
            switch(event.which) {
                case 27: //esc
                    this.setState({
                        isEdited: false
                    })
                    break
                default:
                    break
            }

            if(this.state.isEdited) {
                return
            }

            console.log(event.which)
            if (this.isNewTaskHotkey(event)) {
                event.preventDefault()
                this.createNewTask()
                return
            } else if(this.isSaveHotkey(event)) {
                event.preventDefault()
                this.saveState()
                return
            } else if(this.isDeleteHotkey(event)) {
                event.preventDefault()
                this.removeTask()
                this.saveState()
            }

            switch(event.which) {
                case 13: { //enter
                    this.selectTask(this.state.selectedTaskIndex)
                    event.preventDefault()
                    break
                }
                case 38: { //up
                    if(event.altKey) {
                        this.moveTaskUp()
                    } else {
                        this.moveSelectionUp()
                    }
                    break
                }
                case 40: { //down
                    if(event.altKey) {
                        this.moveTaskDown()
                    } else {
                        this.moveSelectionDown()
                    }
                    break
                }
                case 37: //left
                    break
                case 39: //right
                    break
                default:
                    break
            }
        })
    }

    moveSelectionUp() {
        let newIndex = this.state.selectedTaskIndex-1
        if(newIndex < 0) {
            newIndex = this.state.tasks.length-1
        }

        this.selectIndex(newIndex)
    }

    moveSelectionDown() {
        let newIndex = this.state.selectedTaskIndex+1
        if(newIndex >= this.state.tasks.length) {
            newIndex = 0
        }
        
        this.selectIndex(newIndex)
    }

    selectIndex(index) {
        this.setState({
            selectedTaskIndex: index
        })
    }

    moveTaskUp() {
        let newIndex = this.state.selectedTaskIndex-1
        if(newIndex < 0) {
            newIndex = this.state.tasks.length-1
        }

        this.moveTaskToIndex(this.state.selectedTaskIndex, newIndex)
        this.selectIndex(newIndex)
    }

    moveTaskDown() {
        let newIndex = this.state.selectedTaskIndex+1
        if(newIndex >= this.state.tasks.length) {
            newIndex = 0
        }

        this.moveTaskToIndex(this.state.selectedTaskIndex, newIndex)
        this.selectIndex(newIndex)
    }

    moveTaskToIndex(fromIndex, toIndex) {
        let taskToMove = this.state.tasks[fromIndex]

        let tasks = this.state.tasks
        tasks.splice(fromIndex, 1)
        tasks.splice(toIndex, 0, taskToMove)

        this.setState({
            tasks: tasks
        })

        this.saveState()
    }

    createNewTask() {
        let task = {id: ulid(), content: ''}
        this.setState((state, props) => ({
            tasks: [...state.tasks, task]
        }))
    }

    removeTask() {
        let newTasks = []
        for(let i = 0; i < this.state.tasks.length; i++) {
            if(i != this.state.selectedTaskIndex) {
                newTasks.push(this.state.tasks[i])
            }
        }

        this.setState({
            tasks: newTasks
        })
    }
}

export default TaskList