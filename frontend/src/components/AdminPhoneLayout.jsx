import React from 'react';
import profile2 from '../assets/profile2.jpeg';

export default function AdminPhoneLayout({
  title,
  onBack,
  onProfile,
  children,
  hideProfile = false,
}) {
  return (
    <div style={styles.outer}>
      <div style={styles.phone}>
        <div style={styles.topRow}>
          <button style={styles.backBtn} onClick={onBack}>
            &lt;Back
          </button>

          {hideProfile ? (
            <div style={{ width: 26, height: 26 }} />
          ) : (
            <img
              src={profile2}
              alt="profile"
              style={styles.profileIcon}
              onClick={onProfile}
            />
          )}
        </div>

        <div style={styles.titleBox}>{title}</div>

        <div>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  outer: {
    minHeight: '100vh',
    background: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
  },
  phone: {
    width: '390px',
    minHeight: '844px',
    background: '#ffffff',
    padding: '18px 16px 36px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    border: 'none',
    background: 'transparent',
    fontSize: 14,
    cursor: 'pointer',
    padding: 0,
  },
  profileIcon: {
    width: 26,
    height: 26,
    objectFit: 'contain',
    cursor: 'pointer',
  },
  titleBox: {
    background: '#5e9df4',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 8,
    padding: '13px 12px',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 24,
  },
};