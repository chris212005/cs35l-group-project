import { axiosInstance, url } from './index';

export const getLoggedUser = async () => {
    try {
        const response = await axiosInstance.get(url + '/api/user/get-logged-user');
        return response.data;
    } catch (error) {
        console.error('Error fetching logged user:', error);
        return null;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(url + '/api/user/get-all-users');
        return response.data;
    } catch (error) {
        console.error('Error fetching logged user:', error);
        return null;
    }
}

export const updateProfile = async (payload) => {
    try {
        const response = await axiosInstance.put(url + '/api/user/update-profile', payload);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        return null;
    }
}



