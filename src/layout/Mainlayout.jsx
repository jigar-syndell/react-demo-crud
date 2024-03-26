import React from 'react';
import Header from '../components/header/Header';
import AppSidebar from '../components/sidebar/Appsidebar';
import Appcontent from '../components/appContent/Appcontent';

function MainLayout() {
  return (
    <div className="flex-col h-screen">
      <Header />
      <div className="flex flex-grow  bg-#f7f7f7 ">
        <AppSidebar />
        <div className="flex flex-grow bg-#f7f7f7 overflow-x-auto">
          <Appcontent />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
