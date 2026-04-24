import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./verifyOtp.module.css";

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
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
        "https://cohort-4-3-wkdays-fullstack-sql.onrender.com/api/v1/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message); // "Password reset successful"
        navigate("/auth/login");
        return;
      }

      if (res.status === 400) {
        toast.error(data.message); // "OTP expired or not set" / "Invalid OTP" / "email, otp and newPassword required"
        return;
      }

      if (res.status === 404) {
        toast.error(data.message); // "User not found"
        return;
      }

      toast.error(data.error || "Something went wrong");
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
        <h1>Reset Password</h1>
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
            name="otp"
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>

        <div className={styles.authLinkContainer}>
          <p>
            Remembered your password?{" "}
            <Link className={styles.authLink} to="/auth/login">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
