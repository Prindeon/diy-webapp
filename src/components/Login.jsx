import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked)
    }

    // useEffect(() => {
    //     // disable scrolling on this page
    //     document.body.style.overflow = 'hidden'
    // }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            const userCredential = await login(
                emailRef.current.value, 
                passwordRef.current.value
            )

            // this will check if displayName is set if not, retrieve from Firestore
            if (!userCredential.user.displayName) {
                const userDocRef = doc(db, 'users', userCredential.user.uid)
                const userDoc = await getDoc(userDocRef)
                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    await updateProfile(userCredential.user, {
                        displayName: userData.username,
                    })
                }
            }
            
            if (rememberMe) {
                localStorage.setItem('email', emailRef.current.value)
                localStorage.setItem('password', passwordRef.current.value)
            } else {
                localStorage.removeItem('email')
                localStorage.removeItem('password')
            }
            
            navigate('/')
        } catch(err) {
            setError('Failed to login, please try again')
            console.error(err)
        }
    }

    return (
        <div className='auth-container'>
            <div className="logo-container">
                <img src="/logo.png" alt="CraftNess Logo" />
                <span>CraftNess</span>
                <p>Craft, Connect, and Share <br />Your DIY Journey Starts Here</p>
            </div>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <input 
                        type='email' 
                        ref={emailRef} 
                        placeholder='Email' 
                        defaultValue={localStorage.getItem('email') || ''} // remembers email, if saved
                        required 
                    />
                </label>
                <label>
                    <input 
                        type='password' 
                        ref={passwordRef} 
                        placeholder='Password' 
                        defaultValue={localStorage.getItem('password') || ''}
                        required 
                    />
                </label>
                <label className='remember-me'>
                    <input
                        type='checkbox'
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                    />Remember me
                </label>
                <button type='submit'>Login</button>
            </form>
            <p>
                Need an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    )
}

export default Login