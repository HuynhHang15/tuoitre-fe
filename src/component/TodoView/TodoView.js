import { Button, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import "./TodoView.css";
import { useSelector } from "react-redux";
import {
  CalendarFilled,
  ClockCircleFilled,
  FileExcelFilled,
  FileFilled,
  FileImageFilled,
  FilePdfFilled,
  FilePptFilled,
  FileWordFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatCountdown } from "../../utils/formatCountdown";
import { formatBytes } from "../../utils/formatBytes";

const dateFormat = "YYYY/MM/DD HH:mm:ss";
dayjs.extend(customParseFormat);

const TodoView = ({ viewTodo, showViewTodo }) => {
  const { todoID, todos } = useSelector((state) => state.todos);
  const todo = todos.find((todo) => todo.id === todoID);

  const handleCancel = () => {
    showViewTodo(false);
  };


  /////////////////VIEW FILE////////////////
  const [isView, setIsView] = useState(false);
  const [viewFile, setViewFile] = useState();
  const handleViewFile = (url) => {
    setIsView(true);
    setViewFile(url);
  };

  //////////////////COUNTDOWN////////////////
  const now = dayjs();
  const expDate = dayjs(todo.date, dateFormat);
  const countdown = expDate.isAfter(now) ? expDate.diff(now, "second") : 0;
  const [countdownTodo, setCountdownTodo] = useState(countdown);
  const { days, hours, minutes, seconds } = formatCountdown(countdownTodo);

  useEffect(() => {
    if (todo.isDone) {
      return;
    }
    const interval = setInterval(() => {
      setCountdownTodo((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownTodo]);

  return (
    <>
      <Modal
        open={viewTodo}
        title={"Todo"}
        centered
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="todo-view">
          <div className="todo-view-left">
            <div className="todo-view-title">{todo.title}</div>

            <div>
              <div className="todo-view-title2">Description</div>
              <p className="todo-view-desc">{todo.content}</p>
            </div>

            <div>
              <div className="todo-view-title2">Attachments</div>
              <div className="todo-view-files">
                {todo.fileList.map((file, index) => (
                  <div
                    key={index}
                    className="file-container"
                    onClick={() => handleViewFile(file.url)}
                  >
                    <div className="file-icon">
                      {file.type.includes("image") ? (
                        <FileImageFilled style={{ color: "#357df4" }} />
                      ) : file.type.includes(".document") ? (
                        <FileWordFilled style={{ color: "#0052a1" }} />
                      ) : file.type.includes("pdf") ? (
                        <FilePdfFilled style={{ color: "#e8493b" }} />
                      ) : file.type.includes(".sheet") ||
                        file.type.includes("excel") ? (
                        <FileExcelFilled style={{ color: "#008641" }} />
                      ) : file.type.includes(".presentation") ? (
                        <FilePptFilled style={{ color: "#f04e23" }} />
                      ) : (
                        <FileFilled style={{ color: "#bcc5cf" }} />
                      )}
                    </div>
                    <div className="file-content">
                      <Tooltip title={file.name}>
                        <span className="file-name">{file.name}</span>
                      </Tooltip>
                      <span className="file-size">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="todo-view-right">
            <div className="todo-view-right-item">
              <InfoCircleFilled />
              <div className="todo-view-date-desc">
                <span className="todo-view-date-title">Status</span>
                {todo.isDone ? (
                  <span className="status-done-tag">Done</span>
                ) : countdownTodo == 0 ? (
                  <span className="status-overdue-tag">Overdue</span>
                ) : (
                  <span className="status-doing-tag">Doing</span>
                )}
              </div>
            </div>

            <div className="todo-view-right-item">
              <CalendarFilled />
              <div className="todo-view-date-desc">
                <span className="todo-view-date-title">Date posted</span>
                <span>{todo.datePosted}</span>
              </div>
            </div>

            <div className="todo-view-right-item">
              <CalendarFilled />
              <div className="todo-view-date-desc">
                <span className="todo-view-date-title">Expiration date</span>
                <span>{todo.date}</span>
              </div>
            </div>

            <div className="todo-view-right-item">
              <ClockCircleFilled />
              <div className="todo-view-date-title">Countdown</div>
            </div>

            {/* COUNTDOWN */}
            <div className="todo-view-countdown">
              <div className="todo-view-countdown-item">
                <span className="countdown-item-number">{days}</span>
                <span className="countdown-item-desc">Days</span>
              </div>

              <div className="countdown-item-icon">:</div>

              <div className="todo-view-countdown-item">
                <span className="countdown-item-number">{hours}</span>
                <span className="countdown-item-desc">Hours</span>
              </div>

              <div className="countdown-item-icon">:</div>

              <div className="todo-view-countdown-item">
                <span className="countdown-item-number">{minutes}</span>
                <span className="countdown-item-desc">Minutes</span>
              </div>

              <div className="countdown-item-icon">:</div>

              <div className="todo-view-countdown-item">
                <span className="countdown-item-number">{seconds}</span>
                <span className="countdown-item-desc">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* VIEW FILE */}
      {isView && (
        <Modal
          open={isView}
          centered
          onCancel={() => setIsView(false)}
          className="modal-view-file"
          footer={[]}
        >
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            className="doc-viewer"
            documents={[
              {
                uri: viewFile,
              },
            ]}
          />
        </Modal>
      )}
    </>
  );
};

export default TodoView;
