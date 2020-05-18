class HTMLHelper {
    htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

class View {
    constructor() {
        this.app = this.getElement('#root')
        this.taskList = this.createElement('ul', 'task-list')
        this.app.append(this.taskList)

        this.editing = false
        this._temporaryTaskText = ''
        this._initLocalListeners()
    }

    _initLocalListeners() {
        this.taskList.addEventListener('input', event => {
            if (event.target.className === 'task-input form-control') {
                this._temporaryTaskText = event.target.innerText
            }
        })

        this.taskList.addEventListener('focusin', event => {
            if(event.target.className === 'task-input form-control') {
                this.editing = true
                this._temporaryTaskText = event.target.innerText
            }
        })
    }

    bindEditTask(handler) {
        this.taskList.addEventListener('focusout', event => {
            const id = parseInt(event.target.parentElement.id)
        
            handler(id, this._temporaryTaskText)
            this._temporaryTaskText = ''
            this.editing = false
        })
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }

    getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }

    _resetInput() {
        this.input.value = ''
    }

    triggerFocusInOnSelectedTask(taskId) {
        var tasks = this.taskList.children
        for(const task of tasks) {
            if(task.id == taskId) {
                var input = task.getElementsByClassName("task-input")[0]
                input.focus()
                document.execCommand('selectAll', false, null)
                document.getSelection().collapseToEnd();
                break;
            }
        }
    }

    triggerFocusOutOnSelectedTask(taskId) {
        var tasks = this.taskList.children
        for(const task of tasks) {
            if(task.id == taskId) {
                var input = task.getElementsByClassName("task-input")[0]
                input.blur()
                break;
            }
        }
    }

    displayTasks(tasks) {
        // Delete all nodes
        while (this.taskList.firstChild) {
            this.taskList.removeChild(this.taskList.firstChild)
        }

        // Show default message
        if (tasks.length === 0) {
            const p = this.createElement('p')
            p.classList.add('no-task-message')
            p.textContent = 'Create new tasks with `n` key'
            this.taskList.append(p)
        } else {
            tasks.forEach(task => {
                const li = this.createElement('li')
                li.id = task.id
                li.classList = 'drag-item'
                if(task.selected == true) {
                    li.style.cssText = 'border: solid 2px #aaa'
                }

                const progress_div = this.createElement('div')
                progress_div.classList.add('progress-container')

                const progress_item = helper.htmlToElement('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="15px" height="15px"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')
                for(var i = 0; i < task.progress; i++) {
                    progress_div.append(progress_item.cloneNode(true))
                }
            
                const text_div = this.createElement('div')
                text_div.contentEditable = true
                text_div.classList.add('task-input', 'form-control')
                text_div.tabIndex = task.id
                text_div.textContent = task.text

                const control_div = this.createElement('div')
                control_div.classList.add('item-control-container')
                
                const control_left_div = this.createElement('div')
                control_left_div.classList.add('control-left')
                const control_right_div = this.createElement('div')
                control_right_div.classList.add('control-right')

                const time_dot = this.createElement('div')
                time_dot.classList.add('time-dot')
                time_dot.style.cssText = 'background-color: green;'

                control_left_div.append(time_dot)
                control_left_div.append(time_dot.cloneNode(true))
                control_left_div.append(time_dot.cloneNode(true))

                const svg_plus = helper.htmlToElement('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="15px" height="15px"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')
                const svg_done = helper.htmlToElement('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="15px" height="15px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>')
                const svg_remove = helper.htmlToElement('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="12px" height="12px"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')

                const btn = this.createElement('button')
                btn.classList.add('item-control-button')
                
                const btn_plus = btn.cloneNode(true)
                btn_plus.onclick = e => {
                    console.log(e)
                }
                btn_plus.style.cssText = 'background-color: white; border: 1px solid black; margin-left: 25px'
                btn_plus.append(svg_plus)
                const btn_done = btn.cloneNode(true)
                btn_done.style.cssText = 'background-color: green; border: 1px solid black; margin-left: 5px'
                btn_done.append(svg_done)
                const btn_remove = btn.cloneNode(true)
                btn_remove.style.cssText = 'background-color: orangered; border: 1px solid black'
                btn_remove.append(svg_remove)

                control_right_div.append(btn_plus)
                control_right_div.append(btn_done)
                control_right_div.append(btn_remove)

                control_div.append(control_left_div, control_right_div)
            
                li.append(progress_div, text_div, control_div)
            
                this.taskList.append(li)
            })
        }
    }

    bindAddTask(handler) {
        this.app.addEventListener('click', event => {
            event.preventDefault()
            if(event.target.className == 'add') {
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }
        })
    }

    bindDeleteTask(handler) {
        this.taskList.addEventListener('click', event => {
            if(event.target.className == 'delete') {
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }
        })
    }

    bindCompleteTask(handler) {
        this.taskList.addEventListener('change', event => {
            if(event.target.type == 'checkbox') {
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }
        })
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.onTaskListChanged(this.model.tasks)

        this.model.bindTaskListChanged(this.onTaskListChanged)
        this.view.bindAddTask(this.handleAddTask)
        this.view.bindDeleteTask(this.handleDeleteTask)
        this.view.bindCompleteTask(this.handleCompleteTask)
        this.view.bindEditTask(this.handleEditTask)
    }

    onTaskListChanged = tasks => {
        this.view.displayTasks(tasks)
    }

    handleAddTask = taskText => {
        this.model.addTask(taskText)
    }

    handleEditTask = (id, taskText) => {
        this.model.editTask(id, taskText)
    }

    handleDeleteTask = id => {
        this.model.deleteTask(id)
    }

    handleCompleteTask = id => {
        this.model.completeTask(id)
    }
}

