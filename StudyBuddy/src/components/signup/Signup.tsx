import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { handleError } from '../../utils/errorHandler';

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
      alert('User signed up successfully!');
    } catch (error) {
      alert(handleError(error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
        placeholder="University"
        required
      />
      <input
        type="text"
        value={courses.join(',')}
        onChange={(e) => setCourses(e.target.value.split(','))}
        placeholder="Courses (comma separated)"
        required
      />
      <input
        type="text"
        value={major}
        onChange={(e) => setMajor(e.target.value)}
        placeholder="Major"
        required
      />
      <input
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;