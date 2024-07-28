import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatPage from '../../pages/ChatPage';
import UsersPage from '../../pages/UsersPage';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default MainLayout;
