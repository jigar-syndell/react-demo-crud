import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login';
import CircularProgress from '@mui/material/CircularProgress';
import Mainlayout from './layout/Mainlayout';
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./actions/generalActions";

// Containers
function App() {
  const dispatch = useDispatch();
  const { user, loggedIn } = useSelector((state) => state.User);
  let token = localStorage.getItem("token");
  if(token && !loggedIn){
    dispatch(loadUser())
  }


  return (
    <Router>
    <Suspense fallback={<CircularProgress color="primary" />}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/password/reset' element={<Login isPasswordResetPage={true} />} />
          <Route path="/*" element={<Mainlayout />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}


export default App
