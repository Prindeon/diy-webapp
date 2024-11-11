import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

function EditPost() {
    const [headerImage, setHeaderImage] = useState(null);
    const [headerImageUrl, setHeaderImageUrl] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [complexity, setComplexity] = useState('');
    const [duration, setDuration] = useState('');
    const [tags, setTags] = useState('');
    const [materials, setMaterials] = useState('');
    const [steps, setSteps] = useState([{ description: '', image: null }]);
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { currentUser } = useAuth();
    const { slug } = useParams(); // Get slug from URL
    const [originalSlug, setOriginalSlug] = useState(''); // To check if projectName changes
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        async function fetchPostData() {
            try {
                // Query Firestore for the post with the given slug
                const q = query(collection(db, 'posts'), where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    const data = querySnapshot.docs[0].data();

                    // Check if the current user is the author
                    if (data.authorUID !== currentUser.uid) {
                        alert('You are not authorized to edit this post.');
                        navigate(`/post/${slug}`);
                        return;
                    }

                    // Set the state variables with the fetched data
                    setHeaderImageUrl(data.headerImage);
                    setProjectName(data.projectName);
                    setComplexity(data.complexity);
                    setDuration(data.duration);
                    setTags(data.tags.join(', '));
                    setMaterials(data.materials.join(', '));
                    setSteps(data.steps);
                    setOriginalSlug(data.slug);
                    setLoading(false);
                } else {
                    console.log('No such post!');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        }

        fetchPostData();
    }, [slug, currentUser.uid, navigate]);

    // Header image selection
    const handleHeaderImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `postImages/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            setHeaderImage(file);
            setHeaderImageUrl(downloadUrl);
        }
    };

    // Add steps
    const addstep = () => {
        setSteps([...steps, { description: '', image: null }]);
    };

    // Remove steps
    const removeStep = (index) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    // Handle step description change
    const handleStepDescriptionChange = (index, value) => {
        const updatedSteps = steps.map((step, i) =>
            i === index ? { ...step, description: value } : step
        );
        setSteps(updatedSteps);
    };

    // Handle step image upload
    const handleStepImageChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `postImages/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            const updatedSteps = steps.map((step, i) =>
                i === index ? { ...step, image: downloadUrl } : step
            );
            setSteps(updatedSteps);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Generate slug from project name
        const newSlug = generateSlug(projectName);

        const updatedPostData = {
            headerImage: headerImageUrl,
            projectName,
            complexity,
            duration,
            tags: tags.split(',').map(tag => tag.trim()),
            materials: materials.split(',').map(material => material.trim()),
            steps,
            updatedAt: new Date(),
            slug: newSlug,
            authorUID: currentUser.uid,
        };

        try {
            // Query Firestore for the post with the original slug
            const q = query(collection(db, 'posts'), where('slug', '==', originalSlug));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                // Update the post document
                await updateDoc(docRef, updatedPostData);
                console.log('Post updated successfully.');

                // Navigate to the updated post's page using the new slug
                navigate(`/post/${newSlug}`);
            } else {
                console.log('No such post!');
                alert('Failed to update post.');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post.');
        }
    };

    function generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    const handlePublishClick = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Header
                title="Edit Project"
                showLeftButton={true}
                isHelpButton={false}
                rightButtonType="publish"
                onPublishClick={handlePublishClick}
                titleFont={'Inter'}
            />
            <div className='create-post-container'>
                <form ref={formRef} onSubmit={handleSubmit}>

                    {/* Header Image Selection */}
                    <div className='form-group'>
                        <label className="insert-file-label">
                            <input
                                type='file'
                                onChange={handleHeaderImageChange}
                                style={{ display: 'none' }}
                                id="headerImage"
                            />
                            <span>Select Header Image</span>
                        </label>
                        {headerImageUrl && <img src={headerImageUrl} alt='Header' style={{ width: '100%' }} />}
                    </div>

                    {/* Project Information */}
                    <div className="form-group">
                        <label>
                            Project Name:
                            <input
                                type='text'
                                placeholder='Handcrafted wooden spice rack'
                                value={projectName} onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Complexity:
                            <select value={complexity} onChange={(e) => setComplexity(e.target.value)} required>
                                <option value="">Select complexity</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Duration:
                            <input
                                type='text'
                                placeholder='3-4 hours' value={duration} onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Tags (Separated by commas):
                            <input
                                type='text'
                                placeholder='woodworking, DIY, rustic, kitchen...' value={tags} onChange={(e) => setTags(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Materials and tools (Separated by commas):
                            <input
                                type='text'
                                placeholder='hammer, nails, sandpaper, planks...'
                                value={materials} onChange={(e) => setMaterials(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    {/* Steps */}
                    <h3>Steps</h3>
                    {steps.map((step, index) => (
                        <div key={index} className='form-group'>
                            <label>
                                Step {index + 1} Description:
                                <textarea
                                    value={step.description}
                                    placeholder='Measure and cut four wood planks to 30 cm each for the spice rack frame...'
                                    onChange={(e) => handleStepDescriptionChange(index, e.target.value)}
                                    required
                                />
                            </label>
                            <label className="add-image-button">
                                <FontAwesomeIcon icon={faPlus} className="plus-icon" />
                                <span>Add Image</span>
                                <input
                                    type="file"
                                    onChange={(e) => handleStepImageChange(index, e)}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {step.image && <img src={step.image} alt={`Step ${index + 1}`} style={{ width: '100px', marginTop: '10px' }} />}
                            <button type='button' onClick={() => removeStep(index)}>Remove Step</button>
                        </div>
                    ))}
                    <button className='add-step' type='button' onClick={addstep}>Add Step</button>

                    {/* Submit */}
                    <button type='submit' style={{ display: 'none' }}>Update Post</button>
                </form>
            </div>
        </div>
    );
}

export default EditPost;