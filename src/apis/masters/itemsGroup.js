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
  },
};

// Login API
export const getItemsGroups = async () => {
  try {
    const { data } = await axios.get(`${url}/itemGroup`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// create pick list type
export const createItemsGroup = async (payload) => {
  try {
    const { data } = await axios.post(`${url}/itemGroup`, payload, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// update pick list type
export const updateItemsGroup = async (payload) => {
  try {
    const { data } = await axios.put(
      `${url}/itemGroup/${payload.id}`,
      payload.data,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// delete pick list type
export const deleteItemsGroup = async (id) => {
  try {
    const { data } = await axios.delete(`${url}/itemGroup/${id}`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};
