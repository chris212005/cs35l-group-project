import { axiosInstance } from './index';

export const getAllChats = async () => {
  try {
    const response = await axios.get('/api/chat/getAllChats')
    return response.data;
  } catch (error) {
    return error;
  }
}

export const createNewChat = async ( members ) => {
  try {
    const response = await axios.post('/api/chat/create-new-chat', { members })
    return response.data;
  } catch (error) {
    return error;
  }
}

