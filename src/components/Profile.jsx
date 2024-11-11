import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';

function Profile() {
    const { currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfileData(data);
                    document.title = `${data.username} : CraftNess`;
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        }

        fetchUserData();
    }, [currentUser]);

    async function handleProfilePicUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            await updateDoc(doc(db, 'users', currentUser.uid), {
                profilePicUrl: downloadUrl,
            });

            setProfileData((prevData) => ({
                ...prevData,
                profilePicUrl: downloadUrl,
            }));
        }
    }

    if (!profileData) {
        return <p>Loading...</p>;
    }

    return (
    <div>
        <Header 
            title="Profile"
            showLeftButton={true}
            isHelpButton={false}
            rightButtonType="settings"
            titleFont={'Inter'}
            headerHeight='60px'
            paddingBottom='60px'
        />
        <div className="profile-container">
                    <label htmlFor="profilePicInput">
                        <img
                            src={profileData.profilePicUrl || 'default_profile_picture.png'}
                            alt="Profile"
                            className="profile-picture"
                        />
                    </label>
                    <input
                        type="file"
                        id="profilePicInput"
                        style={{ display: 'none' }}
                        onChange={handleProfilePicUpload}
                    />
                <div className="profile-info">
                    <h2>@{profileData.username}</h2>
                    <p>{profileData.firstName} {profileData.lastName}</p>
                </div>
            <div className="profile-stats">
                <div>
                    <strong>2</strong>
                    <p>Creator Level</p>
                </div>
                <div>
                    <strong>3</strong>
                    <p>Posts</p>
                </div>
                <div>
                    <strong>21</strong>
                    <p>Followers</p>
                </div>
            </div>
            <button className="edit-profile-button" onClick={() => navigate('/edit-profile')}>
                Edit Profile
            </button>
        </div>
    </div>    
    );
}

export default Profile;