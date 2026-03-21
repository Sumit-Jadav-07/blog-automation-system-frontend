/**
 * DashboardPage.jsx
 *
 * This is the main dashboard — the "home" of the app.
 * It has two columns:
 *   Left:  The blog generation form + history of past blogs
 *   Right: A preview of the currently selected blog
 *
 * When you generate a new blog, it appears in the history list
 * and gets auto-selected so you can preview it right away.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchBlog, fetchBlogs, generateBlog, publishBlog, deleteBlog } from "../api/client";
import BlogForm from "../components/BlogForm";
import BlogHistory from "../components/BlogHistory";
import BlogPreview from "../components/BlogPreview";
import "./DashboardPage.css";

export default function DashboardPage() {
  // The topic text the user types in the form
  const [topic, setTopic] = useState("");

  // All blogs from the server
  const [blogs, setBlogs] = useState([]);

  // The blog that's currently being shown in the preview panel
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Loading states for generating and publishing
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Load blogs from the server when the page first loads
  useEffect(() => {
    loadBlogs();
  }, []);

  // Fetch all blogs and auto-select the first one if nothing is selected
  async function loadBlogs() {
    try {
      const data = await fetchBlogs();
      setBlogs(data);
      if (data.length > 0 && !selectedBlog) {
        setSelectedBlog(data[0]);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // Generate a new blog from the topic
  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Generating blog...");
    try {
      const blog = await generateBlog(topic);
      setSelectedBlog(blog);
      setTopic(""); // Clear the input after generating
      const refreshed = await fetchBlogs();
      setBlogs(refreshed);
      toast.success("Blog generated successfully!", { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // Select a blog from the history list to preview
  async function handleSelect(blogId) {
    try {
      const blog = await fetchBlog(blogId);
      setSelectedBlog(blog);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // Publish a blog to Medium
  async function handlePublish(blogId) {
    setPublishing(true);
    const toastId = toast.loading("Publishing to Medium...");
    try {
      const updatedBlog = await publishBlog(blogId);
      setSelectedBlog(updatedBlog);
      const refreshed = await fetchBlogs();
      setBlogs(refreshed);
      toast.success("Published successfully!", { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    } finally {
      setPublishing(false);
    }
  }

  // Delete a blog and refresh the list
  async function handleDelete(blogId) {
    try {
      await deleteBlog(blogId);
      // If we just deleted the blog we were looking at, clear it
      if (selectedBlog?.id === blogId) {
        setSelectedBlog(null);
      }
      const refreshed = await fetchBlogs();
      setBlogs(refreshed);
      // Auto-select the first blog if there are any left
      if (refreshed.length > 0) {
        setSelectedBlog(refreshed[0]);
      }
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      {/* Background glow effects */}
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="layout-grid">
        {/* Left side: form + history */}
        <div className="left-column">
          <BlogForm
            topic={topic}
            onTopicChange={setTopic}
            onSubmit={handleGenerate}
            loading={loading}
          />
          <BlogHistory
            blogs={blogs}
            selectedBlogId={selectedBlog?.id}
            onSelect={handleSelect}
          />
        </div>

        {/* Right side: blog preview */}
        <div className="right-column">
          <BlogPreview
            blog={selectedBlog}
            onPublish={handlePublish}
            onDelete={handleDelete}
            publishing={publishing}
          />
        </div>
      </section>
    </>
  );
}

// Pull a readable error message from different error formats
function getErrorMessage(error) {
  return error?.response?.data?.detail || error?.message || "Something went wrong.";
}
