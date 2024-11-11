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
import DetailedPost from "./components/ForumPost";
import UserProfile from './components/UserProfiles'
import Settings from "./components/Settings";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import EditPost from "./components/EditPost";

function App() {
  return (
    <Router>
      <AuthProvider>
      {/* This scrolls the page to the top upon navigating to a new route */}
      <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />


          {/* Protected Route only  accessible to when signed in */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
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
          <Route 
            path="/edit-post/:slug" 
            element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
            } 
          />
          <Route path="/post/:slug" element={<PostDisplay />} />

          {/* Additional Routes */}
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/forum/post/:postId" element={<DetailedPost />} />
          <Route path="/community" element={<ForumPage />} />
          <Route path="/inbox" 
            element={
              <div>
                <Header
                title={'CraftNess'}
                isHelpButton={true}
                rightButtonType="dm"
                titleSize='1.7rem'
            />
                <p style="margin: 60% 20%;">You don't have any messages in your inbox yet...</p>
              </div>
            } />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
        </Routes>

        {/* Render NavBar */}
        <NavBar />

      </AuthProvider>
    </Router>
  );
}

export default App;
