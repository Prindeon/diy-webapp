import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const [headerImage, setHeaderImage] = useState(null)
    const [headerImageUrl, setHeaderImageUrl] = useState(null)
    const [projectName, setProjectName] = useState('')
    const [complexity, setComplexity] = useState('')
    const [duration, setDuration] = useState('')
    const [tags, setTags] = useState('')
    const [materials, setMaterials] = useState('')
    const [steps, setSteps] = useState([{ description: '', image: null}])
    const navigate = useNavigate()
    const formRef = useRef(null)
    const { currentUser } = useAuth()



    // Header image selection
    const handleHeaderImageChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const storageRef = ref(storage, `postImages/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadUrl = await getDownloadURL(storageRef)
            setHeaderImage(file)
            setHeaderImageUrl(downloadUrl)
        }
    }

    // add steps
    const addstep = () => {
        setSteps([...steps, { description: '', image: null }])
    }

    // Handle step description change
    const handleStepDescriptionChange = (index, value) => {
        const updatedSteps = steps.map((step, i) =>
            i === index ? { ...step, description: value } : step
        )
        setSteps(updatedSteps)
    }

    // handle step image upload
    const handleStepImageChange = async (index, e) => {
        const file = e.target.files[0]
        if (file) {
            const storageRef = ref(storage, `postImages/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadUrl = await getDownloadURL(storageRef)
            const updatedSteps = steps.map((step, i) => 
                i === index ? { ...step, image: downloadUrl } : step
            )
            setSteps(updatedSteps)
        }
    }

    // handle form submisison
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
    
        // Generate slug from project name
        const slug = generateSlug(projectName);
        console.log("Generated slug:", slug); // Log to verify slug creation
    
        const postData = {
            headerImage: headerImageUrl,
            projectName,
            complexity,
            duration,
            tags: tags.split(',').map(tag => tag.trim()),
            materials: materials.split(',').map(material => material.trim()),
            steps,
            createdAt: new Date(),
            slug,
            authorUID: currentUser.uid,
            
        }
    
        try {
            // Add post to Firestore
            const docRef = await addDoc(collection(db, 'posts'), postData);
            console.log("Document written with ID:", docRef.id); // Log to verify write operation
    
            // Navigate to the newly created post's page using the slug
            navigate(`/post/${slug}`);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post.");
        }
    };

    function generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    // Function to trigger form submission - requestSubmit will trigger the HTML5 form validation before publishing
    // This is necesarry because without this, the code would try to publish the post without the adequate data.
    const handlePublishClick = () => {
        if (formRef.current) {
            formRef.current.requestSubmit()
        }
    }

    return (
    <div>
        <Header 
        title="New Project"
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
                    <label class="insert-file-label">
                        <input 
                            type='file' 
                            onChange={handleHeaderImageChange} 
                            required 
                            style="display: none;"
                            id="headerImage"
                        />
                       <span>Select Header Image</span>
                    </label>
            <span id="fileName"></span>
                    {headerImageUrl && <img src={headerImageUrl} alt='Header' style={{ width: '100%'}} />}
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
                        Tags (Seperated by commas):
                        <input 
                            type='text' 
                            placeholder='woodworking, DIY, rustic, kitchen...' value={tags} onChange={(e) => setTags(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Materials and tools (Seperated by commas):
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
                    </div>
                ))}
                <button className='add-step' type='button' onClick={addstep}>Add Step</button>

                {/* Submit */}
                <button type='submit' style={{display:'none'}}>Post</button>
            </form>
        </div>
    </div>
    )
}

export default CreatePost