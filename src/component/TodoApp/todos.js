import React, { useState } from "react";
import { Button, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import './todos.css'

import { useDispatch, useSelector } from "react-redux";

import TodoList from "../TodoList/TodoList";
import TodoForm from "../TodoForm/TodoForm";
import { setFilter, setSearch, setSort, setTodoID } from "../../app/slices/todosSlice";

const { Option } = Select;

const Todos = () => {
  const { todos, search, sort, filter } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleSearch = (value) => {
    dispatch(setSearch(value));
  };

  const handleSort = (value) => {
    dispatch(setSort(value));
  };

  const handleFilter = (value) => {
    dispatch(setFilter(value));
  };

  //modal add new task or edit task
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (value) => {
    setIsModalOpen(value);
  };

  return (
    <div className="todo-app">
      <div className="todo-app-header">
        <div className="todo-app-title">
          <div className="todo-app-title-content-total">
            <h2 className="todo-app-title-content">Todos</h2>
            <span className="todo-app-title-total">Total: {todos.length}</span>
          </div>
          <Button
            type="primary"
            onClick={() => {
              dispatch(setTodoID(null));
              showModal(true);
            }}
            className="todo-app-button"
          >
            <PlusOutlined />
            Add new task
          </Button>
        </div>

        <div className="todo-app-filterbar">
          <Input
            placeholder="Search todo.."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="todo-app-filterbar-search"
          />
          <Select
            defaultValue="ascend"
            value={sort}
            onChange={(value) => handleSort(value)}
            className="todo-app-filterbar-sort"
          >
            <Option value="ascend">Ascend</Option>
            <Option value="descend">Descend</Option>
          </Select>
          <Select
            defaultValue="all"
            value={filter}
            onChange={(value) => handleFilter(value)}
            className="todo-app-filterbar-filter"
          >
            <Option value="all">All</Option>
            <Option value="done">Done</Option>
            <Option value="undone">Undone</Option>
          </Select>
        </div>
      </div>

      <TodoList isModalOpen={isModalOpen} showModal={showModal} />

      {isModalOpen && (
        <TodoForm isModalOpen={isModalOpen} showModal={showModal} />
      )}
    </div>
  );
};

export default Todos;
