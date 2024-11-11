import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Welcome from './Dashboard';
import SearchBar from './SearchBar';
import Header from './Header';

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
            setFilteredPosts(postsList);
        }

        fetchPosts();
    }, []);

    const handleSearch = (query) => {
        const lowerCaseQuery = query.toLowerCase()
        const results = posts.filter(post =>
            post.projectName.toLowerCase().includes(lowerCaseQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
        )
        setFilteredPosts(results)
    }

    // Handle clicking a project card
    const handleCardClick = (slug) => {
        navigate(`/post/${slug}`);
    };

    // Update `filteredPosts` based on search results
    const handleSearchResults = (results) => {
        setFilteredPosts(results);
    };



    return (
        <div>
            <Header 
                isHelpButton={true}
                rightButtonType="dm"
                titleSize='1.7rem'
            />
            <div className='home-page'>
                <Welcome />

                <SearchBar onSearch={handleSearch} />

                <h3>Explore Projects</h3>
                <div className="post-grid">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <div key={post.id} className='post-card' onClick={() => handleCardClick(post.slug)}>
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
        </div>
    );
}

export default HomePage;