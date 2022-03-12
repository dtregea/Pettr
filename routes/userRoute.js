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
    userController.updateUser(req, res);
  })
  .delete((req, res) => {
    console.log("DELETE /api/users/ invoked");
  });

// router.route("/api/user/:token/avatar")
// .get((req, res) => {
//   userController.getAvatar(req, res);
// })
// .;

// router.route("/api/user/:token/feed").get((req, res) => {
//   userController.getFeed(req, res);
// });

module.exports = router;
