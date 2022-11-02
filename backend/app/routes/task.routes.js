const { authJwt } = require("../middlewares");
const controller = require("../controllers/task.controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/task/create",
    [authJwt.verifyToken, authJwt.isAdmin, uploadStorage.single("file")],
    controller.create
  );
  app.post(
    "/api/task/update",
    [authJwt.verifyToken, authJwt.isAdmin, uploadStorage.single("file")],
    controller.update
  );
  app.get(
    "/api/task/remove",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.remove
  );
  app.post("/api/task/list", [authJwt.verifyToken], controller.list);
  app.get("/api/task/detail", [authJwt.verifyToken], controller.detail);
};
