import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; 

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true)

    // funciton to sign up
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // function to login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // function to log out
    function logout() {
        return signOut(auth)
    }

    // listen to changes in auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            setLoading(false)
            if (user) {
                try {
                    // Fetch additional user data from Firestore if a user is authenticated
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserData(null);
            }
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        userData,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}