class TaskModel {
    constructor(id, text, complete, selected, progress, timestamp) {
        this.id = id
        this.text = text
        this.complete = complete
        this.selected = selected
        this.progress = progress
        this.timestamp = timestamp
    }

    setText(text) {
        this.text = text
    }

    setComplete(complete) {
        this.complete = complete
    }
    
    setSelected(selected) {
        this.selected = selected
    }

    setProgress(progress) {
        this.progress = progress
    }
}

class TasksListModel {
    constructor() {
        this.tasks = []
        var all_tasks = JSON.parse(localStorage.getItem('tasks'))
        if(all_tasks != null) {
            all_tasks.forEach(task => {
                this.tasks.push(new TaskModel(task.id, task.text, task.complete, task.selected, task.progress, task.timestamp))
            })
        }
        //     { id: 0, text: "some", complete: false, selected: true }
    }

    _commit(tasks) {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    bindTaskListChanged(callback) {
        this.onTaskListChangedCallback = callback
    }

    onTaskListChanged() {
        this._commit();
        this.onTaskListChangedCallback(this.tasks)
    }

    addTask(taskText) {
        var taskId = this.tasks.length > 0 ? this.tasks[this.tasks.length-1].id + 1 : 1
        const task = new TaskModel(taskId, taskText, false, false, 0, Date.now())
        this.tasks.push(task)

        this.selectTask(task.id)
    }

    editTask(taskId, taskText) {
        var taskIndex = this.getTaskIndexFromId(taskId)
        this.tasks[taskIndex].setText(taskText)

        this.onTaskListChanged(this.tasks)
    }

    completeTask(taskId) {
        var taskIndex = this.getTaskIndexFromId(taskId)
        this.tasks[taskIndex].setComplete(true)

        this.onTaskListChanged(this.tasks)
    }

    deleteTask(taskId) {
        var taskIndex = this.getTaskIndexFromId(taskId)
        var newSelectedTaskIndex = taskIndex

        this.tasks = this.tasks.filter(task => task.id !== taskId)
        
        if(taskIndex >= this.tasks.length-1) {
            newSelectedTaskIndex = this.tasks.length-1
        }
        
        this.selectTaskOnIndex(newSelectedTaskIndex)

        this.onTaskListChanged(this.tasks)
    }

    incrementProgress() {
        var taskIndex = this.getSelectedTaskIndex()
        this.tasks[taskIndex].setProgress(this.tasks[taskIndex].progress+1)

        this.onTaskListChanged(this.tasks)
    }

    getTaskIndexFromId(taskId) {
        for(var i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].id == taskId) {
                return i
            }
        }

