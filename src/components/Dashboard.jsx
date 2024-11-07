import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
    const { userData, logout } = useAuth()

    async function handleLogout() {
        try {
            await logout()
        }   catch (err) {
            console.error('Failed to log out, please try again:', err)
        }
    }

    return (
        <div className='dashboard'>
            <h1>Welcome, {userData ? userData.username : 'User'}!</h1>
            <nav>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Log Out</button>
            </nav>
            {/* User Content */}
        </div>
    )
}

export default Dashboard