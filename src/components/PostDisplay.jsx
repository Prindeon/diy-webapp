import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import OptionsMenu from './OptionsMenu'; // Import the new component

function PostDisplay() {
    const { slug } = useParams();
    const [postData, setPostData] = useState(null);
    const [posterData, setPosterData] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPostData() {
            try {
                const q = query(collection(db, 'posts'), where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setPostData(data);
                    document.title = `${data.projectName} : CraftNess`;

                    const authorUID = data.authorUID;

                    if (authorUID) {
                        const userRef = doc(db, 'users', authorUID);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            setPosterData(userSnap.data());
                        } else {
                            console.log("User doesn't exist!");
                        }
                    } else {
                        console.log('Author UID not found in post data.');
                    }
                } else {
                    console.log("Post doesn't exist!");
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        }

        fetchPostData();
    }, [slug]);

    if (!postData) {
        return <p>Loading...</p>;
    }

    const isAuthor = currentUser && postData && currentUser.uid === postData.authorUID;

    // Handlers for OptionsMenu actions
    const handleViewProfile = () => {
        if (postData && postData.authorUID) {
            navigate(`/user/${postData.authorUID}`);
        }
    };

    const handleEditPost = () => {
        if (postData && postData.slug) {
            navigate(`/edit-post/${postData.slug}`);
        }
    };

    const handleDeletePost = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (confirmDelete && postData && postData.slug) {
            try {
                const q = query(collection(db, 'posts'), where('slug', '==', postData.slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docId = querySnapshot.docs[0].id;
                    await deleteDoc(doc(db, 'posts', docId));
                    alert('Post deleted successfully.');
                    navigate('/');
                } else {
                    console.log('No such post!');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post.');
            }
        }
    };

    const handleSharePost = () => {
        const shareData = {
            title: postData.projectName,
            text: 'Check out this project on CraftNess!',
            url: window.location.href,
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Post shared successfully'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            navigator.clipboard.writeText(shareData.url)
                .then(() => alert('Link copied to clipboard!'))
                .catch((error) => console.log('Error copying link', error));
        }
    };

    return (
        <div>
            <Header
                title={postData.projectName}
                isHelpButton={false}
                rightButtonType=""
                titleSize='1.7rem'
                titleFont='Inter'
            />
            <div className="post-display">
                <img src={postData.headerImage} className='post-header-image' alt="Header" />

                {/* User Info and Post Details */}
                <div className="post-info">
                    <div className="profile-info-wrapper">
                        <span className="project-details username">
                            <img
                                src={posterData && posterData.profilePicUrl ? posterData.profilePicUrl : '/default_profile_picture.png'}
                                alt="Profile"
                                className="project-profile-picture"
                            />
                            {posterData ? posterData.username : 'Unknown User'}
                        </span>
                        <span className="project-details">{postData.duration}</span>
                        <span className="project-details">{postData.complexity}</span>

                        <OptionsMenu
                            isAuthor={isAuthor}
                            onViewProfile={handleViewProfile}
                            onEditPost={handleEditPost}
                            onDeletePost={handleDeletePost}
                            onSharePost={handleSharePost}
                        />
                    </div>
                </div>

                {/* Display Materials as Bulleted List */}
                <div>
                    <h3>Tools & Materials:</h3>
                    <ul>
                        {postData.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                        ))}
                    </ul>
                </div>

                {/* Display Steps */}
                <div>
                    <h3>Steps:</h3>
                    {postData.steps.map((step, index) => (
                        <div key={index} className="step">
                            <h4>Step {index + 1}</h4>
                            <p>{step.description}</p>
                            {step.image && <img src={step.image} alt={`Step ${index + 1}`} style={{ width: '100%' }} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostDisplay;