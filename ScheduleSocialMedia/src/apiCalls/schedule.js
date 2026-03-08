import { axiosInstance } from "./index";

// SAVE schedule
export const saveSchedule = async (schedule) => {
  try {
    const response = await axiosInstance.post(
      url + "/api/schedule/save-schedule",
      { schedule }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET my schedule
export const getMySchedule = async () => {
  try {
    const response = await axiosInstance.get(
      url + "/api/schedule/get-user-schedule"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// ⭐ GET another user's schedule
export const getUserSchedule = async (userId) => {
  try {
    const response = await axiosInstance.get(
      url + `/api/schedule/get-user-schedule/${userId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// DELETE schedule
export const deleteSchedule = async () => {
  try {
    const response = await axiosInstance.delete(
      url + "/api/schedule/delete-schedule"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};