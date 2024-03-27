import axios from "axios";
const url = import.meta.env.VITE_BACKEND_APP_URI;

let token = localStorage.getItem("token");
const jsonconfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
};

// Login API
export const getPickListTypes = async () => {
  try {
    const { data } = await axios.get(`${url}/pickListType`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// create pick list type
export const createPickListType = async (payload) => {
  try {
    const { data } = await axios.post(
      `${url}/pickListType`,
      payload,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// update pick list type
export const updatePickListType = async (payload) => {
  try {
    const { data } = await axios.put(
      `${url}/pickListType/${payload.id}`,
      payload.data,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// delete pick list type
export const deletePickListType = async (id) => {
  try {
    const { data } = await axios.delete(
      `${url}/pickListType/${id}`,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};
