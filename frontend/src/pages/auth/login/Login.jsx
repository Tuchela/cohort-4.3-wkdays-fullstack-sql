import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../../utils/auth";
import styles from "./login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://cohort-4-3-wkdays-fullstack-sql.onrender.com/api/v1/login-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.status === 200) {
        login(data.token);
        localStorage.setItem("userId", data.id);
        toast.success(data.message); // "Welcome back Fahanmi, you have logged in successfully"
        navigate("/dashboard");
        return;
      }

      if (res.status === 401) {
        toast.error(data.error); // "Invalid user credentials, Either email or password incorrect"
        return;
      }

      toast.error(data.error || "Login failed");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container">
      <Link to="/" className={styles.homeLink}>
        Home
      </Link>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>

        <div className={styles.authLinkContainer}>
          <p>
            Don't have an account?{" "}
            <Link className={styles.authLink} to="/auth/register">
              Register
            </Link>
          </p>
          <Link className={styles.authLink} to="/auth/forgot-password">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
