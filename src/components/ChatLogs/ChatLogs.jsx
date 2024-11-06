import React, { useState, useEffect, useRef } from "react";
import "./chatLogs.css";
// import { RiCheckDoubleFill } from "react-icons/ri";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../helpers/firebaseComponents";
import { FaMicrophone } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import toast, { Toaster } from "react-hot-toast";
import { IoSend } from "react-icons/io5";
import { formatTime } from "../../helpers/utils";

export default function ChatLogs({
  users,
  currentUser,
  setFriendRequests,
  chats,
  setChats,
  clickedUser,
}) {
  const [open, setOpen] = useState(false);
  const messageEndRef = useRef(null);
  const [message, setMessage] = useState({
    message: "",
  });
  const [addFriendInput, setAddFriendInput] = useState({
    usernameOfPerson: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddingFriend = async () => {
    try {
      if (!addFriendInput.usernameOfPerson) {
        toast.error("Please enter a username");
        return;
      }
      const foundUser = await users.find((user) =>
        user.username.includes(addFriendInput.usernameOfPerson)
      );

      users.map((user) => console.log(user.username));

      if (!foundUser) {
        toast.error("User not found");
        return;
      }

      const addingFriendApi = "http://10.40.13.145:3000/api/users/addFriend";

      const userResponse = await fetch(addingFriendApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foundUser: foundUser,
          currentUser: currentUser,
        }),
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(
          `HTTP error! status: ${userResponse.status}, message: ${errorText}`
        );
      }

      const result = await userResponse.json();
      setFriendRequests(result);

      setAddFriendInput({
        usernameOfPerson: "",
      });
      toast.success("Friend Request Sent!");
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    if (!message) {
      return;
    }

    try {
      const sendMessageApi = "http://10.40.13.145:3000/api/users/sendMessage";

      setMessage({
        message: "",
      });
      const messageResponse = await fetch(sendMessageApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.message,
          senderId: currentUser.uid,
          sentToId: clickedUser.idOfUserSent,
          sentAt: Date.now(),
        }),
      });

      if (!messageResponse.ok) {
        const errorText = await messageResponse.text();
        throw new Error(
          `HTTP error! status: ${messageResponse.status}, message: ${errorText}`
        );
      }

      const result = await messageResponse.json();
      setChats(result);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const chatId = `${currentUser.uid}${clickedUser.idOfUserSent}`;
    let messagesRef = collection(db, "chats", chatId, "messages");

    const fetchMessages = async () => {
      const messageSnapshot = await getDocs(messagesRef);
      if (messageSnapshot.empty) {
        messagesRef = collection(
          db,
          "chats",
          `${clickedUser.idOfUserSent}${currentUser.uid}`,
          "messages"
        );
      }

      const q = query(messagesRef, orderBy("sentAt"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const newMessages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChats(newMessages);
        },
        (error) => {
          toast.error("Error fetching messages:", error);
        }
      );

      return () => unsubscribe();
    };

    fetchMessages();
  }, [currentUser.uid, clickedUser.idOfUserSent, setChats]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <div className="chatLogContainer">
      <Toaster />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalWrapper">
          <Typography id="modal-modal-title" variant="h3" component="h1">
            Add a Friend
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Search For the Username of the Person You Want to Add
          </Typography>
          <input
            type="text"
            name="usernameOfPerson"
            className="addFriendInput"
            placeholder="Type Username Here..."
            value={addFriendInput.usernameOfPerson}
            onChange={(e) => {
              setAddFriendInput({
                ...addFriendInput,
                usernameOfPerson: e.target.value,
              });
            }}
          />
          <button className="addButton" onClick={() => handleAddingFriend()}>
            Add Friend
          </button>
        </Box>
      </Modal>
      <div className="chatLogHeader">
        {clickedUser.nameOfUserSent ? (
          <h2 className="name">{clickedUser.nameOfUserSent}</h2>
        ) : (
          <h2 className="name">Name</h2>
        )}

        <button className="addFriendButton" onClick={() => handleOpen()}>
          Add
        </button>
      </div>
      <div className="messagesContainer">
        {chats.map((chat) => (
          <>
            {chat.senderId === currentUser.uid ? (
              <div className="messageWrapperSent">
                <p className="messageSent">{chat.message}</p>
                <div className="dateOfMessageWrapperSent">
                  <p className="dateOfMessage">{formatTime(chat.sentAt)}</p>
                  {/* <p className="checkIcon">
                    <RiCheckDoubleFill style={{ fontSize: "18px" }} />
                  </p> */}
                </div>
              </div>
            ) : (
              <div className="messageWrapperReceived">
                <p className="messageReceived">{chat.message}</p>
                <div className="dateOfMessageWrapperReceived">
                  <p className="dateOfMessage">{formatTime(chat.sentAt)}</p>
                  {/* <p className="checkIcon">
                    <RiCheckDoubleFill style={{ fontSize: "18px" }} />
                  </p> */}
                </div>
              </div>
            )}
          </>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="messageSendingContainer">
        <MdAddPhotoAlternate className="icon" />
        <input
          type="text"
          className="messageInput"
          placeholder="Type message here..."
          value={message.message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) =>
            setMessage({
              ...message,
              message: e.target.value,
            })
          }
        />
        <div className="iconsWrapper">
          <IoCameraOutline className="icon" />
          <FaMicrophone className="icon" />
          <IoSend className="icon" onClick={() => sendMessage()} />
        </div>
      </div>
    </div>
  );
}
