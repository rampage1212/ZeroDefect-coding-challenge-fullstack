import axios from "axios";
import authHeader from "./auth-header";
import { authCreateHeader } from "./author-CreateHeader";

const API_URL = "http://localhost:8080/api/task/";

const createNewTask = (data) => {
  return axios.post(API_URL + "create", data, { headers: authCreateHeader() });
};
const getTaskList = (data) => {
  return axios.post(API_URL + "list", data, { headers: authHeader() });
};
const getTaskDetail = (id) => {
  return axios.get(API_URL + "detail?taskId=" + id, { headers: authHeader() });
};
const updateTask = (data) => {
  return axios.post(API_URL + "update", data, { headers: authCreateHeader() });
};
const getDeleteTask = (id) => {
  return axios.get(API_URL + "remove?taskId=" + id, { headers: authHeader() });
};
export default {
  createNewTask,
  getTaskList,
  getTaskDetail,
  updateTask,
  getDeleteTask,
};
