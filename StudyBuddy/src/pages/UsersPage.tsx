import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, FirestoreError } from 'firebase/firestore';
import { db } from '../config/Firebase'; 
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/Searchbar/Searchbar';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            if (currentUser) {
                console.log("Fetching current user details...");
                // Fetch the current user's details first
                const currentUserDoc = await getDocs(query(collection(db, 'Users'), where('uid', '==', currentUser.uid)));
                if (currentUserDoc.empty) {
                    throw new Error('Current user data not found');
                }
                const currentUserData = currentUserDoc.docs[0].data() as User;
                console.log("Current user data:", currentUserData);

                // Query based on current user's university and major
                const q = query(
                    collection(db, 'Users'),
                    where('uid', '!=', currentUser.uid),
                    where('university', '==', currentUserData.university),
                    where('major', '==', currentUserData.major)
                );

                const querySnapshot = await getDocs(q);
                console.log("Query snapshot size:", querySnapshot.size);
                let usersData: User[] = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<User, 'uid'>;
                    return { uid: doc.id, ...data };
                });

                if (usersData.length === 0) {
                    console.log("No users found with the same university and major, fetching all users...");
                    const allUsersSnapshot = await getDocs(query(collection(db, 'Users'), where('uid', '!=', currentUser.uid)));
                    usersData = allUsersSnapshot.docs.map(doc => {
                        const data = doc.data() as Omit<User, 'uid'>;
                        return { uid: doc.id, ...data };
                    });
                }

                console.log("Fetched users data:", usersData);
                setUsers(usersData);
            }
        } catch (err) {
            if ((err as FirestoreError).code === 'failed-precondition') {
                setError('This query requires a Firestore index. Please create the index in your Firebase console.');
            } else {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchResults = async (results: User[]) => {
        setLoading(true);
        setError(null);

        try {
            if (results.length === 0) {
                console.log("No search results found, fetching all users...");
                const allUsersSnapshot = await getDocs(query(collection(db, 'Users'), where('uid', '!=', currentUser?.uid)));
                const allUsers = allUsersSnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<User, 'uid'>;
                    return { uid: doc.id, ...data };
                });
                setUsers(allUsers);
            } else {
                setUsers(results);
            }
        } catch (err) {
            console.error('Error handling search results:', err);
            setError('Failed to load search results. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

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
        <div className="users-page">
            <div className="header-container">
                <h1 className="page-title">Users</h1>
                <div className="search-container">
                    {currentUser && <SearchBar onSearchResults={handleSearchResults} currentUserUid={currentUser.uid} />}
                </div>
            </div>
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <ul className="users-list">
                    {users.map((user) => (
                        <li key={user.uid} className="user-card">
                            <div className="user-profile">
                                <img src={`https://i.pravatar.cc/150?u=${user.uid}`} alt={`${user.firstName} ${user.lastName}`} className="user-picture" />
                                <div className="user-info">
                                    <h2>{user.firstName} {user.lastName}</h2>
                                    <p><strong>University:</strong> {user.university}</p>
                                    <p><strong>Year:</strong> {user.year}</p>
                                    <p><strong>Major:</strong> {user.major}</p>
                                    <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
                                </div>
                                <button className="add-friend-button" onClick={() => addFriendAndStartChat(user)}>
                                    <i className="fas fa-user-plus"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsersPage;
