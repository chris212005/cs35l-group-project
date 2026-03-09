import { axiosInstance, url } from './index';

export const getAllChats = async () => {
  try {
    const response = await axiosInstance.get('/api/chat/get-all-chats')
    return response.data;
  } catch (error) {
    return error;
  }
}

export const createNewChat = async ( members ) => {
  try {
    //changed to axiosInstance
    const response = await axiosInstance.post('/api/chat/create-new-chat', { members });
    return response.data;
  } catch (error) {
    return error;
  }
}

export const clearUnreadMessagesCount = async (chatId) => {
  try {
    const response = await axiosInstance.post('/api/chat/clear-unread-message', { chatId: chatId });
    return response.data;
  } catch (error) {
    return error;
  }
}
