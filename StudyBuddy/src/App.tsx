import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar/Navbar';
import MainLayout from './components/MainLayout/MainLayout';
import profilePic from './assets/react.svg';

const userList = [
  { id: 1, name: 'Jane Doe', image: profilePic },
  { id: 2, name: 'John Smith', image: profilePic },
  { id: 3, name: 'Alice Johnson', image: profilePic }
];

const App: React.FC = () => {
  const location = useLocation();

  const showNavbar = location.pathname !== '/signup' && location.pathname !== '/login';

  return (
    <AuthProvider>
      <div className="container">
        {showNavbar && <Navbar userImage={profilePic} userName="John Doe" userList={userList} />}
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
    </AuthProvider>
  );
}

const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
