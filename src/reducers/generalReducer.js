import { createReducer } from "@reduxjs/toolkit";


const sidebarInitialState = {
    collapsed: false,
  };
  
  export const sideBarReducer = createReducer(sidebarInitialState, (builder) => {
    builder.addCase("TOGGLE_SIDEBAR", (state, action) => {
      state.collapsed = !state.collapsed; // Toggle the collapsed state
    });
  });