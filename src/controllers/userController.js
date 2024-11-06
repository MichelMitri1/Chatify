const userService = require("../services/userServices.js");

const addUser = async (req, res) => {
  const { name, username, email, pass } = req.body;

  try {
    if (!name || !email || !pass || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await userService.addUser(name, username, email, pass);
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, pass } = req.body;
  try {
    if (!email || !pass) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await userService.loginUser(email, pass);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: error.message });
  }
};

const addFriend = async (req, res) => {
  try {
    const { foundUser, currentUser } = req.body;
    const users = await userService.addFriend(foundUser, currentUser);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const acceptFriend = async (req, res) => {
  try {
    const { currentUser, idOfUserSent, foundUser } = req.body;

    const users = await userService.acceptFriend(
      currentUser,
      idOfUserSent,
      foundUser
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const declineFriend = async (req, res) => {
  try {
    const { currentUser, idOfUserSent, foundUser } = req.body;

    const users = await userService.declineFriend(
      currentUser,
      idOfUserSent,
      foundUser
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllFriendRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const friendRequests = await userService.getAllFriendRequests(userId);

    return res.status(200).json(friendRequests);
  } catch (error) {
    console.error("Error in getAllFriendRequests controller:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getSpecificChatForUser = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chats = await userService.getSpecificChatForUser(chatId);

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { message, senderId, sentToId, sentAt } = req.body;

  try {
    const messages = await userService.sendMessage(
      message,
      senderId,
      sentToId,
      sentAt
    );

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Failed to Send message" });
  }
};

module.exports = {
  addUser,
  loginUser,
  getAllFriendRequests,
  addFriend,
  acceptFriend,
  declineFriend,
  sendMessage,
  getSpecificChatForUser,
  getAllUsers,
};
