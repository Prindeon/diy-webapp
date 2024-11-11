import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const usernameRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const { signup } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            // sign the user up
            const userCredential = await signup(
                emailRef.current.value,
                passwordRef.current.value
            )

            await updateProfile(userCredential.user, {
                displayName: usernameRef.current.value,
            })

            // Add additional user data to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                username: usernameRef.current.value,
                email: emailRef.current.value,
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                createdAt: new Date(),
                badges: [],
                // could name this something like "Blueprints" - points you get for helping and guiding others through projects (like a blueprint does)
                karma: []
            })

            navigate('/')
        } catch (err) {
            setError('failed to create an account, please try again later')
            console.error(err)
        }
    }

    return (
        <div className='auth-container'>
            <h2>Sign Up</h2>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type='text' ref={firstNameRef} required />
                </label>
                <label>
                    Last Name:
                    <input type='text' ref={lastNameRef} required />
                </label>
                <label>
                    Username:
                    <input type='text' ref={usernameRef} required />
                </label>
                <label>
                    Email:
                    <input type='email' ref={emailRef} required />
                </label>
                <label>
                    Password:
                    <input type='password' ref={passwordRef} required />
                </label>
                <button type='submit'>Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    )
}

export default Signup