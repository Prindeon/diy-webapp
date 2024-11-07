import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        }   catch(err) {
            setError('Failed to login, please try again')
            console.error(err)
        }
    }

    return (
        <div className='auth-container'>
            <h2>Log In</h2>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type='email' ref={emailRef} required />
                </label>
                <label>
                    Passworld:
                    <input type='password' ref={passwordRef} required />
                </label>
                <button type='submit'>Log In</button>
            </form>
            <p>
                Need and account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    )
}

export default Login