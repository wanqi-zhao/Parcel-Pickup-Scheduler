import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import facebookIcon from '../assets/facebook.jpeg';
import googleIcon from '../assets/google.jpeg';
import emailIcon from '../assets/email.jpeg';
import phoneIcon from '../assets/phone.jpeg';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      'Current backend admin flow may still differ from this UI. This admin page is visually aligned first.'
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.phoneFrame}>
        <div style={styles.inner}>
          <div style={styles.topRow}>
            <Link to="/" style={styles.backLink}>
              ← Back
            </Link>
          </div>

          <div style={styles.headerBlock}>
            <h1 style={styles.title}>Welcome back to our team</h1>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputBox}>
              <input
                type="text"
                placeholder="Enter your admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <input
                type="email"
                placeholder="Enter your work email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.signUpButton}>
              Sign Up
            </button>
          </form>

          <div style={styles.bottomSection}>
            <div style={styles.orRow}>
              <div style={styles.line}></div>
              <span style={styles.orCircle}>or</span>
              <div style={styles.line}></div>
            </div>

            <div style={styles.socialRow}>
              <button type="button" style={styles.socialButton}>
                <img src={facebookIcon} alt="Facebook" style={styles.socialIcon} />
              </button>
              <button type="button" style={styles.socialButton}>
                <img src={googleIcon} alt="Google" style={styles.socialIcon} />
              </button>
              <button type="button" style={styles.socialButton}>
                <img src={emailIcon} alt="Email" style={styles.socialIcon} />
              </button>
              <button type="button" style={styles.socialButton}>
                <img src={phoneIcon} alt="Phone" style={styles.socialIcon} />
              </button>
            </div>

            <div style={styles.bottomText}>
              <span style={styles.bottomLabel}>Already have an account? </span>
              <Link to="/login" style={styles.bottomLink}>
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
