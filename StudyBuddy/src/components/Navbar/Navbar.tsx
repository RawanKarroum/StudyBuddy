import React, { useEffect, useRef } from 'react';
import './Navbar.css';

interface User {
    id: string;
    name: string;
    image: string;
}

interface NavbarProps {
    userImage: string;
    userName: string;
    userList: User[];
}

const Navbar: React.FC<NavbarProps> = ({ userImage, userName, userList }) => {
    const scrollableBoxRef = useRef<HTMLDivElement>(null);

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
                        <span className="view-profile">View Profile</span>
                    </div>
                </div>
                <div className="scrollable-box hide-scrollbar" ref={scrollableBoxRef}>
                    <div className="user-list-container">
                        {userList.map(user => (
                            <a href={`/profile/${user.id}`} className="user-list-item" key={user.id}>
                                <img src={user.image} alt={user.name} className="user-list-image" />
                                <span className="user-list-name">{user.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
                <button className="sign-out">Sign Out</button>
            </nav>
        </div>
    );
};

export default Navbar;