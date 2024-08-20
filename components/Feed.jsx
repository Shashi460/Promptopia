"use client";
import PromptCard from "./PromptCard";
import { useEffect, useState } from "react";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/prompt", { headers: { 'Cache-Control': 'no-cache' } });
      const data = await response.json();
      setAllPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateOrDelete = async () => {
    // Your logic for create or delete...
    // Then re-fetch posts:
    await fetchPosts();
  };

  return (
    <section className="feed">
      <PromptCardList data={allPosts} handleCreateOrDelete={handleCreateOrDelete} />
    </section>
  );
};

export default Feed;

