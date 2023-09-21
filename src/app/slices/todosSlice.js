import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todoID: 1,
  todos: JSON.parse(localStorage.getItem("todos")) || [],
  search: "",
  sort: "ascend",
  filter: "all"
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodoID(state, action) {
      state.todoID = action.payload;
    },
    addTodo(state, action) {
      state.todos.push(action.payload);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    editTodo(state, action) {
      let index = state.todos.findIndex((todo) => todo.id === state.todoID);
      state.todos[index] = action.payload;
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    markDoneTodo(state, action) {
      const todo = state.todos.find(todo => todo.id === action.payload)
      if (todo){
        todo.isDone = !todo.isDone;
      }
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    deleteTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },

  },
});

export const { setTodoID, addTodo, editTodo, markDoneTodo, deleteTodo, setSearch, setSort, setFilter } = todosSlice.actions;

export default todosSlice.reducer;
