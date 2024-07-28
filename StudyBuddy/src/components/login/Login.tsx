import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import './Login.css'; 
import { handleError } from '../../utils/errorHandler';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { logIn } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await logIn(email, password);
            navigate('/users');
        } catch (error) {
            handleError(error)
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
