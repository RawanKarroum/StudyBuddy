import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar/Navbar';
import MainLayout from './components/MainLayout/MainLayout';
import profilePic from './assets/react.svg';
import { fetchUserDetails, fetchUserInfo } from './services/AuthService';

const App: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('Guest');
  const [userList, setUserList] = useState<{ id: string, name: string, image: string }[]>([]);

  const showNavbar = location.pathname !== '/signup' && location.pathname !== '/login';

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser) {
        const userInfo = await fetchUserInfo(currentUser.uid);
        if (userInfo) {
          setDisplayName(`${userInfo.firstName} ${userInfo.lastName}`);
          if (userInfo.friends && userInfo.friends.length > 0) {
            const friendsList = await Promise.all(
              userInfo.friends.map(async (friendUid: string) => {
                const friendDetails = await fetchUserDetails(friendUid);
                return friendDetails;
              })
            );
            setUserList(friendsList.filter(Boolean) as { id: string, name: string, image: string }[]);
          }
        }
      }
    };
    getUserInfo();
  }, [currentUser]);

  return (
    <div className="container">
      {showNavbar && (
        <Navbar
          userImage={profilePic}
          userName={displayName}
          userList={userList}
        />
      )}
      <div className="main-content">
        <Routes>
          {showNavbar ? (
            <Route path="/*" element={<MainLayout />} />
          ) : (
            <>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

const AppWithRouter: React.FC = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWithRouter;