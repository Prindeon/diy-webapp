import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    // If no user is logged in, redirect to login
    return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;