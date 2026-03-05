import { useDispatch, useSelector } from "react-redux";
import "./userList.css";
import toast from "react-hot-toast";
import { createNewChat } from "../apiCalls/chat";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/usersSlice";

type UsersListProps = {
  searchKey: string;
};

interface Member {
  _id: string;
}

interface Chat {
  members: Member[];
}

export default function UsersList({ searchKey }: UsersListProps) {
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
        chat.members.some((m: Member) => m._id === currentUser._id),
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
        chat.members.some((m: Member) => m._id === currentUser._id),
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

  const getUnreadMessageCount = (userId: string) => {
    const chat = getChat(userId);

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

  return allUsers
    .filter(
      (user: any) =>
        ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())) &&
          searchKey) ||
        allChats.some((chat: any) =>
          chat.members.map((m: Member) => m._id).includes(user._id),
        ),
    )
    .map((user: any) => (
      <div
        className="user-search-filter"
        onClick={() => openChat(user._id)}
        key={user._id}
      >
        <div
          className={IsSelectedChat(user) ? "selected-user" : "filtered-user"}
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

            {/* Right side (counter + time) */}
            <div className="user-chat-meta">
              {getUnreadMessageCount(user._id) && (
                <div className="unread-message-counter">
                  {getUnreadMessageCount(user._id)}
                </div>
              )}

              <div className="user-display-time">
                {getLastMessageTime(user._id)}
              </div>
            </div>

            {/* Start chat button */}
            {!allChats?.find((chat: any) =>
              chat.members.map((m: Member) => m._id).includes(user._id),
            ) && (
              <div className="user-start-chat">
                <button
                  className="user-start-chat-btn"
                  onClick={() => startNewChat(user._id)}
                >
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
}
