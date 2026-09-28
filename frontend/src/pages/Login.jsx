

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">AI</div>

        <h1>AI Capsule</h1>

        <p className="subtitle">
          Your personal AI prompt management workspace.
        </p>

        <p className="login-description">
          Store, organize, review and improve your AI prompts in one place.
        </p>

        <a
          className="github-button"
          href="/auth/github"
        >
          Continue with GitHub
        </a>
      </div>
    </div>
  );
}

export default Login;