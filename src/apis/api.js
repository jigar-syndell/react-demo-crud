import axios from "axios";
const url = import.meta.env.VITE_BACKEND_APP_URI;

const jsonconfig = {
  headers: {
    "Content-Type": "application/json",

  },
};
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};


// Login API
export const loginApi = async (loginCred) => {
  try {
    console.log(loginCred);
   const  {data} = await axios.post(`${url}/login`, loginCred, jsonconfig);
    if(data.success){
      localStorage.setItem("token", data.data.token)
    }
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};


//