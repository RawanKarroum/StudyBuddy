import React from 'react';
import { Link } from 'react-router-dom';
import '../components/LandingPage/LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <h1>StudyBuddy</h1>
      <div className="buttons-container">
        <Link to="/signup" className="landing-button">Sign Up</Link>
        <Link to="/login" className="landing-button">Login</Link>
      </div>
    </div>
  );
};

export default LandingPage;
