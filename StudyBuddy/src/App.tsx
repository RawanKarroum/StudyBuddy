import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UsersPage from './pages/UsersPage';
import Navbar from './components/Navbar/Navbar';
import profilePic from './assets/react.svg';

const userList = [
  { id: 1, name: 'Jane Doe', image: profilePic },
  { id: 2, name: 'John Smith', image: profilePic },
  { id: 3, name: 'Alice Johnson', image: profilePic }
];

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar userImage={profilePic} userName="John Doe" userList={userList} />
          <div className="content">
            <Routes>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/chat/:chatId" element={<ChatPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
