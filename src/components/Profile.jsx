import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

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
                    setProfileData(docSnap.data());
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

            // Update profile picture URL in Firestore
            await updateDoc(doc(db, 'users', currentUser.uid), {
                profilePicUrl: downloadUrl,
            });

            // Update local state to reflect the new profile picture
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
        <div className='profile-container'>
            <div className='profile-header' style={{ background: 'linear-gradient(orange, pink)' }}>
                <div className='profile-picture'>
                    <label htmlFor='profilePicInput'>
                        <img
                            src={profileData.profilePicUrl || 'default_profile_picture.png'}
                            alt='Profile'
                            className='profile-image'
                            style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
                        />
                    </label>
                    <input
                        type='file'
                        id='profilePicInput'
                        style={{ display: 'none' }}
                        onChange={handleProfilePicUpload}
                    />
                </div>
                <h2>@{profileData.username}</h2>
                <p>{profileData.firstName} {profileData.lastName}</p>
            </div>
            <div className='profile-stats'>
                <div>
                    <strong>2</strong>
                    <p>creator level</p>
                </div>
                <div>
                    <strong>3</strong>
                    <p>posts</p>
                </div>
                <div>
                    <strong>21</strong>
                    <p>followers</p>
                </div>
            </div>
            <button className='edit-profile-button' onClick={() => navigate('/edit-profile')}>
                Edit Profile
            </button>
        </div>
    );
}

export default Profile;