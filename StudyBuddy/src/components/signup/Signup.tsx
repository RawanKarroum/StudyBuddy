import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { handleError } from '../../utils/errorHandler';
import './SignUp.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, {
        firstName,
        lastName,
        university,
        courses,
        major,
        year,
        profilePic,
      });
      navigate('/users');
    } catch (error) {
      alert(handleError(error).message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
          className="signup-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="signup-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="University"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={courses.join(',')}
          onChange={(e) => setCourses(e.target.value.split(','))}
          placeholder="Courses (comma separated)"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="Major"
          required
          className="signup-input"
        />
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          required
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
