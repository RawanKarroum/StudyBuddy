import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { db } from '../config/Firebase'; 
import { useAuth } from '../context/AuthContext'; 
import '../components/chat/ChatPage.css'

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mocked user data for demonstration purposes
  const userProfile = {
      fullName: 'John Doe',
      profilePicture: 'https://via.placeholder.com/80',
      email: 'john.doe@example.com',
      courses: ['Course 1', 'Course 2', 'Course 3'],
      major: 'Computer Science',
      year: 'Sophomore'
  };

  useEffect(() => {
      if (currentUser && chatId) {
          const q = query(
              collection(db, 'messages'),
              where('chatId', '==', chatId),
              orderBy('createdAt', 'asc')
          );
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const messagesData: Message[] = [];
              querySnapshot.forEach((doc) => {
                  messagesData.push({ id: doc.id, ...doc.data() } as Message);
              });
              setMessages(messagesData);
              scrollToBottom();
          });

          return () => unsubscribe();
      }
  }, [currentUser, chatId]);

  const scrollToBottom = () => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const sendMessage = async () => {
      if (currentUser && newMessage.trim() && chatId) {
          await addDoc(collection(db, 'messages'), {
              senderId: currentUser.uid,
              text: newMessage,
              createdAt: new Date(),
              chatId,
          });
          setNewMessage('');
          scrollToBottom();
      }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
      }
  };

  if (!currentUser) {
      return <Navigate to="/login" />;
  }

  return (
      <div className="chat-container">
          <div className="profile-header">
              <img src={userProfile.profilePicture} alt="User" className="profile-picture" />
              <div className="profile-details">
                  <div className="profile-name">{userProfile.fullName}</div>
                  <div className="profile-info"><strong>Email:</strong> {userProfile.email}</div>
                  <div className="profile-info"><strong>Courses:</strong> {userProfile.courses.join(', ')}</div>
                  <div className="profile-info"><strong>Major:</strong> {userProfile.major}</div>
                  <div className="profile-info"><strong>Year:</strong> {userProfile.year}</div>
              </div>
          </div>
          <div className="messages-container">
              {messages.map((message) => (
                  <div
                      key={message.id}
                      className={`message-bubble ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}
                  >
                      {message.text}
                  </div>
              ))}
              <div ref={messagesEndRef} />
          </div>
          <div className="message-input-container">
              <textarea
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
              />
              <button className="send-button" onClick={sendMessage}>Send</button>
          </div>
      </div>
  );
};

export default ChatPage;