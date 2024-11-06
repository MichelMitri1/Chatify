import React, { useState, useEffect } from "react";
import People from "../People/People";
import "./mainPage.css";
import ChatLogs from "../ChatLogs/ChatLogs";

export default function MainPage({ currentUser, users }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [clickedUser, setClickedUser] = useState({});

  const getAllFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/getAllFriendRequests/${currentUser.uid}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friend requests");
      }
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAllFriendRequests();
    }
  }, [currentUser]);

  return (
    <div className="mainContainer">
      <People
        currentUser={currentUser}
        users={users}
        friendRequests={friendRequests}
        setFriendRequests={setFriendRequests}
        setChats={setChats}
        setClickedUser={setClickedUser}
      />
      <ChatLogs
        currentUser={currentUser}
        users={users}
        setFriendRequests={setFriendRequests}
        chats={chats}
        setChats={setChats}
        clickedUser={clickedUser}
      />
    </div>
  );
}
