import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchBlog, fetchBlogs, generateBlog, deleteBlog } from "../api/client";
import BlogForm from "../components/BlogForm";
import BlogHistory from "../components/BlogHistory";
import BlogPreview from "../components/BlogPreview";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("DevTo");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

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

  async function handleGenerate(event) {
    event.preventDefault();

    // Check if the selected platform is marked as coming soon and show a toast if so, without proceeding to generation
    // const selectedPlatformObj = PLATFORM_OPTIONS.find((p) => p.value === platform);
    // if (selectedPlatformObj?.status === "coming-soon") {
    //   toast.info(`${selectedPlatformObj.label} integration is coming soon! 🚀`, {
    //     duration: 4000,
    //     style: {
    //       background: '#333',
    //       color: '#fff',
    //     },
    //   });
    //   return;
    // }

    setLoading(true);

    const toastId = toast.loading("Generating blog...");
    try {
      const response = await generateBlog(topic, platform);
      if (response && response.blog) {
        const blog = response.blog;
        setBlogs((prev) => [blog, ...prev]);
        setSelectedBlog(blog);
        setTopic("");
        toast.success(response.message || "Blog generated successfully!", { id: toastId });
      } else {
        throw new Error(response?.message || "Generation failed without a blog object.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(blogId) {
    try {
      const blog = await fetchBlog(blogId);
      setSelectedBlog(blog);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(blogId) {
    try {
      await deleteBlog(blogId);
      if (selectedBlog?.id === blogId) {
        setSelectedBlog(null);
      }
      const refreshed = await fetchBlogs();
      setBlogs(refreshed);
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
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <div className="mesh mesh-one" aria-hidden />
      <div className="mesh mesh-two" aria-hidden />

      <section className="dashboard-page">
        <div className="hero-card glass">
          <div>
            <div className="eyebrow">Automation Hub</div>
            <h1>Launch AI-crafted stories in minutes</h1>
            <p className="card-copy">
              Generate topics, preview Medium-ready drafts, and keep a living history in one sleek workspace.
            </p>
            <div className="chip-row">
              <span className="chip">Research → Write -> SEO -> Edit -> Publish</span>
              <span className="chip">1-click preview</span>
              {/* <span className="chip">Dark / Light</span> */}
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <p className="stat-label">Total blogs</p>
              <p className="stat-value">{blogs.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Status</p>
              <p className="stat-value accent">{loading ? "Generating" : "Idle"}</p>
            </div>
          </div>
        </div>

        <div className="layout-grid">
          <div className="left-column">
            <BlogForm
              topic={topic}
              platform={platform}
              onTopicChange={setTopic}
              onPlatformChange={setPlatform}
              onSubmit={handleGenerate}
              loading={loading}
            />
            <BlogHistory
              blogs={blogs}
              selectedBlogId={selectedBlog?.id}
              onSelect={handleSelect}
            />
          </div>

          <div className="right-column">
            <BlogPreview
              blog={selectedBlog}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function getErrorMessage(error) {
  return error?.response?.data?.detail || error?.message || "Something went wrong.";
}
