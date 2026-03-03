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
  members: Member[]; // Array of Member objects
}

export default function UsersList({ searchKey }: UsersListProps) {
  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat
  } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch();
  const startNewChat = async (searchedUserId: string) => {
    console.log("BUTTON CLICKED");
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
      toast.error(response.message);
      dispatch(hideLoader());
    }
  };

  const openChat = (selectedUserId: string) => {
    const chat = allChats.find((chat: Chat) => 
      chat.members.map((m: Member) => m._id).includes(selectedUserId) && 
      chat.members.map((m: Member) => m._id).includes(currentUser._id)
    )

    if(chat){
      dispatch(setSelectedChat(chat));
    }
  }

  const IsSelectedChat = (user: any) => {
    if(selectedChat){
      return selectedChat.members.map((m: Member) => m._id).includes(user._id);
    }

    return false;
  }

  return allUsers
    .filter(
      (user: any) =>
        ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())) &&
          searchKey) ||
        allChats.some((chat: any) => chat.members.map((m: Member) => m._id).includes(user._id))
    )
    .map((user: any) => (
      <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id}>
        <div className= {IsSelectedChat(user) ? "selected-user": "filtered-user"}>
          <div className="filter-user-display">
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="user-profile-image"
              />
            )}
            {!user.profilePic && (
              <div className={IsSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}>
                {user.firstname.charAt(0).toUpperCase() +
                  user.lastname.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="filter-user-details">
              <div className="user-display-name">
                {user.firstname + " " + user.lastname}
              </div>
              <div className="user-display-email">{user.email}</div>
            </div>
            {!allChats?.find((chat: any) => chat.members.map((m: Member) => m._id).includes(user._id)) && 
            (
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
