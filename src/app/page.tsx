"use client";

import { useState, useEffect } from "react";
import { useTasks } from "./hooks/useTasks";

export default function Home() {
  const { tasks, loading, error, fetchTasks, addTask, removeTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTaskDetails, setNewTaskDetails] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = (event: React.FormEvent) => {
    event.preventDefault();
    addTask({ details: newTaskDetails });
    setIsModalOpen(false);
    setNewTaskDetails("");
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 w-full md:w-2/5 lg:w-full">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Task Manager
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 mb-6"
      >
        Add New Task
      </button>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Task List</h2>
      {tasks.length === 0 ? ( // Check if there are no tasks
        <div className="text-center text-gray-500">
          No tasks available. Please add a new task.
        </div>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center border border-gray-200"
            >
              <div>
                <strong className="text-lg">{task.details}</strong>
                <p className="text-sm text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for Creating a Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create a New Task</h2>
            <form onSubmit={handleCreateTask}>
              <label htmlFor="taskDetails" className="block mb-2">
                Task Details
              </label>
              <input
                type="text"
                id="taskDetails"
                value={newTaskDetails}
                onChange={(e) => setNewTaskDetails(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
