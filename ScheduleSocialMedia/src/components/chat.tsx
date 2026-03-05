import { useDispatch, useSelector } from "react-redux";
import { createNewMessage } from "../apiCalls/message";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import "./chat.css";
import { getAllMessages } from "../apiCalls/message";
import type { Message } from "../apiCalls/message";
import moment from "moment";
import { setAllChats } from "../redux/usersSlice";
import { clearUnreadMessagesCount } from "../apiCalls/chat";

interface Member {
  _id: string;
  firstname: string;
  lastname: string;
}

function ChatArea() {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state: any) => state.userReducer,
  );
  const selectedUser = selectedChat.members.find(
    (u: Member) => u._id !== user._id,
  );
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
      };

      dispatch(showLoader());
      const response = await createNewMessage(newMessage);
      dispatch(hideLoader());

      if (response.success) {
        setMessage("");

        // UPDATE REDUX CHAT LAST MESSAGE
        const updatedChats = allChats.map((chat: any) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              lastMessage: { text: message, sender: user._id },
            };
          }
          return chat;
        });

        dispatch(setAllChats(updatedChats));

        // also add message to UI immediately
        setAllMessages([...allMessages, response.data]);
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const formatTime = (timestamp: any) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) {
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    } else if (diff === 1) {
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    } else {
      return moment(timestamp).format("MMM D, hh:mm A");
    }
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message); // Access the 'message' property safely
      } else {
        toast.error("An unknown error occurred."); // Handle non-Error types
      }
    }
  };

  const clearUnreadMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await clearUnreadMessagesCount(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        const updatedChats = allChats.map((chat: any) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              unreadMessageCount: 0,
            };
          }
          return chat;
        });

        dispatch(setAllChats(updatedChats));
      }
    } catch (error) {
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message); // Access the 'message' property safely
      } else {
        toast.error("An unknown error occurred."); // Handle non-Error types
      }
    }
  };

  useEffect(() => {
    getMessages();
    if (selectedChat.lastMessage.sender !== user._id) {
      clearUnreadMessages();
    }
  }, [selectedChat]);

  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {selectedUser.firstname + " " + selectedUser.lastname}
          </div>

          <div className="main-chat-area">
            {allMessages.map((msg) => {
              const isCurrentUserSender = msg.sender === user._id;
              return (
                <div
                  className="message-container"
                  style={
                    isCurrentUserSender
                      ? { justifyContent: "flex-end" }
                      : { justifyContent: "flex-start" }
                  }
                >
                  <div>
                    <div
                      className={
                        isCurrentUserSender
                          ? "send-message"
                          : "received-message"
                      }
                    >
                      {" "}
                      {msg.text}{" "}
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentUserSender
                          ? { float: "right" }
                          : { float: "left" }
                      }
                    >
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button
              className="fa fa-paper-plane send-message-btn"
              onClick={sendMessage}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
