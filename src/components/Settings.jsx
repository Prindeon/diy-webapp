import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShieldAlt, faBell, faLock, faQuestionCircle, faInfoCircle, faChartLine, faFlag, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            await logout()
            navigate('/login')
        }   catch (err) {
            console.error('Failed to log out, please try again:', err)
        }
    }

    return (
        <div className="settings-container">
            <div className="settings-section">
                <h3>Account</h3>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Edit Profile</span>
                </div>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>Security</span>
                </div>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faBell} />
                    <span>Notifications</span>
                </div>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faLock} />
                    <span>Privacy</span>
                </div>
            </div>
            
            <div className="settings-section">
                <h3>Support & About</h3>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span>Help & Support</span>
                </div>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>Terms and Policies</span>
                </div>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>Data Saver</span>
                </div>
            </div>

            <div className="settings-section">
                <h3>Actions</h3>
                <div className="settings-item">
                    <FontAwesomeIcon icon={faFlag} />
                    <span>Report a Problem</span>
                </div>
                <div className="settings-item" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    );
}

export default Settings;