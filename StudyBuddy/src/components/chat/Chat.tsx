import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../../config/Firebase'; 
import { useAuth } from '../../context/AuthContext'; 
import { Navigate } from 'react-router-dom'; 

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

const Chat: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'messages'), orderBy('createdAt'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const sendMessage = async () => {
    if (currentUser && newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        text: newMessage,
        createdAt: new Date()
      });
      setNewMessage('');
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', marginBottom: '20px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              textAlign: message.senderId === currentUser.uid ? 'right' : 'left',
              padding: '10px',
              margin: '10px',
              backgroundColor: message.senderId === currentUser.uid ? '#DCF8C6' : '#FFFFFF'
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
