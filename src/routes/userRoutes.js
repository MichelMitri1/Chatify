const express = require("express");
const userController = require("../controllers/userController");
const userValidator = require("../validators/userValidators");

const router = express.Router();

router.post(
  "/addUsers",
  userValidator.validateUser,
  userValidator.handleValidationErrors,
  userController.addUser
);

router.post("/loginUser", userController.loginUser);

router.post("/addFriend", userController.addFriend);

router.post("/acceptRequest", userController.acceptFriend);

router.post("/declineRequest", userController.declineFriend);

router.post("/sendMessage", userController.sendMessage);

router.get("/getAllUsers", userController.getAllUsers);

router.get(
  "/getAllFriendRequests/:userId",
  userController.getAllFriendRequests
);

router.get(
  "/getSpecificChatForUser/:chatId",
  userController.getSpecificChatForUser
);

module.exports = router;
