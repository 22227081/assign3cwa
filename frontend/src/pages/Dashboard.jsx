import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function Dashboard() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCapsules() {
      try {
        const response = await fetch("/api/capsules", {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setCapsules(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCapsules();
  }, []);

  const reviewedCount = capsules.filter(
    (capsule) => capsule.reviewed === 1
  ).length;

  const improvedCount = capsules.filter(
    (capsule) => capsule.improved === 1
  ).length;

  return (
    <div className="app-layout">

      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">AI</span>
          <span>AI Capsule</span>
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className="active">
            Dashboard
          </Link>

          <Link to="/create">
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
    <h1>Dashboard</h1>
    <p>
      Manage and review your AI prompt capsules.
    </p>
  </div>
</div>

        <div className="stats-grid">

          <div className="stat-card">
            <span className="stat-number">
              {capsules.length}
            </span>

            <span className="stat-label">
              Total Capsules
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {reviewedCount}
            </span>

            <span className="stat-label">
              Reviewed
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {improvedCount}
            </span>

            <span className="stat-label">
              Improved
            </span>
          </div>
        </div>

        <section className="section-card">

          <div className="section-header">
            <div>
              <h2>Recent Capsules</h2>
              <p>Your latest saved prompts</p>
            </div>

            <Link to="/capsules">
              View all
            </Link>
          </div>

          {loading ? (
            <p>Loading capsules...</p>
          ) : capsules.length === 0 ? (
            <div className="empty-state">
              <h3>No capsules yet</h3>

              <p>
                Create your first AI prompt capsule.
              </p>

             
            </div>
          ) : (
            <div className="capsule-table">

              <div className="table-header">
                <span>Prompt</span>
                <span>Project</span>
                <span>Category</span>
              </div>

              {capsules.slice(0, 5).map((capsule) => (
                <div className="table-row" key={capsule.id}>

                  <span>
                    {capsule.prompt_title}
                  </span>

                  <span>
                    {capsule.project_name}
                  </span>

                  <span>
                    {capsule.category || "—"}
                  </span>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;