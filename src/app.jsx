import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import "./app.css";
import HomePage from "./components/HomePage";
import CreatePost from "./components/CreatePost";
import PostDisplay from "./components/PostDisplay";
import ForumPage from "./components/ForumPage";

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
                <HomePage /> {/* HomePage includes Dashboard */}
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
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route path="/post/:slug" element={<PostDisplay />} />

          {/* Additional Routes */}
          <Route path="/community" element={<ForumPage />} />
          <Route path="/inbox" element={<div>Inbox Page</div>} />
        </Routes>

        {/* Render NavBar */}
        <NavBar />
      </AuthProvider>
    </Router>
  );
}

export default App;
