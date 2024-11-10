import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
    const { userId } = useParams(); // Get the user ID from the URL
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false); // For follow/unfollow functionality

    // Fetch user data
    useEffect(() => {
        async function fetchUserData() {
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const data = userSnapshot.data()

                // Sets title of the page relative to the profile username
                setUserData(data)
                document.title = `${data.username} : CraftNess`
            }
        }

        async function fetchUserPosts() {
            // Query posts where author is userId
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('author', '==', userId));
            const postsSnapshot = await getDocs(q);
            const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserPosts(postsList);
        }

        fetchUserData();
        fetchUserPosts();
    }, [userId]);

    const handleFollowToggle = async () => {
        // Toggle follow/unfollow functionality here
        setIsFollowing(prevState => !prevState);
        // Additional logic to update follow status in Firestore
    };

    if (!userData) return <p>Loading profile...</p>;

    return (
        <div className="user-profile">
            <div className="profile-header" style={{ background: 'linear-gradient(orange, pink)' }}>
                <img
                    src={userData.profilePicUrl || 'default_profile_picture.png'}
                    alt="Profile"
                    className="profile-picture"
                />
                <h2>@{userData.username}</h2>
                <p>{userData.firstName} {userData.lastName}</p>
                <button onClick={handleFollowToggle} className="follow-button">
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
            <div className="profile-stats">
                <div>
                    <strong>{userData.creatorLevel || 0}</strong>
                    <p>creator level</p>
                </div>
                <div>
                    <strong>{userPosts.length}</strong>
                    <p>posts</p>
                </div>
                <div>
                    <strong>{userData.followers || 0}</strong>
                    <p>followers</p>
                </div>
            </div>
            <h3>@{userData.username}'s posts</h3>
            <div className="post-grid">
                {userPosts.map(post => (
                    <div key={post.id} className="post-card">
                        <img src={post.headerImage} alt={post.projectName} className="post-image" />
                        <h4>{post.projectName || post.title}</h4>
                        <p>{post.complexity} • {post.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfile;