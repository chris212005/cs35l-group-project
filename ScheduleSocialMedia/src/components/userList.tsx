import { useDispatch, useSelector } from "react-redux";
import "./userList.css";
import toast from "react-hot-toast";
import { createNewChat } from "../apiCalls/chat";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/usersSlice";
import { useEffect } from "react";
import store from "../redux/store";

type UsersListProps = {
  searchKey: string;
  socket: any;
};

interface Member {
  _id: string;
}

interface Chat {
  members: Member[];
}

export default function UsersList({ searchKey, socket }: UsersListProps) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state: any) => state.userReducer);

  const dispatch = useDispatch();

  const startNewChat = async (searchedUserId: string) => {
    let response = null;

    try {
      dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);

        const newChat = response.data;
        const updatedChat = [...allChats, newChat];

        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error("Something went wrong");
    }
  };

  const openChat = (selectedUserId: string) => {
    const chat = allChats.find(
      (chat: Chat) =>
        chat.members.some((m: Member) => m._id === selectedUserId) &&
        chat.members.some((m: Member) => m._id === currentUser._id)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const IsSelectedChat = (user: any) => {
    if (!selectedChat) return false;

    return selectedChat.members.map((m: Member) => m._id).includes(user._id);
  };

  const getChat = (userId: string) => {
    return allChats.find(
      (chat: Chat) =>
        chat.members.some((m: Member) => m._id === userId) &&
        chat.members.some((m: Member) => m._id === currentUser._id)
    );
  };

  const getLastMessage = (userId: string) => {
    const chat = getChat(userId);

    if (!chat || !(chat as any).lastMessage) return "";

    const lastMessage = (chat as any).lastMessage;

    if (lastMessage.sender === currentUser._id) {
      return `You: ${lastMessage.text}`;
    }

    const sender = allUsers.find((u: any) => u._id === lastMessage.sender);

    if (!sender) return lastMessage.text;

    return `${sender.firstname} ${sender.lastname}: ${lastMessage.text}`;
  };

  const getLastMessageTime = (userId: string) => {
    const chat = getChat(userId);

    if (!chat || !(chat as any).lastMessage) return "";

    const date = new Date((chat as any).lastMessage.createdAt);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    socket.on("receive-message", (message: any) => {
      const selectedChat: any = store.getState().userReducer.selectedChat;
      let allChats: any[] = store.getState().userReducer.allChats;

      if (selectedChat?._id !== message.chatId) {
        const updatedchats = allChats.map((chat: any) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
              lastMessage: message,
            };
          }
          return chat;
        });
        allChats = updatedchats;
      }
      //1.Find the latest Chat
      const latestChat = allChats.find((chat) => chat._id === message.chatId);

      //2. Get all other chats
      const otherChats = allChats.filter((chat) => chat._id !== message.chatId);

      //3. Create a new array latest chat on top & then other chats
      allChats = [latestChat, ...otherChats];

      dispatch(setAllChats(allChats));
    });
  }, []);

  const getUnreadMessageCount = (userId: string) => {
    const chat = getChat(userId);

    console.log("CHAT OBJECT:", chat);

    if (
      chat &&
      (chat as any).unreadMessageCount &&
      (chat as any).lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          {" "}
          {(chat as any).unreadMessageCount}{" "}
        </div>
      );
    }

    return "";
  };

  function getData() {
    if (searchKey === "") {
      const sortedChats = [...allChats].sort((a: any, b: any) => {
        const timeA = a.lastMessage?.createdAt
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;

        const timeB = b.lastMessage?.createdAt
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;

        return timeB - timeA;
      });

      const usersFromChats = sortedChats.map((chat: any) =>
        chat.members.find((m: Member) => m._id !== currentUser._id)
      );

      const uniqueUsers = usersFromChats.filter(
        (user: any, index: number, self: any[]) =>
          user && index === self.findIndex((u) => u._id === user._id)
      );

      return uniqueUsers;
    } else {
      return allUsers.filter(
        (user: any) =>
          user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())
      );
    }
  }

  return (
    <>
      {getData().map((obj: any) => {
        const user = obj;

        if (!user) return null;

        return (
          <div
            className="user-search-filter"
            onClick={() => openChat(user._id)}
            key={user._id}
          >
            <div
              className={
                IsSelectedChat(user) ? "selected-user" : "filtered-user"
              }
            >
              <div className="filter-user-display">
                {/* Avatar */}
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="user-profile-image"
                  />
                ) : (
                  <div
                    className={
                      IsSelectedChat(user)
                        ? "user-selected-avatar"
                        : "user-default-avatar"
                    }
                  >
                    {user.firstname.charAt(0).toUpperCase() +
                      user.lastname.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name + message */}
                <div className="filter-user-details">
                  <div className="user-display-name">
                    {user.firstname + " " + user.lastname}
                  </div>

                  <div className="user-display-email">
                    {getLastMessage(user._id) || user.email}
                  </div>
                </div>

                {/* Right side */}
                <div className="user-chat-meta">
                  {getUnreadMessageCount(user._id)}

                  <div className="user-display-time">
                    {getLastMessageTime(user._id)}
                  </div>
                </div>

                {/* Start chat button */}
                {!allChats?.find((chat: any) =>
                  chat.members.map((m: Member) => m._id).includes(user._id)
                ) && (
                  <div className="user-start-chat">
                    <button
                      className="user-start-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        startNewChat(user._id);
                      }}
                    >
                      Start Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
