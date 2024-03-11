import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login';

// Containers
const Mainlayout = React.lazy(() => import('./layout/Mainlayout'))
function App() {
  return (
    <Router>
      <Routes>
        <Route key='/login' path='/login' element={
            <Login />
        } />
        <Route key='/' path='/' element={<Login />} />
        <Route key='password/reset' path='password/reset' element={<Login isPasswordResetPage={true} />} />
        <Route key='*' path="*" name="Home" element={<Mainlayout />} />
      </Routes>
    </Router>
  );
}


export default App
