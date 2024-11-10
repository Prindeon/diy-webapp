import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { useParams } from 'react-router-dom';

function PostDisplay() {
    const { slug } = useParams(); // Get slug from the URL
    const [postData, setPostData] = useState(null);
    

    useEffect(() => {
        async function fetchPostData() {
            try {
                // Query Firestore for a document where the slug matches
                const q = query(collection(db, 'posts'), where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();

                    // Sets title of the page relative to the post title
                    setPostData(data)
                    document.title = `${data.projectName} : CraftNess`
                } else {
                    console.log("No such post!");
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

    return (
        <div className="post-display">
            <h2>{postData.projectName}</h2>
            <img src={postData.headerImage} alt="Header" style={{ width: '100%' }} />
            
            <p><strong>Complexity:</strong> {postData.complexity}</p>
            <p><strong>Duration:</strong> {postData.duration}</p>

            {/* Display Materials as Bulleted List */}
            <div>
                <h3>Materials:</h3>
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
    );
}

export default PostDisplay;