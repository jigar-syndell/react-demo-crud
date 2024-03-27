import { createReducer } from "@reduxjs/toolkit";


const sidebarInitialState = {
    collapsed: false,
    toggle: false,
  };

  const userInitialState = {
    user : null, 
    loggedIn : false
  }
  
  export const sideBarReducer = createReducer(sidebarInitialState, (builder) => {
    builder.addCase("TOGGLE_SIDEBAR", (state, action) => {
      state.collapsed = !state.collapsed;
    });
    builder.addCase("TOGGLE_SIDEBAR_MOBILE", (state, action) => {
      state.toggle = !state.toggle;
      state.collapsed = false;
    });
  });

  export const userReducer = createReducer(userInitialState, (builder) => {
    builder.addCase("LOAD_USER_SUCCESS", (state, action) => {
      state.user = action.payload.data.user;
      state.loggedIn = true;

    });
    builder.addCase("LOAD_USER_FAIL", (state, action) => {
      state.user = null;
      state.loggedIn = false;
    });
    builder.addCase("LOGOUT_USER", (state, action) => {
      state.user = null;
      state.loggedIn = false;
    });
  });