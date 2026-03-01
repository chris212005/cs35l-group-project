import { axiosInstance } from "./index";

// SAVE schedule
export const saveSchedule = async (schedule) => {
  try {
    const response = await axiosInstance.post(
      "/api/schedule/save-schedule",
      { schedule }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET schedule
export const getMySchedule = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/schedule/get-user-schedule"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// Delete Schedule
export const deleteSchedule = async () => {
  try {
    const response = await axiosInstance.delete(
      "/api/schedule/delete-schedule"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};