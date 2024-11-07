import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function CreatePost() {
    const [headerImage, setHeaderImage] = useState(null)
    const [headerImageUrl, setHeaderImageUrl] = useState(null)
    const [projectName, setProjectName] = useState('')
    const [complexity, setComplexity] = useState('')
    const [duration, setDuration] = useState('')
    const [tags, setTags] = useState('')
    const [materials, setMaterials] = useState('')
    const [steps, setSteps] = useState([{ description: '', image: null}])

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
        e.preventDefault()
        const postData = {
            headerImage: headerImageUrl,
            projectName,
            complexity,
            duration,
            tags: tags.split(',').map(tag => tag.trim()),
            materials: materials.split(',').map(material => material.trim()),
            steps,
            createdAt: new Date(),
        }

        try {
            await addDoc(collection(db, 'posts'), postData)
            alert("Post created successfully!")
        } catch (error) {
            console.error("Error creating post:", error)
            alert("Failed to create post. Try again.")
        }
    }

    return (
        <div className='create-post-container'>
            <h2>Create a new Project</h2>
            <form onSubmit={handleSumbit}>
                {/* Header Image Selection */}
                <div>
                    <label>
                        Header Image:
                        <input type='file' onChange={handleHeaderImageChange} />
                    </label>
                    {headerImageUrl && <img src={headerImageUrl} alt='Header' style={{ width: '100%'}} />}
                </div>

                {/* Project Information */}
                <label>
                    Project Name:
                    <input type='text' value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                </label>
                <label>
                    Complexity:
                    <select value={complexity} onChange={(e) => setComplexity(e.target.value)} required>
                        <option value="">Select complexity</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </label>
                <label>
                    Duration:
                    <input type='text' value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </label>
                <label>
                    Tags (Seperated by commas):
                    <input type='text' value={tags} onChange={(e) => setTags(e.target.value)} required />
                </label>
                <label>
                    Materials and tools (Seperated by commas):
                    <input type='text' value={materials} onChange={(e) => setMaterials(e.target.value)} required />
                </label>

                {/* Steps */}
                <h3>Steps</h3>
                {steps.map((step, index) => (
                    <div key={index} className='step'>
                        <label>
                            Step {index + 1} Description:
                            <textarea
                                value={step.description}
                                onChange={(e) => handleStepDescriptionChange(index, e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Step {index + 1} Image:
                            <input type='file' onChange={(e) => handleStepImageChange(index, e)} />
                        </label>
                        {step.image && <img src={step.image} alt={`Step ${index + 1}`} style={{ width: '100px', marginTop: '10px' }} />}
                    </div>
                ))}
                <button  type='button' onClick={addstep}>Add Step</button>

                {/* Submit */}
                <button type='submit'>Post</button>
            </form>
        </div>
    )
}

export default CreatePost