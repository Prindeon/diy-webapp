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

function ForumPage() {
  const [poosts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tag: "question",
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
    if (!newPost.title || !newPost.content) return;

    await addDoc(collection(db, "posts"), {
      ...newPost,
      createdAt: new Date(),
      resolved: newPost.tag === "Question" ? false : null,
      likes: 0,
    });

    setNewPost({ title: "", content: "", tag: "Question", imageUrl: "" });
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

      <form onSubmit={handleSubmitPost}>
        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="PostContent"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
        />
        <select
          value={newPost.tag}
          onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
          required
        >
          <option value="Question">Question</option>
          <option value="Showcase">Project Showcase</option>
        </select>
        <input type="file" onChange={handleImageUpload} />
        <button type="submit">Create Post</button>
      </form>

      {/* Posts Display */}
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
            <p>{post.content}</p>
            <p>Tag: {post.tag}</p>
            <p>Likes: {post.likes}</p>
            {post.tag === "Question" && post.resolved === false && (
              <button onClick={() => handleMarkResolved(post.id)}>
                Mark as Resolved
              </button>
            )}
            <button onClick={() => handleLikePost(post.id)}>Like</button>
            <button onClick={() => navigate(`/forum/post/${post.id}`)}>
              View Comments
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForumPage;
