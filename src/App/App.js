import React from 'react';
import TaskList from '../TaskList/TaskList.js'
import './style.css';
import './codemirror.css'

class App extends React.Component {
    render() {
        return (
           <TaskList />
        )
    }
}

export default App