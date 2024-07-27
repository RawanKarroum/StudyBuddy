import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../config/Firebase'; 
import { useAuth } from '../context/AuthContext'; 

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date;
  chatId: string;
}

const ChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (currentUser && chatId) {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        orderBy('createdAt')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [currentUser, chatId]);

  const sendMessage = async () => {
    if (currentUser && newMessage.trim() && chatId) {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser.uid,
        text: newMessage,
        createdAt: new Date(),
        chatId,
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

export default ChatPage;