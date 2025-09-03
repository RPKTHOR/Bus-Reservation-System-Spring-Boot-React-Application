import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      const res = await login(email, password);
      const roles = res.roles || [];
      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ROLE_CUSTOMER")) {
        navigate("/customer");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Log in to access your account</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <div style={styles.registerLink}>
          Don't have an account? <Link to="/register" style={styles.link}>Register Now</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#7ba1daff', // Light gray background
    fontFamily: 'Arial, sans-serif',
  },
  loginCard: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(118, 134, 174, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '8px',
    color: '#333',
  },
  subheading: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#000000ff',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ffffffff',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  registerLink: {
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#777',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;