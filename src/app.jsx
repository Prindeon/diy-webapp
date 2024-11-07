import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import './app.css'
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route 
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
            {/* Additional Routes */}
            <Route path="/community" element={<div>Community Page</div>} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/inbox" element={<div>Inbox Page</div>} />
          </Routes>
          <NavBar />
      </AuthProvider>
    </Router>
  )
}

export default App