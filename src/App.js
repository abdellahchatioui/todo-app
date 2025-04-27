// App.jsx
import React, { useState, useEffect } from "react";
import TodoApp from "./components/TodoApp";
import ConfirmedTasks from "./components/ConfirmedTasks";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [confirmedTasks, setConfirmedTasks] = useState([]);
  const [view, setView] = useState("todo"); // 'todo' or 'confirmed'

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedConfirmed = JSON.parse(localStorage.getItem("confirmedTasks")) || [];
    setTasks(storedTasks);
    setConfirmedTasks(storedConfirmed);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("confirmedTasks", JSON.stringify(confirmedTasks));
  }, [tasks, confirmedTasks]);

  const confirmTask = (task) => {
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    const updatedConfirmed = [...confirmedTasks, task];
    setTasks(updatedTasks);
    setConfirmedTasks(updatedConfirmed);
  };

  const cancelTask = (task) => {
    const updatedConfirmed = confirmedTasks.filter(t => t.id !== task.id);
    const updatedTasks = [...tasks, task];
    setConfirmedTasks(updatedConfirmed);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <div className="flex justify-center space-x-4 my-4">
        <button onClick={() => setView("todo")} className="px-4 py-2 bg-blue-500 text-white rounded">To-Do</button>
        <button onClick={() => setView("confirmed")} className="px-4 py-2 bg-green-500 text-white rounded">Confirmé</button>
      </div>
      {view === "todo" ? (
        <TodoApp tasks={tasks} setTasks={setTasks} confirmTask={confirmTask} />
      ) : (
        <ConfirmedTasks confirmedTasks={confirmedTasks} cancelTask={cancelTask} />
      )}
    </div>
  );
};

export default App;
