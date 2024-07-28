import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar/Navbar';
// import MainLayout from './components/MainLayout/MainLayout';
import profilePic from './assets/react.svg';
import './App.css';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatPage';

const userList = [
  { id: 1, name: 'Jane Doe', image: profilePic },
  { id: 2, name: 'John Smith', image: profilePic },
  { id: 3, name: 'Alice Johnson', image: profilePic }
];

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/signup' && location.pathname !== '/login' && location.pathname !== '/';

  return (
    <AuthProvider>
      <div className="app-container">
        {showNavbar && <Navbar userImage={profilePic} userName="John Doe" userList={userList} />}
        <div className={showNavbar ? 'main-content' : 'full-width'}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            {showNavbar && (
              // <Route path="/*" element={<MainLayout />}>
                <>
                <Route path="users" element={<UsersPage />} />
                <Route path="chat/:chatId" element={<ChatPage />} />
                </>
              // </Route>
            )}
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
