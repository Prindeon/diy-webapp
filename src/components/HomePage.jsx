import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import SearchComponent from './SearchComponent';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]); // Stores search results
    const navigate = useNavigate();

    // Fetch posts from Firestore
    useEffect(() => {

        document.title =  'Home : CraftNess'

        async function fetchPosts() {
            const postsCollection = collection(db, 'posts');
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsList);
            setFilteredPosts(postsList); // Show all posts by default
        }

        fetchPosts();
    }, []);

    // Handle clicking a project card
    const handleCardClick = (slug) => {
        navigate(`/post/${slug}`);
    };

    // Update `filteredPosts` based on search results
    const handleSearchResults = (results) => {
        setFilteredPosts(results);
    };

    return (
        <div className='home-page'>
            <Dashboard />

            {/* Integrate SearchComponent */}
            <SearchComponent onSearchResults={handleSearchResults} />

            <h2>Explore Projects</h2>
            <div className="post-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div key={post.id} className='post-card' onClick={() => handleCardClick(post.slug)}>
                            <div className='post-card-header'>
                                <span className="likes">❤️ {post.likes || 31}</span>
                                <span className="bookmark">🔖</span>
                            </div>
                            <img src={post.headerImage} alt={post.projectName} className='post-image' />
                            <h3 className='post-title'>{post.projectName}</h3>
                            <div className='post-details'>
                                <p>{post.complexity} | {post.duration}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;