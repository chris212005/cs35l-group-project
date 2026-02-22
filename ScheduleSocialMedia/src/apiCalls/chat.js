import { axiosInstance } from './index';

export const getAllChats = async () => {
  try {
    const response = await axios.get('/api/chat/getAllChats')
    return response.data;
  } catch (error) {
    return error;
  }
}

