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
export const getItems = async () => {
  try {
    const { data } = await axios.get(`${url}/item`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// Login API
export const getsingleItem = async (id) => {
  try {
    const { data } = await axios.get(`${url}/item/${id}`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// create pick list type
export const createItems = async (payload) => {
  try {
    const { data } = await axios.post(`${url}/item`, payload, formDataconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// update pick list type
export const updateItems = async (payload) => {
  try {
    const { data } = await axios.put(
      `${url}/item/${payload.id}`,
      payload.data,
      formDataconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// delete pick list type
export const deleteItems = async (id) => {
  try {
    const { data } = await axios.delete(`${url}/item/${id}`, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};
