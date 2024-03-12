import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login';
import CircularProgress from '@mui/material/CircularProgress';

// Containers
const Mainlayout = React.lazy(() => import('./layout/Mainlayout'))
function App() {
  return (
    <Router>
    <Suspense fallback={<CircularProgress color="primary" />}>
      <Routes>
        <Route key='/login' path='/login' element={
            <Login />
        } />
        <Route key='/' path='/' element={<Login />} />
        <Route key='password/reset' path='password/reset' element={<Login isPasswordResetPage={true} />} />
        <Route key='*' path="*" name="Home" element={<Mainlayout />} />
      </Routes>
      </Suspense>
    </Router>
  );
}


export default App
