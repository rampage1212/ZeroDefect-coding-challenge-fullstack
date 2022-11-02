const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Task = db.task;
const fs = require("fs");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
  console.log(req.file);
  if (req.file) {
    console.log(req.file);
    console.log(req.body);
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      taskimage: req.file.filename,
    });
    task.save((err, user) => {
      if (err) {
        res.status(500).send({ message: "db save error" });
        return;
      }
      res.status(200).send({ message: "ok" });
    });
  } else {
    res.status(500).send({ message: "there is no file" });
  }
};
exports.update = (req, res) => {
  Task.findOne({ _id: req.body.id }, (err, task) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (task) {
        task.title = req.body.title;
        task.description = req.body.description;
        task.content = req.body.content;
        // res.status(200).send({ task: task,dir:__dirname });
        if (req.file) {
          const directoryPath = __basedir + "/uploads/" + task.taskimage;
          if (fs.existsSync(directoryPath)) {
            fs.unlink(directoryPath, (err1) => {
              if (err1) {
                res.status(500).send({
                  message: "Could not delete the file. " + err1,
                });
              }
              task.taskimage = req.file.filename;
              task.save((err2) => {
                if (err2) {
                  res.status(500).send({ message: err });
                  return;
                }

                res
                  .status(200)
                  .send({ message: "User was updated successfully!" });
              });
            });
          } else {
            task.taskimage = req.file.filename;
            task.save((err2) => {
              if (err2) {
                res.status(500).send({ message: err });
                return;
              }

              res
                .status(200)
                .send({ message: "User was updated successfully!" });
            });
          }
        } else {
          task.save((err3) => {
            if (err3) {
              res.status(500).send({ message: err });
              return;
            }

            res.status(200).send({ message: "task was updated successfully!" });
          });
        }
      } else {
        if (req.file) {
          const directoryPath = __basedir + "/uploads/" + req.file.filename;
          fs.unlink(directoryPath, (err1) => {
            console.log(err1);
            res.status(500).send({ message: "there is no task" });
          });
        }
      }
    }
  });
};
exports.remove = (req, res) => {
  Task.findOne({ _id: req.query.taskId }, (err, task) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (task) {
      console.log(task);
      const directoryPath = __basedir + "/uploads/" + task.taskimage;
      Task.findOneAndDelete({ _id: req.query.taskId }, null, (err) => {
        if (err) {
          res.status(500).send({ message: "error occurs in Delete!" });
        } else {
          if (fs.existsSync(directoryPath)) {
            fs.unlink(directoryPath, (err1) => {
              if (err1) {
                res.status(500).send({
                  message: "Could not delete the file. " + err1,
                });
              }
              res
                .status(200)
                .send({ message: "task was deleted successfully!" });
            });
          } else {
            res.status(200).send({ message: "task was deleted successfully!" });
          }
        }
      });
    } else {
      res.status(500).send({ message: "there is no task id" });
    }
  });
};

exports.list = (req, res) => {
  Task.find({}, {}, (err, tasks) => {
    if (err) {
      res.status(500).send({ message: "error" });
    } else {
      res.status(200).send({ tasks: tasks });
    }
  });
};
exports.detail = (req, res) => {
  Task.findOne({ _id: req.query.taskId }, (err, task) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (task) {
      res.status(200).send({ task: task });
    } else {
      res.status(500).send({ message: "there is no task id" });
    }
  });
};