        return -1
    }

    moveTaskUp(taskId) {
        for(var i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].id == taskId) {
                if(i == 0) {
                    var tmp = this.tasks[this.tasks.length-1]
                    this.tasks[this.tasks.length-1] = this.tasks[i]
                    this.tasks[i] = tmp
                } else {
                    var tmp = this.tasks[i-1]
                    this.tasks[i-1] = this.tasks[i]
                    this.tasks[i] = tmp
                }
                break;
            }
        }

        this.onTaskListChanged(this.tasks)
    }

    moveTaskDown(taskId) {
        for(var i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].id == taskId) {
                if (i == this.tasks.length-1){
                    var tmp = this.tasks[0]
                    this.tasks[0] = this.tasks[i]
                    this.tasks[i] = tmp
                } else {
                    var tmp = this.tasks[i+1]
                    this.tasks[i+1] = this.tasks[i]
                    this.tasks[i] = tmp
                }
                break;
            }
        }

        this.onTaskListChanged(this.tasks)
    }

    selectTask(taskId) {
        this.tasks.forEach(task => {
            task.selected = false
            if(task.id == taskId) {
                task.selected = true
            }
        });

        this.onTaskListChanged(this.tasks)
    }

    selectTaskOnIndex(index) {
        for(var i = 0; i < this.tasks.length; i++) {
            this.tasks[i].selected = false
            if(i == index) {
                this.tasks[i].selected = true
            }
        }

        this.onTaskListChanged(this.tasks)
    }

    getSelectedTaskIndex() {
        for(var i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].selected == true) {
                return i;
            }
        }
    }

    selectNextTask() {
        var index = this.getSelectedTaskIndex()
        if(index == this.tasks.length-1) {
            index = 0
        } else {
            index += 1
        }

        this.selectTaskOnIndex(index)
    }

    selectPrevTask() {
        var index = this.getSelectedTaskIndex()
        if(index == 0) {
            index = this.tasks.length-1
        } else {
            index -= 1
        }

        this.selectTaskOnIndex(index)
    }

    getSelectedTaskId() {
        for(const task of this.tasks) {
            if(task.selected) {
                return task.id
            }
        }
    }
}

const helper = new HTMLHelper()
const model = new TasksListModel();
const app = new Controller(model, new View())

document.addEventListener('keydown', handleKeydownEvent)
document.addEventListener('keypress', handleKeypressEvent)

function handleKeydownEvent(e) {
    //console.log(e)
    switch(e.which) {
        case 38: //up
            app.view.triggerFocusOutOnSelectedTask(model.getSelectedTaskId())

            if(e.altKey) {
                model.moveTaskUp(model.getSelectedTaskId())
            } else {
                model.selectPrevTask()
            }
            break;
        case 40: //down
            app.view.triggerFocusOutOnSelectedTask(model.getSelectedTaskId())

            if(e.altKey) {
                model.moveTaskDown(model.getSelectedTaskId())
            } else {
                model.selectNextTask()
            }
            break;
        case 46: // delete [when not editing]
            if(!app.view.editing) {
                e.preventDefault();
                model.deleteTask(model.getSelectedTaskId())
            }
    }
}

function handleKeypressEvent(e) {
    //console.log(e)
    if(app.view.editing) {
        switch(e.which) {
            case 10:
            case 13: //enter
                if(e.ctrlKey) {
                    app.view.triggerFocusOutOnSelectedTask(model.getSelectedTaskId())
                }
                break;
            }
    } else {
        switch(e.which) {
            case 10:
            case 13: // enter
                e.preventDefault();
                app.view.triggerFocusInOnSelectedTask(model.getSelectedTaskId())
                break;
            case 43: // +
                model.incrementProgress()
                break;
            case 110: // n
                model.addTask("")
                break;
        }
    }
}