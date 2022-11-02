import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskUpdate from "./TaskUpdate";
import TaskService from "../services/task.service";
import EventBus from "../common/EventBus";
import Figure from "react-bootstrap/Figure";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { SuccessToast, ErrorToast } from "./toast/toast";
import { useNavigate } from "react-router-dom";
const TaskDetail = () => {
  const [taskContent, setTaskContent] = useState(null);
  const [updateState, setUpdateState] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      getTaskDetailData();
    }
  }, [id]);
  async function getTaskDetailData() {
    TaskService.getTaskDetail(id).then(
      (response) => {
        if (response.data.task) {
          var seltask = response.data.task;
          setTaskContent(seltask);
        }
      },
      (error) => {
        setTaskContent(null);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }
  useEffect(() => {}, [taskContent]);

  function deleteTask() {
    TaskService.getDeleteTask(id).then(
      (response) => {
        navigate("/task/list");
        SuccessToast("The Task is removed successfully ");
      },
      (error) => {
        console.log(error.response.data.message);

        ErrorToast(error.response.data.message);

        if (error.response) {
          if (error.response.status === 401) {
            EventBus.dispatch("logout");
          }

          if (error.response.data) {
            ErrorToast(error.response.data.message);
          }
        }
      }
    );
  }

  return (
    <div className="container">
      <header className="jumbotron">
        {taskContent && (
          <>
            {updateState ? (
              <>
                <TaskUpdate
                  setUpdateState={setUpdateState}
                  contentData={taskContent}
                  getTaskDetailData={getTaskDetailData}
                />
              </>
            ) : (
              <>
                <Figure.Image
                  width={171}
                  height={180}
                  alt="171x180"
                  src={`http://localhost:8080/${taskContent.taskimage}`}
                />
                <h3>{taskContent.title}</h3>
                <div
                  className="ql-editor bg-white"
                  style={{ height: "auto", padding: "0px" }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: taskContent.content }}
                  ></div>
                </div>
                <button
                  onClick={() => {
                    setUpdateState(true);
                  }}
                >
                  update{" "}
                </button>
                <button
                  onClick={() => {
                    deleteTask();
                  }}
                >
                  delete{" "}
                </button>
              </>
            )}
          </>
        )}
        {!taskContent && <h3>Error Task Id</h3>}
      </header>
    </div>
  );
};

export default TaskDetail;
