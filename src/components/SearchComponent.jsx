// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";

function SearchComponent({ onSearchResults }) {
//   const [searchQuery, setSearchQuery] = useState("");

//   // Function to search Firestore projects based on keywords in title and tags
//   const searchProjects = async (searchQuery) => {
//     const postsCollection = collection(db, "posts");
//     const postsSnapshot = await getDocs(postsCollection);
//     const allProjects = postsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // Extract keywords from the search query
//     const keywords = extractKeywords(searchQuery);

//     // Filter projects where any keyword matches the title or tags
//     const results = allProjects.filter((project) =>
//       keywords.some(
//         (keyword) =>
//           project.projectName.toLowerCase().includes(keyword) ||
//           project.tags.some((tag) => tag.toLowerCase().includes(keyword))
//       )
//     );
//     return results;
//   };

//   // Function to extract keywords from search query
//   function stemWord(word) {
//     return word.replace(/(ing|ed|s)$/, '');
//   }
  
//   function extractKeywords(text) {
//     const stopWords = ["the", "and", "is", "in", "at", "of", "a"]; // Basic stop words list
//     return text
//       .toLowerCase()
//       .split(/\s+/)
//       .map((word) => word.replace(/[^\w]/g, ''))
//       .filter((word) => word && !stopWords.includes(word))
//       .map(stemWord);
//   }

//   // Handle search on input change
//   useEffect(() => {
//     if (searchQuery.trim()) {
//       searchProjects(searchQuery).then((results) => onSearchResults(results));
//     } else {
//       onSearchResults([]); // Clear results if search query is empty
//     }
//   }, [searchQuery, onSearchResults]);

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search projects..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//     </div>
//   );
 }

export default SearchComponent;