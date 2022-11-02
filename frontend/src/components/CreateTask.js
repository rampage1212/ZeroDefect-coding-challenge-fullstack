import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import ImageUploader from "./ImageUpload";
import { isEmail } from "validator";

import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";

import { register } from "../actions/auth";
import taskService from "../services/task.service";
import { useNavigate } from "react-router-dom";
import { SuccessToast, ErrorToast } from "./toast/toast";
import EventBus from "../common/EventBus";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vtitle = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The title must be between 3 and 20 characters.
      </div>
    );
  }
};
const vdescription = (value) => {
  if (value.length < 10 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The description must be between 10 and 200 characters.
      </div>
    );
  }
};
const vcontent = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vimage = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const CreateTask = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskimage, setTaskImage] = useState(null);
  const [content, setContent] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(taskimage);
  }, [taskimage]);

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();
    if (!taskimage) {
      return;
    }
    let formData = new FormData();
    formData.append("file", taskimage[0]);
    formData.append("description", description);

    formData.append("title", title);
    formData.append("content", content);
    taskService.createNewTask(formData).then(
      (response) => {
        SuccessToast("new task is created successfully!");
        navigate("/task/list");
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
  };

  ///////quill
  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ script: "sub" }, { script: "super" }],

      ["link", "image"],
      [{ color: [] }, { background: [] }],

      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    blotFormatter: {},
  };
  const { editor, editorRef, Quill } = useQuill({
    theme: "snow",
    modules: modules,
    placeholder: "Write content...",
  });

  if (Quill && !editor) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register("modules/blotFormatter", BlotFormatter);
  }
  var pp = 0;
  ////quill effect
  useEffect(() => {
    if (editor) {
      if (pp == 0) {
        editor.clipboard.convert(content);
        editor.setContents(editor.clipboard.convert(content));
      }
      pp = pp + 1;
      editor.on("editor-change", (delta, oldContents) => {
        console.log(editor.root.innerHTML);
        setContent(editor.root.innerHTML);
      });

      // if(editor){
      //   console.log(detailDescription)
      //   editor.clipboard.dangerouslyPasteHTML(detailDescription);
      // }
    }
  }, [editor]);
  return (
    <div className="col-md-12">
      <div className="card container">
        {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}
        {/* <ReactImageUploadComponent style={{ maxWidth: '100%', margin: "20px auto" }}
                                  withPreview={true} 
                                  singleImage={true}
                                  /> */}

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Title</label>
                <Input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  validations={[required, vtitle]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Description </label>
                <Textarea
                  type="text"
                  className="form-control"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  validations={[required, vdescription]}
                  style={{ height: "100px" }}
                />
              </div>

              <div className="form-group card-container">
                <label htmlFor="password">select Image</label>
                <ImageUploader
                  style={{ maxWidth: "100%", margin: "20px auto" }}
                  withPreview={true}
                  singleImage={true}
                  setImage={setTaskImage}
                  onChange={(e) => {
                    setTaskImage(e);
                  }}
                />
              </div>

              <div className="form-group">
                <div ref={editorRef} className="rounded" />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Create</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default CreateTask;
