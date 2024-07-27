import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/Firebase'; 
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

interface User {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    university: string;
    courses: string[];
    major: string;
    year: string;
    friends: string[];
  }
  
  const UsersPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUsers = async () => {
        if (currentUser) {
          const q = query(collection(db, 'Users'), where('uid', '!=', currentUser.uid));
          const querySnapshot = await getDocs(q);
          const usersData: User[] = [];
          querySnapshot.forEach((doc) => {
            usersData.push({ ...doc.data(), uid: doc.id } as User);
          });
          setUsers(usersData);
        }
      };
  
      fetchUsers();
    }, [currentUser]);
  
    const generateChatId = (user1: string, user2: string): string => {
      return [user1, user2].sort().join('_');
    };
  
    const addFriendAndStartChat = async (user: User) => {
      if (currentUser) {
        const chatId = generateChatId(currentUser.uid, user.uid);
  
        const userRef = doc(db, 'Users', currentUser.uid);
        const friendRef = doc(db, 'Users', user.uid);
  
        await updateDoc(userRef, {
          friends: arrayUnion(user.uid),
        });
        await updateDoc(friendRef, {
          friends: arrayUnion(currentUser.uid),
        });
  
        navigate(`/chat/${chatId}`);
      }
    };
  
    return (
      <div>
        <h1>Users</h1>
        <ul>
          {users.map((user) => (
            <li key={user.uid} onClick={() => addFriendAndStartChat(user)}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default UsersPage;