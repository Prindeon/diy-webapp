import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

function EditProfile() {
    const { currentUser } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                    setUsername(data.username || '');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        }

        fetchUserData();
    }, [currentUser]);

    async function handleUpdateProfile(e) {
        e.preventDefault();

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                firstName,
                lastName,
                username,
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage('Failed to update profile');
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            setMessage('Please fill out both password fields.');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            setMessage('Password updated successfully!');
        } catch (err) {
            console.error('Error updating password:', err);
            setMessage('Failed to update password. Please check your old password.');
        }
    }

    return (
        <div className='edit-profile'>
            <h2>Edit Profile</h2>
            {message && (
                <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleUpdateProfile}>
                <label>
                    First Name:
                    <input
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label>
                    Username:
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <button type='submit'>Update Profile</button>
            </form>

            <form onSubmit={handleChangePassword}>
                <label>
                    Confirm Old Password:
                    <input
                        type='password'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </label>
                <label>
                    New Password:
                    <input
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <button type='submit'>Change Password</button>
            </form>
        </div>
    );
}

export default EditProfile;