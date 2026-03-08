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
import { useNavigate } from "react-router-dom";
import store from "../redux/store";

interface Member {
  _id: string;
  firstname: string;
  lastname: string;
}

function ChatArea({ socket }: any) {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state: any) => state.userReducer
  );

  console.log(user);

  const selectedUser = selectedChat?.members?.find(
    (u: Member) => u._id !== user._id
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

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat.members.map((m: any) => m._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      const response = await createNewMessage(newMessage);

      if (response.success) {
        setMessage("");

        // UPDATE REDUX CHAT LAST MESSAGE
        const updatedChats = allChats.map((chat: any) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              lastMessage: {
                text: message,
                sender: user._id,
                createdAt: new Date().toISOString(),
              },
            };
          }
          return chat;
        });

        dispatch(setAllChats(updatedChats));
      }
    } catch (error) {
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
      socket.emit("clear-unread-messages", {
        chatId: selectedChat._id,
        members: selectedChat.members.map((m: any) => m._id),
      });
      const response = await clearUnreadMessagesCount(selectedChat._id);
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
      if (error instanceof Error) {
        toast.error(error.message); // Access the 'message' property safely
      } else {
        toast.error("An unknown error occurred."); // Handle non-Error types
      }
    }
  };

  const navigate = useNavigate();

  const viewSchedule = () => {
    if (!selectedUser?._id) return;
    navigate(`/schedule/${selectedUser._id}`);
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }

    socket.on("receive-message", (message: any) => {
      const selectedChat: any = store.getState().userReducer.selectedChat;
      if (selectedChat._id === message.chatId) {
        setAllMessages((prevmsg: any[]) => [...prevmsg, message]);
      }

      if (selectedChat._id === message.chatId && message.sender !== user._id) {
        clearUnreadMessages();
      }
    });
    socket.on("message-count-cleared", (data: any) => {
      const selectedChat: any = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if (selectedChat._id === data.chatId) {
        //updating unread message count in chat object
        const updatedChats = allChats.map((chat: any) => {
          if (chat._id === data.chatId) {
            return { ...chat, unreadMessageCount: 0 };
          }
          return chat;
        });
        dispatch(setAllChats(updatedChats));

        //updating read property in message object
        setAllMessages((prevMsgs) => {
          return prevMsgs.map((msg) => {
            return { ...msg, read: true };
          });
        });
      }
    });
    return () => {
      socket.off("receive-message");
      socket.off("message-count-cleared");
    };
  }, [selectedChat]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area")!;

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allMessages]);

  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            <button className="view-schedule-btn" onClick={viewSchedule}>
              📅 View Their Schedule
            </button>

            <span className="chat-user-name">
              {selectedUser?.firstname + " " + selectedUser?.lastname}
            </span>
          </div>

          <div className="main-chat-area" id="main-chat-area">
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
                      {formatTime(msg.createdAt)}{" "}
                      {isCurrentUserSender && msg.read === true && (
                        <i
                          className="fa fa-check-circle"
                          aria-hidden="true"
                          style={{ color: "#e74c3c" }}
                        ></i>
                      )}
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
