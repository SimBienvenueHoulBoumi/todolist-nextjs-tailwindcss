// src/hooks/useTasks.ts
import { useReducer, useCallback } from "react";
import { getTasks, createTask, deleteTask } from "../services/tasks";
import { Task, TaskDto } from "../types/articles";

// Define the action types
type Action =
  | { type: "FETCH_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Define the initial state structure
type State = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

// Initial state for the reducer
const initialState: State = {
  tasks: [],
  loading: false,
  error: null,
};

// Reducer function to handle state transitions
function tasksReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false,
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Custom hook for managing CRUD operations
export function useTasks() {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Fetch all tasks (Read)
  const fetchTasks = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const fetchedTasks = await getTasks();
      dispatch({ type: "FETCH_TASKS", payload: fetchedTasks });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch tasks" });
    }
  }, []); // The empty dependency array ensures this function is only created once

  // Create a new task
  const addTask = useCallback(
    async (taskDetails: TaskDto) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const newTask = await createTask(taskDetails);
        dispatch({ type: "ADD_TASK", payload: newTask });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to create task" });
      }
    },
    [] // Dependency array to keep it stable
  );

  // Delete a task
  const removeTask = useCallback(
    async (taskId: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await deleteTask(taskId);
        dispatch({ type: "DELETE_TASK", payload: taskId });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to delete task" });
      }
    },
    [] // Dependency array to keep it stable
  );

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    addTask,
    removeTask,
  };
}
