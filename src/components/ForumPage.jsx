import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      const postsCollection = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    }

    document.title = 'Forum : CraftNess'

    fetchPosts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `forumImages/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setNewPost({ ...newPost, imageUrl });
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.content) return;

    await addDoc(collection(db, "posts"), {
      ...newPost,
      createdAt: new Date(),
    });

    setNewPost({content: "", imageUrl: "" });
  };

  const handleLikePost = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { likes: increment(1) });
  };

  const handleMarkResolved = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { resolved: true });
  };

  return (
    <div className="forum-page">
      <h2>Forum</h2>

      {/* Post Creation Form */}
      <div className="create-post-form">
        <h3>Start a thread</h3>
        <form onSubmit={handleSubmitPost}>
          <textarea
            placeholder="Write your post here..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
          <input type="file" onChange={handleImageUpload} />
          <button type="submit">Post</button>
        </form>
      </div>

      {/* Posts Display */}
      <div className="forum-list">
        {posts.map((post) => (
          
            <div key={post.id} className="forum-card">
              {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
              <p>{post.content}</p>
              <Link to={`/forum/post/${post.id}`} key={post.id}>
                <button onClick={() => navigate(`/forum/post/${post.id}`)}>
                  View Comments
                </button>
              </Link>
            </div>
        ))}
      </div>
    </div>
  );
}

export default ForumPage;
