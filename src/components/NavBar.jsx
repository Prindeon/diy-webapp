import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function NavBar() {
    const location = useLocation();
    const { currentUser } = useAuth();
    const [profilePicUrl, setProfilePicUrl] = useState(null);

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
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
            </Link>
            <Link to="/community" className={`nav-item ${location.pathname === '/community' ? 'active' : ''}`}>
                <span className="nav-icon">👥</span>
                <span className="nav-label">Community</span>
            </Link>
            <Link to="/create-post" className="nav-item create">
                <span className="nav-icon">➕</span>
                <span className="nav-label">Create</span>
            </Link>
            <Link to="/inbox" className={`nav-item ${location.pathname === '/inbox' ? 'active' : ''}`}>
                <span className="nav-icon">🔔</span>
                <span className="nav-label">Inbox</span>
            </Link>
            <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <img 
                    src={profilePicUrl || 'default_profile_picture.png'} 
                    alt="Profile" 
                    className="profile-icon"
                />
                <span className="nav-label">Profile</span>
            </Link>
        </nav>
    );
}

export default NavBar;