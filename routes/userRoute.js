const router = require("express").Router();
const userController = require("../controllers/userController");

router
  .route("/api/users/")
  .get((req, res) => {
    console.log("GET /api/users/ invoked");
    userController.getUsers(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/ invoked");
    userController.createUser(req, res);
  })
  .put((req, res) => {
    console.log("PUT /api/users/ invoked");
    res.status(400).json({ error: "Specify a username" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/ invoked");
    res.status(400).json({ error: "Specify a username" });
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/ invoked");
    res.status(400).json({ error: "Not allowed" });
  });

router
  .route("/api/users/:username")
  .get((req, res) => {
    console.log("GET /api/users/:username invoked");
    userController.getUserByUsername(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:username invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:username invoked");
    userController.replaceUser(req, res);
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:username invoked");
    userController.updateUser(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:username invoked");
    res.status(400).json({ error: "Not today!" });
  });

router
  .route("/api/users/:username/displayname")
  .get((req, res) => {
    console.log("GET /api/users/:username/displayname invoked");
    userController.getDisplayname(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:username/displayname invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:username/displayname invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:username/displayname invoked");
    userController.updateDisplayname(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:username/displayname invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

router
  .route("/api/users/:username/avatar")
  .get((req, res) => {
    console.log("GET /api/users/:username/avatar invoked");
    userController.getAvatar(req, res);
  })
  .post((req, res) => {
    console.log("POST /api/users/:username/avatar invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .put((req, res) => {
    console.log("PUT /api/users/:username/avatar invoked");
    res.status(400).json({ error: "Invalid operation" });
  })
  .patch((req, res) => {
    console.log("PATCH /api/users/:username/avatar invoked");
    userController.updateAvatar(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/:username/avatar invoked");
    res.status(400).json({ error: "To be implemented... with security...!" });
  });

module.exports = router;
