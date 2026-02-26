import { axiosInstance } from './index';

export const getLoggedUser = async () => {
    try {
        const response = await axiosInstance.get('/api/user/get-logged-user');
        return response.data;
    } catch (error) {
        console.error('Error fetching logged user:', error);
        return null;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/api/user/get-all-users');
        return response.data;
    } catch (error) {
        console.error('Error fetching logged user:', error);
        return null;
    }
}



