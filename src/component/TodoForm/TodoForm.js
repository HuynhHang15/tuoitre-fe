import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Input,
  DatePicker,
  Upload,
  Modal,
  Button,
  Checkbox,
  notification,
} from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

import { addTodo, editTodo } from "../../app/slices/todosSlice";
import "./TodoForm.css";

const { Dragger } = Upload;
const { TextArea } = Input;
const dateFormat = "YYYY/MM/DD HH:mm:ss";
dayjs.extend(customParseFormat);

const TodoForm = ({ isModalOpen, showModal }) => {
  const { todoID, todos } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(dayjs().format(dateFormat));
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);

  ////////////////////////////  VALIDATION NOTIFICATION //////////////////////////
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, mess) => {
    api[type]({
      message: `Validation Error`,
      description: `Please enter input ${mess}`,
    });
  };

  //////////////////////////////  DATEPICKER  //////////////////////////////
  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf("day");
  };

  const onChangeDate = (date, dateString) => {
    setDate(dateString);
  };

  ////////////////////////////////  UPLOAD FILES  ////////////////////////////
  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    setFileList(newFileList);
  };

  const handleRemoveFile = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const uploadToCloudinary = async (files) => {
    const cloudName = "dspdlomdd";
    const uploadPreset = "tuoitre-fe";
    const folderName = "tuoitre-fe";

    const uploadedFiles = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", folderName);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          formData
        );

        const { secure_url } = response.data;
        uploadedFiles.push({ ...file, url: secure_url });
      } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
      }
    }

    return uploadedFiles;
  };

  //////////////////////////////////  HANDLE MODAL ////////////////////////////////
  const handleOk = async () => {
    if (!title) {
      openNotificationWithIcon("error", "Title");
      return;
    }
    if (!date) {
      openNotificationWithIcon("error", "Expiration date");
      return;
    }

    setLoading(true);

    //check file uploaded
    const newFiles = fileList.filter((file) => !file.url);
    const uploadedFiles = await uploadToCloudinary(newFiles);
    
    let todo = {
      id: todoID || Date.now(),
      title: title,
      date: date,
      datePosted: dayjs().format("YYYY/MM/DD"),
      content: content,
      fileList: [
        ...fileList.filter((file) => file.url),
        ...uploadedFiles,
      ],
      isDone: isDone,
    };

    const index = todos.findIndex((todo) => todo.id === todoID);
    if (index > -1) {
      dispatch(editTodo(todo));
    } else {
      dispatch(addTodo(todo));
    }
    setLoading(false);
    showModal(false);
  };

  const handleCancel = () => {
    showModal(false);
  };

  /////////////////////// GET TODO //////////////////////
  const getTodo = () => {
    const todo = todos.find((todo) => todo.id === todoID);
    if (todo) {
      setTitle(todo.title);
      setDate(todo.date);
      setContent(todo.content);
      setFileList(todo.fileList);
      setIsDone(todo.isDone);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <>
      {/* notification */}
      {contextHolder}

      <Modal
        open={isModalOpen}
        title={todoID ? "Edit todo" : "Add a new todo"}
        centered
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            {todoID ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <div className="todo-form">
          <div className="title-checkbox">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="todo-list-input"
            />
            <Checkbox
              checked={isDone}
              onChange={(e) => setIsDone(e.target.checked)}
              className="checkbox"
            >
              Done
            </Checkbox>
          </div>

          <DatePicker
            placeholder="Due date"
            showTime
            disabledDate={disabledDate}
            value={dayjs(date, dateFormat)}
            onChange={onChangeDate}
            className="todo-list-input"
          />

          <TextArea
            rows={4}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="todo-list-input"
          />

          <Dragger
            onChange={handleFileChange}
            multiple
            beforeUpload={() => false}
            fileList={fileList}
            onRemove={handleRemoveFile}
            className="todo-list-input"
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </div>
      </Modal>
    </>
  );
};

export default TodoForm;
