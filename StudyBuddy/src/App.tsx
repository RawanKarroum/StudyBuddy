import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import profilePic from './assets/react.svg';

const userList = [
  { id: 1, name: 'Jane Doe', image: profilePic },
  { id: 2, name: 'John Smith', image: profilePic },
  { id: 3, name: 'Alice Johnson', image: profilePic }
];

const App: React.FC = () => {
  return (
      <div>
          <Navbar userImage={profilePic} userName="John Doe" userList={userList} />
      </div>
  );
};

export default App;
