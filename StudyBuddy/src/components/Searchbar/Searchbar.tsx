// SearchBar.tsx
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import './Searchbar.css';

Modal.setAppElement('#root');

interface User {
    id: string;
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

const SearchBar: React.FC<{ onSearchResults: (results: User[]) => void, currentUserUid: string }> = ({ onSearchResults, currentUserUid }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalStyle, setModalStyle] = useState({});
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const [university, setUniversity] = useState('');
    const [major, setMajor] = useState('');
    const [year, setYear] = useState('');
    const [courses, setCourses] = useState('');

    const toggleModal = () => {
        if (modalIsOpen) {
            closeModal();
        } else {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const modalWidth = 500; // Approximate width of the modal
                const offsetTop = rect.bottom + window.scrollY;
                const offsetLeft = Math.min(
                    rect.left + window.scrollX,
                    window.innerWidth - modalWidth
                );

                setModalStyle({
                    top: `${offsetTop}px`,
                    left: `${offsetLeft}px`,
                    transform: 'none',
                });
            }
            setModalIsOpen(true);
        }
    };

    const closeModal = () => setModalIsOpen(false);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        let q = query(collection(db, 'Users'), where('uid', '!=', currentUserUid));
        if (university) {
            q = query(q, where('university', '==', university));
        }
        if (major) {
            q = query(q, where('major', '==', major));
        }
        if (year) {
            q = query(q, where('year', '==', year));
        }

        const querySnapshot = await getDocs(q);
        let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];

        if (courses) {
            const coursesArray = courses.split(',').map(course => course.trim().toLowerCase());
            results = results.filter(user =>
                user.courses.some(course =>
                    coursesArray.some(searchCourse =>
                        course.toLowerCase().includes(searchCourse)
                    )
                )
            );
        }

        onSearchResults(results);
        closeModal();
    };

    return (
        <div>
            <button ref={buttonRef} onClick={toggleModal} className="search-button">
                Search for Study Partners
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Search Modal"
                className="modal"
                overlayClassName="overlay"
                style={{ content: modalStyle, overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
            >
                <h2 className="modal-title">Search for Study Partners</h2>
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>University:</label>
                        <input
                            type="text"
                            name="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Major:</label>
                        <input
                            type="text"
                            name="major"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Year:</label>
                        <input
                            type="text"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Courses:</label>
                        <input
                            type="text"
                            name="courses"
                            value={courses}
                            onChange={(e) => setCourses(e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit">Search</button>
                        <button type="button" onClick={closeModal}>Close</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SearchBar;
