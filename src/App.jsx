import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login';
import CircularProgress from '@mui/material/CircularProgress';
import Mainlayout from './layout/Mainlayout';

// Containers
function App() {
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
