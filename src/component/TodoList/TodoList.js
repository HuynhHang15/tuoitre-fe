import React, { useEffect, useState } from "react";
import "./TodoList.css";
import { Checkbox, List, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DeleteTwoTone,
  EditTwoTone,
  FieldTimeOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

import {
  deleteTodo,
  markDoneTodo,
  setTodoID,
} from "../../app/slices/todosSlice";
import TodoForm from "../TodoForm/TodoForm";
import TodoView from "../TodoView/TodoView";

const TodoList = ({ isModalOpen, showModal }) => {
  const { todos, search, sort, filter } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const [filteredAndSortedTodos, setFilteredAndSortedTodos] = useState([]);
  const [viewTodo, setViewTodo] = useState(false);

  const handleEditTodo = (id) => {
    showModal(true);
    dispatch(setTodoID(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleFilterAndSortTodo = () => {
    let newTodos = [...todos];

    ////////////////Seach
    if (search.trim() !== "") {
      newTodos = newTodos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    ////////////////Sort
    if (sort === "ascend") {
      newTodos.sort((a, b) => a.id - b.id);
    } else if (sort === "descend") {
      newTodos.sort((a, b) => b.id - a.id);
    }

    ////////////////Filter
    if (filter === "done") {
      newTodos = newTodos.filter((todo) => todo.isDone);
    } else if (filter === "undone") {
      newTodos = newTodos.filter((todo) => !todo.isDone);
    }

    setFilteredAndSortedTodos(newTodos);
  };

  //////////////////////////////VIEW TODO //////////////////////////////////
  const showViewTodo = (value) => {
    setViewTodo(value);
  };

  useEffect(() => {
    handleFilterAndSortTodo();
  }, [todos, search, sort, filter]);

  return (
    <div className="todo-list">
      <List
        className="todo-list-items"
        dataSource={filteredAndSortedTodos}
        renderItem={(todo, index) => (
          <List.Item
            className={`todo-item ${todo.isDone ? "todo-item-done" : ""}`}
            actions={[
              <div
                onClick={() => handleEditTodo(todo.id)}
                className="todo-item-icon"
              >
                <Tooltip title="Edit Todo">
                  <EditTwoTone twoToneColor="" />
                </Tooltip>
              </div>,
              
              <div
                onClick={() => handleDeleteTodo(todo.id)}
                className="todo-item-icon"
              >
                <Tooltip title="Delete Todo">
                  <DeleteTwoTone twoToneColor="#d71d1d" />
                </Tooltip>
              </div>,
            ]}
          >
            <TodoItem todo={todo} showViewTodo={showViewTodo} />
          </List.Item>
        )}
      />

            {/* EDIT TODO */}
      {isModalOpen && (
        <TodoForm isModalOpen={isModalOpen} showModal={showModal} />
      )}

             {/* VIEW TODO */}
      {viewTodo && <TodoView viewTodo={viewTodo} showViewTodo={showViewTodo} />}
    </div>
  );
};

const TodoItem = ({ todo, showViewTodo }) => {
  const dateFormat = "YYYY/MM/DD HH:mm:ss";
  dayjs.extend(customParseFormat);
  const now = dayjs();
  const expDate = dayjs(todo.date, dateFormat);
  const countdown = expDate.isAfter(now) ? expDate.diff(now, "second") : 0;

  const dispatch = useDispatch();

  const handleMarkDone = (id) => {
    dispatch(markDoneTodo(id));
  };

  return (
    <div className="todo-item-container">
      <Checkbox
        checked={todo.isDone}
        onChange={() => handleMarkDone(todo.id)}
      />
      <div
        className="todo-item-content"
        onClick={() => {
          dispatch(setTodoID(todo.id));
          showViewTodo(true);
        }}
      >
        <div className="todo-item-detail">
          <div className="todo-item-title">{todo.title}</div>
          <div className="todo-item-desc">
            <div className="todo-item-file">
              <PaperClipOutlined />
              {todo.fileList && todo.fileList.length && (
                <div>{todo.fileList.length}</div>
              )}
            </div>
            <div className="todo-item-date">
              <FieldTimeOutlined /> {todo.date}
            </div>
          </div>
        </div>

        {/* OVERDUE DATE */}
        {!todo.isDone && countdown == 0 && (
          <span className="overdue-tag">Overdue</span>
        )}
      </div>
    </div>
  );
};

export default TodoList;
