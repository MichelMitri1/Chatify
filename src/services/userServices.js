const {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
  where,
} = require("firebase/firestore");
const {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { auth, db } = require("../helpers/firebase");

const addUser = async (name, username, email, pass) => {
  await createUserWithEmailAndPassword(auth, email, pass);

  console.log(email, pass);

  const user = auth.currentUser;
  const userId = user.uid;
  await updateProfile(user, {
    displayName: name,
  });
  user.displayName = name;

  console.log("test");

  await addDoc(collection(db, "users"), {
    name,
    username,
    email,
    userId,
  });

  return "Document successfully written!";
};

const getAllUsers = async () => {
  const users = collection(db, "users");
  const userSnapshot = await getDocs(users);
  return userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const loginUser = async (email, pass) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const addFriend = async (foundUser, currentUser) => {
  try {
    const requestCollection = collection(
      db,
      "allRequests",
      foundUser.userId,
      "friendRequests"
    );
    const result = await addDoc(requestCollection, {
      friends: false,
      idOfUserSent: currentUser.uid,
      idOfCurrentUser: foundUser.userId,
      nameOfUserReceived: foundUser.name,
      nameOfUserSent: currentUser.displayName,
    });

    const addedFriend = await getAllFriendRequests(currentUser.uid);

    return addedFriend;
  } catch (error) {
    throw error;
  }
};

const acceptFriend = async (currentUser, idOfUserSent, foundUser) => {
  try {
    const requestCollection = collection(
      db,
      "allRequests",
      currentUser.uid,
      "friendRequests"
    );

    const requestQuery = query(
      requestCollection,
      where("idOfUserSent", "==", idOfUserSent)
    );
    const querySnapshot = await getDocs(requestQuery);

    if (querySnapshot.empty) {
      throw new Error("Friend request not found");
    }

    const updatePromises = querySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, { friends: true })
    );

    await Promise.all(updatePromises);

    const requestForFoundUser = collection(
      db,
      "allRequests",
      foundUser.userId,
      "friendRequests"
    );

    await addDoc(requestForFoundUser, {
      idOfUserSent: currentUser.uid,
      friends: true,
      nameOfUserReceived: foundUser.name,
      nameOfUserSent: currentUser.displayName,
    });

    const createNewChatCollection = collection(
      db,
      "chats",
      currentUser.uid + idOfUserSent,
      "messages"
    );

    await addDoc(createNewChatCollection, {
      message: "Chat started",
      sentAt: Date.now(),
      senderId: foundUser.userId,
    });

    return { message: "Friend request accepted successfully" };
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    throw error;
  }
};

const declineFriend = async (currentUser, idOfUserSent) => {
  try {
    const requestCollection = collection(
      db,
      "allRequests",
      currentUser.uid,
      "friendRequests"
    );

    const requestQuery = query(
      requestCollection,
      where("idOfUserSent", "==", idOfUserSent)
    );
    const querySnapshot = await getDocs(requestQuery);

    if (querySnapshot.empty) {
      throw new Error("Friend request not found");
    }

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);

    return { message: "Friend request declined successfully" };
  } catch (error) {
    console.error("Error declining friend request:", error.message);
    throw error;
  }
};

const getAllFriendRequests = async (userId) => {
  const friendRequestsRef = collection(
    db,
    "allRequests",
    userId,
    "friendRequests"
  );

  const querySnapshot = await getDocs(friendRequestsRef);

  const friendRequests = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return friendRequests;
};

const getSpecificChatForUser = async (chatId) => {
  const chatCollection = collection(db, "chats", chatId, "messages");
  const chatQuery = query(chatCollection, orderBy("sentAt"));
  let collectionSnapshot = await getDocs(chatQuery);

  if (collectionSnapshot.empty) {
    const halfIndex = Math.floor(chatId.length / 2);
    const userId1 = chatId.slice(0, halfIndex);
    const userId2 = chatId.slice(halfIndex);

    const newChatId = `${userId2}${userId1}`;

    const newChatCollection = collection(db, "chats", newChatId, "messages");
    collectionSnapshot = await getDocs(newChatCollection);

    if (collectionSnapshot.empty) {
      return [];
    }
  }

  const chat = collectionSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return chat;
};

const sendMessage = async (message, senderId, sentToId, sentAt) => {
  try {
    let chatId = `${senderId}${sentToId}`;
    let chatCollection = collection(db, "chats", chatId, "messages");

    let collectionSnapshot = await getDocs(chatCollection);

    if (collectionSnapshot.empty) {
      chatId = `${sentToId}${senderId}`;
      chatCollection = collection(db, "chats", chatId, "messages");
      collectionSnapshot = await getDocs(chatCollection);

      if (collectionSnapshot.empty) {
        return [];
      }
    }

    await addDoc(chatCollection, {
      message: message,
      senderId: senderId,
      sentAt: sentAt,
    });

    const result = getSpecificChatForUser(chatId);

    return result;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

module.exports = {
  addUser,
  loginUser,
  getAllFriendRequests,
  sendMessage,
  addFriend,
  declineFriend,
  getSpecificChatForUser,
  acceptFriend,
  getAllUsers,
};
