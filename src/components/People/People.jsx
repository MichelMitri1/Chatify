import React, { useEffect, useState, useRef } from "react";
import { IoSettingsOutline, IoPersonSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebaseComponents";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import "./people.css";

export default function People({
  currentUser,
  users,
  friendRequests,
  setFriendRequests,
  setChats,
  setClickedUser,
}) {
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [originalFriendRequests, setOriginalFriendRequests] = useState([]);
  const originalFriendRequestsSet = useRef(false);

  const searchForFriend = (e) => {
    const name = e.target.value;
    if (!name) {
      setFriendRequests(originalFriendRequests);
      return;
    }
    const filteredFriends = originalFriendRequests.filter(
      (user) => user.nameOfUserSent.toLowerCase().includes(name) && user.friends
    );

    setFriendRequests(filteredFriends);
  };

  const openChat = async (user) => {
    setClickedUser(user);
    let id = currentUser.uid + user.idOfUserSent;
    try {
      const response = await fetch(
        `http://10.40.13.145:3000/api/users/getSpecificChatForUser/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Chat");
      }
      const data = await response.json();
      setChats(data);
      navigate(`/main/${id}`);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAcceptRequest = async (idOfUserSent) => {
    try {
      const acceptReq = "http://10.40.13.145:3000/api/users/acceptRequest";

      const foundUser = users.find((user) => user.userId === idOfUserSent);
      console.log("test");

      const userResponse = await fetch(acceptReq, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUser: currentUser,
          idOfUserSent: idOfUserSent,
          foundUser: foundUser,
        }),
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(
          `HTTP error! status: ${userResponse.status}, message: ${errorText}`
        );
      }

      await userResponse.json();

      toast.success("Friend Request Accepted!");
    } catch (error) {
      console.error("Error Accepting Friend", error);
      toast.error(error.message);
    }
  };

  const handleDeclineRequest = async (idOfUserSent) => {
    try {
      const acceptReq = "http://10.40.13.145:3000/api/users/declineRequest";

      const foundUser = users.find((user) => user.userId === idOfUserSent);

      const userResponse = await fetch(acceptReq, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUser: currentUser,
          idOfUserSent: idOfUserSent,
          foundUser: foundUser,
        }),
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(
          `HTTP error! status: ${userResponse.status}, message: ${errorText}`
        );
      }

      await userResponse.json();

      toast.success("Friend Request Declined!");
    } catch (error) {
      console.error("Error Accepting Friend", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const requestCollection = collection(
      db,
      "allRequests",
      currentUser.uid,
      "friendRequests"
    );
    const unsubscribeRequests = onSnapshot(requestCollection, (snapshot) => {
      const updatedRequests = snapshot.docs.map((doc) => doc.data());
      setFriendRequests(updatedRequests);
    });
    return () => {
      unsubscribeRequests();
    };
  }, [currentUser.uid, setFriendRequests]);

  useEffect(() => {
    if (!originalFriendRequestsSet.current && friendRequests.length > 0) {
      setOriginalFriendRequests(friendRequests);
      originalFriendRequestsSet.current = true;
    }
  }, [friendRequests]);

  return (
    <div className="peopleContainer">
      <Toaster />
      <div className="peopleNavContainer">
        <div className="">
          <h2 className="chatsHeader">Chats</h2>
        </div>
        <div className="iconsContainer">
          <IoSettingsOutline
            className="icon"
            onClick={() => navigate("/settings")}
          />
          <IoPersonSharp className="icon" />
          <IoIosSearch
            className="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
          {isSearchOpen ? (
            <input
              type="text"
              className="searchInput"
              placeholder="Search Friend"
              onChange={(e) => searchForFriend(e)}
            />
          ) : null}
        </div>
      </div>
      <div className="peopleWrapper">
        {friendRequests.length > 0 ? (
          friendRequests
            .filter((request) => !request.friends)
            .map((request) => (
              <div className="friendRequestWrapper">
                <h3 key={request.id} className="nameOfUserSent">
                  {request.nameOfUserSent}
                </h3>
                <div className="reqButtons">
                  <button
                    className="acceptReqButton"
                    onClick={() => handleAcceptRequest(request.idOfUserSent)}
                  >
                    <FaCheck className="iconSmall" />
                  </button>
                  <button className="declineReqButton">
                    <IoClose
                      className="iconSmall"
                      onClick={() => handleDeclineRequest(request.idOfUserSent)}
                    />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="noFriendMessageContainer">
            <h2 className="notFoundMessage">
              {isSearchOpen ? "Could Not Find User" : "Add Friend To Chat"}
            </h2>
          </div>
        )}
        {friendRequests.length > 0
          ? friendRequests
              .filter(
                (user) => user.userId !== currentUser?.uid && user.friends
              )
              .map((user) => (
                <div
                  className="chatWrapper"
                  key={user.id}
                  onClick={() => openChat(user)}
                >
                  <h2 className="username">{user.nameOfUserSent}</h2>
                  <p className="lastMessage">last message sent</p>
                </div>
              ))
          : null}
      </div>
    </div>
  );
}
