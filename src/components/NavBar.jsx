import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faPlusCircle, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import LoginWarningModal from './LoginWarningModal'

function NavBar() {
    const location = useLocation();
    const { currentUser } = useAuth();
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)

    const handleProtectedClick = (event) => {
        if (!currentUser) {
            event.preventDefault()
            setModalOpen(true)
        }
    }

    useEffect(() => {
        async function fetchProfilePicture() {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfilePicUrl(data.profilePicUrl || 'default_profile_picture.png');
                    }
                } catch (error) {
                    console.error("Error fetching profile picture:", error);
                }
            }
        }

        fetchProfilePicture();
    }, [currentUser]);




    return (
        <nav className="bottom-nav">
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                <span className="nav-label">Home</span>
            </Link>
            <Link to="/community" className={`nav-item ${location.pathname === '/community' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                <span className="nav-label">Community</span>
            </Link>
            <Link to="/create-post" className={`nav-item ${location.pathname === '/create-post' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <FontAwesomeIcon icon={faPlusCircle} className="nav-icon" />
                <span className="nav-label">Create</span>
            </Link>
            <Link to="/inbox" className={`nav-item ${location.pathname === '/inbox' ? 'active' : ''}`} onClick={handleProtectedClick}>
                <FontAwesomeIcon icon={faBell} className="nav-icon" />
                <span className="nav-label">Inbox</span>
            </Link>
            <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`} onClick={handleProtectedClick}>
                {profilePicUrl ? (
                    <img 
                        src={profilePicUrl} 
                        alt="Profile" 
                        className="profile-icon"
                    />
                ) : (
                    <FontAwesomeIcon icon={faUser} className="nav-icon" />
                )}
                <span className="nav-label">Profile</span>
            </Link>
        
            <LoginWarningModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

        </nav>
    );
}

export default NavBar;