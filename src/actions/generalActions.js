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

export const toggleSidebar = () => {
    return { type: "TOGGLE_SIDEBAR" };
  };

export const MobileToggleSidebar = () => {
    return { type: "TOGGLE_SIDEBAR_MOBILE" };
  };

  export const loadUser = () => async (dispatch) => {
    try {
      const { data } = await axios.get(`${url}/get-user`, jsonconfig);
      if(data.success){
        dispatch({ type: "LOAD_USER_SUCCESS", payload: data });
      }
    } catch (error) {
      dispatch({ type: "LOAD_USER_FAIL", payload: error });
    }
  };

  export const logoutUser = () => async (dispatch) => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT_USER", payload: "data" });
  };