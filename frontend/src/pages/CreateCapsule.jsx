import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function CreateCapsule() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    project_name: "",
    prompt_title: "",
    prompt_version: "",
    prompt_text: "",
    response_summary: "",
    category: "",
    usefulness: "",
    reviewed: false,
    improved: false,
    screenshot_url: "",
    notes: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/capsules", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create capsule"
        );
      }

      navigate("/capsules");

    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-layout">

      <nav className="navbar">

        <div className="brand">
          <span className="brand-icon">AI</span>
          <span>AI Capsule</span>
        </div>

        <div className="nav-links">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/create" className="active">
            Create Capsule
          </Link>

          <Link to="/capsules">
            My Capsules
          </Link>
        </div>

      </nav>

      <main className="main-content">

        <div className="page-heading">
          <div>
            <h1>Create Capsule</h1>

            <p>
              Save a new AI prompt and its details.
            </p>
          </div>
        </div>

        <section className="section-card">

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form
            className="capsule-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              <div className="form-group">
                <label>Project Name</label>

                <input
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  placeholder="e.g. SmartFarm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prompt Title</label>

                <input
                  name="prompt_title"
                  value={form.prompt_title}
                  onChange={handleChange}
                  placeholder="e.g. Generate React component"
                  required
                />
              </div>

              <div className="form-group">
                <label>Prompt Version</label>

                <input
                  name="prompt_version"
                  value={form.prompt_version}
                  onChange={handleChange}
                  placeholder="e.g. v1.0"
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Development"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Prompt Text</label>

              <textarea
                name="prompt_text"
                value={form.prompt_text}
                onChange={handleChange}
                placeholder="Enter your AI prompt..."
                required
              />
            </div>

            <div className="form-group">
              <label>Response Summary</label>

              <textarea
                name="response_summary"
                value={form.response_summary}
                onChange={handleChange}
                placeholder="Summarise the AI response..."
              />
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Usefulness</label>

                <input
                  name="usefulness"
                  value={form.usefulness}
                  onChange={handleChange}
                  placeholder="e.g. Very useful"
                />
              </div>

              <div className="form-group">
                <label>Screenshot URL</label>

                <input
                  name="screenshot_url"
                  value={form.screenshot_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

            </div>

            <div className="checkbox-row">

              <label>
                <input
                  type="checkbox"
                  name="reviewed"
                  checked={form.reviewed}
                  onChange={handleChange}
                />

                Reviewed
              </label>

              <label>
                <input
                  type="checkbox"
                  name="improved"
                  checked={form.improved}
                  onChange={handleChange}
                />

                Improved
              </label>

            </div>

            <div className="form-group">
              <label>Notes</label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
              />
            </div>

            <div className="form-actions">

              <Link
                to="/dashboard"
                className="secondary-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Capsule"}
              </button>

            </div>

          </form>

        </section>

      </main>
    </div>
  );
}

export default CreateCapsule;