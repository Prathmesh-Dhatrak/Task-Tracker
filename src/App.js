import { useState, useEffect } from "react";
import Header from "./demoComponents/Header";
import Tasks from './demoComponents/Tasks'
import AddTask from "./demoComponents/AddTask";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTask = async () => {
      const serverData = await fetchTasks();
      setTasks(serverData);
    }
    getTask();
  }, [])

  const fetchTasks = async () => {
    const res = await fetch("https://prathmesh-react-task-tracker.herokuapp.com/tasks")
    const data = await res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`https://prathmesh-react-task-tracker.herokuapp.com/tasks/${id}`)
    const data = await res.json()
    return data
  }

  const addTask = async (task) => {
    const res = await fetch("https://prathmesh-react-task-tracker.herokuapp.com/tasks", {method: 'POST', headers:{
      'Content-type': 'application/json'
    }, body: JSON.stringify(task),})
    const data = await res.json();
    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id , ...task }
    // setTasks([...tasks, newTask])
    // console.log(newTask)
  }
   
  const deleteTask = async (id) => {
    await fetch(`https://prathmesh-react-task-tracker.herokuapp.com/tasks/${id}`, {method: 'DELETE',})
    setTasks(tasks.filter((task)=> task.id !== id))
  }

  const toggleReminder = async (id) =>{
    const tastToToggle = await fetchTask(id)
    const utdData = {...tastToToggle, reminder: !tastToToggle.reminder}
    const res = await fetch(`https://prathmesh-react-task-tracker.herokuapp.com/tasks/${id}`, {method: 'PUT', headers:{
      'Content-type': 'application/json'
    }, body: JSON.stringify(utdData),})

    const data = await res.json();

    setTasks(tasks.map(task => task.id === id ? {...task, reminder: data.reminder} : task))
  }
  return (
    <div className="container">
     <Header title="Task Tracker" onAdd={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask}/>
     {showAddTask && <AddTask onAdd={addTask}/>}
     {tasks.length >0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : "No Task to show"}
    </div>
  );

}

export default App;
