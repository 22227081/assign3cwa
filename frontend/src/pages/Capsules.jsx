import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function Capsules() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [error, setError] = useState("");

  async function loadCapsules() {
    try {
      const response = await fetch(
        "/api/capsules",
        {
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Authentication required");
      }

      const data = await response.json();

      setCapsules(data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCapsules();
  }, []);

  function startEdit(capsule) {
    setEditingId(capsule.id);

    setEditForm({
      project_name: capsule.project_name,
      prompt_title: capsule.prompt_title,
      prompt_version: capsule.prompt_version || "",
      prompt_text: capsule.prompt_text,
      response_summary: capsule.response_summary || "",
      category: capsule.category || "",
      usefulness: capsule.usefulness || "",
      reviewed: Boolean(capsule.reviewed),
      improved: Boolean(capsule.improved),
      screenshot_url: capsule.screenshot_url || "",
      notes: capsule.notes || ""
    });
  }

  function handleEditChange(event) {
    const { name, value, type, checked } = event.target;

    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function saveEdit(id) {
    try {
      const response = await fetch(
        `/api/capsules/${id}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(editForm)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update capsule"
        );
      }

      setCapsules(
        capsules.map((capsule) =>
          capsule.id === id ? data : capsule
        )
      );

      setEditingId(null);

    } catch (error) {
      setError(error.message);
    }
  }

  async function deleteCapsule(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this capsule?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/capsules/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete capsule"
        );
      }

      setCapsules(
        capsules.filter(
          (capsule) => capsule.id !== id
        )
      );

    } catch (error) {
      setError(error.message);
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

          <Link to="/create">
            Create Capsule
          </Link>

          <Link to="/capsules" className="active">
            My Capsules
          </Link>

        </div>

      </nav>

      <main className="main-content">

       <div className="page-heading">

  <div>
    <h1>My Capsules</h1>

    <p>
      View, edit and delete your saved AI prompts.
    </p>
  </div>

</div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <section className="section-card">
            <p>Loading capsules...</p>
          </section>
        ) : capsules.length === 0 ? (
          <section className="section-card empty-state">
            <h2>No Capsules</h2>

            <p>
              You haven't created any capsules yet.
            </p>

            <Link
              to="/create"
              className="primary-button"
            >
              Create Your First Capsule
            </Link>
          </section>
        ) : (
          <div className="capsule-list">

            {capsules.map((capsule) => (

              <section
                className="capsule-card"
                key={capsule.id}
              >

                {editingId === capsule.id ? (

                  <div className="edit-form">

                    <h2>Edit Capsule</h2>

                    <input
                      name="project_name"
                      value={editForm.project_name}
                      onChange={handleEditChange}
                      placeholder="Project name"
                    />

                    <input
                      name="prompt_title"
                      value={editForm.prompt_title}
                      onChange={handleEditChange}
                      placeholder="Prompt title"
                    />

                    <textarea
                      name="prompt_text"
                      value={editForm.prompt_text}
                      onChange={handleEditChange}
                      placeholder="Prompt text"
                    />

                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      placeholder="Category"
                    />

                    <textarea
                      name="response_summary"
                      value={editForm.response_summary}
                      onChange={handleEditChange}
                      placeholder="Response summary"
                    />

                    <textarea
                      name="notes"
                      value={editForm.notes}
                      onChange={handleEditChange}
                      placeholder="Notes"
                    />

                    <div className="checkbox-row">

                      <label>
                        <input
                          type="checkbox"
                          name="reviewed"
                          checked={editForm.reviewed}
                          onChange={handleEditChange}
                        />

                        Reviewed
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="improved"
                          checked={editForm.improved}
                          onChange={handleEditChange}
                        />

                        Improved
                      </label>

                    </div>

                    <div className="form-actions">

                      <button
                        className="secondary-button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>

                      <button
                        className="primary-button"
                        onClick={() => saveEdit(capsule.id)}
                      >
                        Save Changes
                      </button>

                    </div>

                  </div>

                ) : (

                  <>

                    <div className="capsule-header">

                      <div>
                        <h2>
                          {capsule.prompt_title}
                        </h2>

                        <p>
                          {capsule.project_name}
                        </p>
                      </div>

                      <span className="category-badge">
                        {capsule.category || "Uncategorised"}
                      </span>

                    </div>

                    <div className="capsule-content">

                      <h4>Prompt</h4>

                      <p>
                        {capsule.prompt_text}
                      </p>

                      {capsule.response_summary && (
                        <>
                          <h4>Response Summary</h4>

                          <p>
                            {capsule.response_summary}
                          </p>
                        </>
                      )}

                    </div>

                    <div className="capsule-meta">

                      <span>
                        {capsule.reviewed
                          ? "✓ Reviewed"
                          : "○ Not reviewed"}
                      </span>

                      <span>
                        {capsule.improved
                          ? "✓ Improved"
                          : "○ Not improved"}
                      </span>

                    </div>

                    <div className="capsule-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          startEdit(capsule)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteCapsule(capsule.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </>

                )}

              </section>

            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default Capsules;