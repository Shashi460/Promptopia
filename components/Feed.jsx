"use client";
import PromptCard from "./PromptCard";
import { useCallback, useEffect, useState } from "react";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          // Add handlers for edit and delete
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [operation, setOperation] = useState(""); // Track create, delete, or edit

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/prompt");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setAllPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, operation]);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  const handleCreate = async (newPrompt) => {
    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPrompt),
      });

      if (response.ok) {
        setOperation("create");
      }
    } catch (error) {
      console.error("Failed to create prompt:", error);
    }
  };

  const handleDelete = async (promptId) => {
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOperation("delete");
      }
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    }
  };

  const handleEdit = async (updatedPrompt) => {
    try {
      const response = await fetch(`/api/prompt/${updatedPrompt._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPrompt),
      });

      if (response.ok) {
        setOperation("edit");
      }
    } catch (error) {
      console.error("Failed to edit prompt:", error);
    }
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
          // Pass handlers if needed
        />
      ) : (
        <PromptCardList
          data={allPosts}
          handleTagClick={handleTagClick}
          // Pass handlers if needed
        />
      )}
    </section>
  );
};

export default Feed;
