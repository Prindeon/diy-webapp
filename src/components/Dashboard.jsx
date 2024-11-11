import { useAuth } from '../context/AuthContext';
function Welcome() {
    const { userData } = useAuth()
    return (
        <div className='dashboard'>
            <h2>Welcome, {userData ? userData.username : 'User'}!</h2>
        </div>
    )
}
export default Welcome