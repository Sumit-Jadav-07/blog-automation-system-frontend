/**
 * client.js
 *
 * This file handles all the API calls to our backend server.
 * It uses axios to make HTTP requests and automatically attaches
 * the API token from our .env file to every request.
 *
 * Functions:
 *   fetchBlogs() -> Get the list of all blogs
 *   fetchBlog(id) -> Get a single blog by its ID
 *   generateBlog(topic, platform) -> Ask the AI to create a new blog about a topic for a platform
 *   deleteBlog(id) -> Permanently delete a blog
 */

import axios from "axios";

// Create an axios instance with our base URL and auth token
// so we don't have to repeat this config in every function
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "X-API-Token": import.meta.env.VITE_API_TOKEN || "change-me",
    "Content-Type": "application/json",
  },
});

// Get all blogs — used on the dashboard to show the history list
export async function fetchBlogs() {
  const { data } = await api.get("/blogs");
  console.log("Fetched blogs:", data);
  return data;
}

// Get one specific blog by ID — used when clicking a blog or opening the reader page
export async function fetchBlog(blogId) {
  const { data } = await api.get(`/blogs/${blogId}`);
  return data;
}

// Ask the AI pipeline to generate a new blog from a topic and target platform
export async function generateBlog(topic, platform) {
  const params = new URLSearchParams({
    topic,
    platform,
  });
  const { data } = await api.post(`/blogs/generate?${params.toString()}`);
  return data;
}

// Permanently delete a blog — this can't be undone!
export async function deleteBlog(blogId) {
  const { data } = await api.delete(`/blogs/${blogId}`);
  return data;
}
