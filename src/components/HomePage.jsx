import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

function HomePage() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchPosts() {
            const postsCollection = collection(db, 'posts')
            const postsSnapshot = await getDocs(postsCollection)
            const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setPosts(postsList)
        }

        fetchPosts()
    }, [])

    const handleCardClick = (postId) => {
        navigate(`/post${postId}`)
    }

    return (
        <div className='home-page'>
            <Dashboard />
            <h2>Explore Projects</h2>
            <div className="post-grid">
                {posts.map(post => (
                    <div key={post.id} className='post-card' onClick={() => handleCardClick(post.id)}>
                        <img src={post.headerImage} alt={post.projectName} className='post-image' />
                        <h3 className='post-title'>{post.projectName}</h3>
                        <p className='post-info'>Complexity: {post.complexity}</p>
                        <p className='post-info'>Duration: {post.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage