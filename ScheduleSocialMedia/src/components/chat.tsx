import { useSelector } from "react-redux";

interface Member {
    _id: string;
}

function ChatArea(){
    const { selectedChat, user } = useSelector((state: any) => state.userReducer);
    const selectedUser = selectedChat.members.find((u: Member) => u._id !== user._id)

    return <>
        {selectedChat && <div className="app-chat-area">
            <div className="app-chat-area-header">
                { selectedUser.firstname + ' ' + selectedUser.lastname }
            </div>
            <div>
                CHAT AREA
            </div>
            <div>
                SEND MESSAGE
            </div>
            </div>}
    </>
}

export default ChatArea;