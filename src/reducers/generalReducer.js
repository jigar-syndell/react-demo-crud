import { createReducer } from "@reduxjs/toolkit";


const sidebarInitialState = {
    collapsed: false,
    toggle: false,
  };
  
  export const sideBarReducer = createReducer(sidebarInitialState, (builder) => {
    builder.addCase("TOGGLE_SIDEBAR", (state, action) => {
      state.collapsed = !state.collapsed;
    });
    builder.addCase("TOGGLE_SIDEBAR_MOBILE", (state, action) => {
      state.toggle = !state.toggle;
      state.collapsed = false;
    });
  });