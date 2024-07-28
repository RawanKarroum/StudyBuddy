import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar/Navbar';
import MainLayout from './components/MainLayout/MainLayout';
import { fetchUserDetails, fetchUserInfo, getProfilePicUrl } from './services/AuthService';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('Guest');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userList, setUserList] = useState<{ id: string, name: string, image: string }[]>([]);

  const showNavbar = location.pathname !== '/signup' && location.pathname !== '/login' && location.pathname !== '/';

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser) {
        const userInfo = await fetchUserInfo(currentUser.uid);
        if (userInfo) {
          setDisplayName(`${userInfo.firstName} ${userInfo.lastName}`);
          const profilePicUrl = await getProfilePicUrl(userInfo.profilePicUrl || 'default.jpg');
          setUserImage(profilePicUrl);
          console.log("Fetched Profile Pic URL:", profilePicUrl); // Debug log
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
          userImage={userImage || 'default.jpg'}
          userName={displayName}
          userList={userList}
        />
      )}
      <div className={showNavbar ? 'main-content' : 'full-width'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {showNavbar && (
            <Route path="/*" element={<MainLayout />}>
              <>
                <Route path="users" element={<UsersPage />} />
                <Route path="chat/:chatId" element={<ChatPage />} />
              </>
            </Route>
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
