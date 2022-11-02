import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import taskService from "../services/task.service";
import EventBus from "../common/EventBus";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    taskService.getTaskList().then(
      (response) => {
        console.log(response.data);
        setTasks(response.data.tasks);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        // setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div className="container">
      <Row xs={1} md={3} className="g-4">
        {tasks.map((task) => {
          return (
            <Col>
              <Card>
                <Card.Img
                  variant="top"
                  width={180}
                  height={250}
                  src={`http://localhost:8080/${task.taskimage}`}
                />
                <Card.Body>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text height={300}>{task.description}</Card.Text>
                  <Card.Text>taskId:{task._id}</Card.Text>
                  {/* <Button variant="primary"
              onClick={()=>{

              }}>
              Detail</Button> */}
                  <Link to={`/task/${task._id}/detail`}>detail</Link>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default TaskList;
