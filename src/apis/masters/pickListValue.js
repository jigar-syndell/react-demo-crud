import axios from "axios";
const url = import.meta.env.VITE_BACKEND_APP_URI;

let token = localStorage.getItem("token");
const jsonconfig = {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
};
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

// Login API
export const getPickListValues = async () => {
    try {
     const  {data} = await axios.get(`${url}/pickListValue`, jsonconfig);
      return data;
    } catch (error) {
      return { success: false, error: error.response };
    }
  };


// create pick list type
export const createPickListValue = async (payload) => {
    try {
     const  {data} = await axios.post(`${url}/pickListValue`,payload,jsonconfig);
      return data;
    } catch (error) {
      return { success: false, error: error.response };
    }
  };

// update pick list type
export const updatePickListValue = async (payload) => {
    try {
     const  {data} = await axios.put(`${url}/pickListValue/${payload.id}`, payload.data,jsonconfig);
      return data;
    } catch (error) {
      return { success: false, error: error.response };
    }
  };

// delete pick list type
export const deletePickListValue = async (id) => {
    try {
     const  {data} = await axios.delete(`${url}/pickListValue/${id}`,jsonconfig);
      return data;
    } catch (error) {
      return { success: false, error: error.response };
    }
  };