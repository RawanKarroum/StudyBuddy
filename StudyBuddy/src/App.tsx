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
import './App.css';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatPage';

const App = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('Guest');
  const [userList, setUserList] = useState<{ id: string, name: string, image: string }[]>([]);
  const [profilePicUrl, setProfilePicUrl] = useState('default.jpg');

  const showNavbar = location.pathname !== '/signup' && location.pathname !== '/login' && location.pathname !== '/';

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser) {
        const userInfo = await fetchUserInfo(currentUser.uid);
        if (userInfo) {
          setDisplayName(`${userInfo.firstName} ${userInfo.lastName}`);
          const profilePic = await getProfilePicUrl(userInfo.profilePicUrl || 'default.jpg');
          setProfilePicUrl(profilePic);
          if (userInfo.friends && userInfo.friends.length > 0) {
            const friendsList = await Promise.all(
              userInfo.friends.map(async (friendUid: string) => {
                const friendDetails = await fetchUserDetails(friendUid);
                if (friendDetails) {
                  const friendProfilePicUrl = await getProfilePicUrl(friendDetails.image);
                  return {
                    ...friendDetails,
                    image: friendProfilePicUrl,
                  };
                }
                return null;
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
          userImage={profilePicUrl}
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

const AppWithRouter = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWithRouter;
