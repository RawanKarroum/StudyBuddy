import React from 'react';
import './UserProfileModal.css';

interface UserProfileModalProps {
    onClose: () => void;
    userInfo: {
        firstName: string;
        lastName: string;
        university: string;
        courses: string[];
        major: string;
        year: string;
        email: string;
        profilePicUrl: string;
    } | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose, userInfo }) => {
    if (!userInfo) return null;

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = 'default.jpg'; // Fallback image in case of an error
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Close</button>
                <h2>User Profile</h2>
                <img
                    src={userInfo.profilePicUrl}
                    alt="Profile"
                    className="profile-image"
                    onError={handleError}
                />
                <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                <p><strong>University:</strong> {userInfo.university}</p>
                <p><strong>Major:</strong> {userInfo.major}</p>
                <p><strong>Year:</strong> {userInfo.year}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Courses:</strong> {userInfo.courses.join(', ')}</p>
            </div>
        </div>
    );
};

export default UserProfileModal;
