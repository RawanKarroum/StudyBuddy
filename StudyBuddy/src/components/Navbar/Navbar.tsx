import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import { fetchUserInfo, fetchUserDetails } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

interface User {
    id: string;
    name: string;
    image: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    university?: string;
    courses?: string[];
    major?: string;
    year?: string;
}

interface NavbarProps {
    userImage: string;
    userName: string;
    userList: User[];
}

const Navbar: React.FC<NavbarProps> = ({ userImage, userName, userList }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const scrollableBoxRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleOpenModal = async () => {
        // Fetch user info dynamically
        const info = await fetchUserInfo(currentUser?.uid || '');
        setUserInfo(info);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const generateChatId = (user1: string, user2: string): string => {
        return [user1, user2].sort().join('_');
    };

    const startChat = async (friend: User) => {
        if (currentUser) {
            const chatId = generateChatId(currentUser.uid, friend.id);
            const friendDetails = await fetchUserDetails(friend.id);
            
            if (friendDetails) {
                navigate(`/chat/${chatId}`, { state: { friend: friendDetails } });
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollableBoxRef.current) {
                scrollableBoxRef.current.classList.remove('hide-scrollbar');
                clearTimeout((scrollableBoxRef.current as any).timeout);
                (scrollableBoxRef.current as any).timeout = setTimeout(() => {
                    scrollableBoxRef.current?.classList.add('hide-scrollbar');
                }, 1500);
            }
        };

        const scrollableBox = scrollableBoxRef.current;
        if (scrollableBox) {
            scrollableBox.addEventListener('scroll', handleScroll);
            (scrollableBox as any).timeout = setTimeout(() => {
                scrollableBox.classList.add('hide-scrollbar');
            }, 1500);
        }

        return () => {
            if (scrollableBox) {
                scrollableBox.removeEventListener('scroll', handleScroll);
                clearTimeout((scrollableBox as any).timeout);
            }
        };
    }, []);

    return (
        <div className="container">
            <nav className="sidebar">
                <div className="user-info">
                    <img src={userImage} alt="User" className="user-image" />
                    <div className="user-details">
                        <span className="user-name">{userName}</span>
                        <button className="view-profile" onClick={handleOpenModal}>View Profile</button>
                    </div>
                </div>
                <div className="scrollable-box hide-scrollbar" ref={scrollableBoxRef}>
                    <div className="user-list-container">
                        {userList.map(user => (
                            <div
                                className="user-list-item"
                                key={user.id}
                                onClick={() => startChat(user)}
                            >
                                <img src={user.image} alt={user.name} className="user-list-image" />
                                <span className="user-list-name">{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="sign-out">Sign Out</button>
            </nav>
            {isModalOpen && <UserProfileModal userInfo={userInfo} onClose={handleCloseModal} />}
        </div>
    );
};

export default Navbar;
