import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;