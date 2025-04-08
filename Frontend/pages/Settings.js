import React, { useState } from 'react';

const Settings = () => {
  // Settings state
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [colorTheme, setColorTheme] = useState('Light'); // Can be "Light" or "Dark"

  // Modal states for updating each setting
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // State for modal input fields
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newColorTheme, setNewColorTheme] = useState(colorTheme);

  // Handlers for Email Modal
  const handleOpenEmailModal = () => {
    setNewEmail(email);
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
  };

  const handleSaveEmail = () => {
    if (newEmail.trim() !== '') {
      setEmail(newEmail.trim());
      handleCloseEmailModal();
    } else {
      alert('Email cannot be empty.');
    }
  };

  // Handlers for Password Modal
  const handleOpenPasswordModal = () => {
    setNewPassword(password);
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword('');
  };

  const handleSavePassword = () => {
    if (newPassword.trim() !== '') {
      setPassword(newPassword.trim());
      handleClosePasswordModal();
    } else {
      alert('Password cannot be empty.');
    }
  };

  // Handlers for Color Theme Modal
  const handleOpenThemeModal = () => {
    setNewColorTheme(colorTheme);
    setShowThemeModal(true);
  };

  const handleCloseThemeModal = () => {
    setShowThemeModal(false);
  };

  const handleSaveTheme = () => {
    setColorTheme(newColorTheme);
    handleCloseThemeModal();
  };

  // Styles (similar to ProfilePage)
  const headerStyle = {
    width: '100%',
    backgroundColor: 'green',
    padding: '10px 20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  };

  const logoStyle = {
    fontWeight: 'bold',
    fontSize: '1.2em'
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  };

  const boxStyle = {
    border: '2px solid green',
    borderRadius: '5px',
    padding: '10px 20px',
    width: '300px',
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '150px',
    padding: '5px',
    fontSize: '1em'
  };

  // Button style with green edges
  const buttonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    fontSize: '1em',
    cursor: 'pointer',
    border: '2px solid green',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'green'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center'
  };

  return (
    <div>
      {/* Settings Data Container */}
      <div style={containerStyle}>
        {/* Email */}
        <div style={boxStyle}>
          <strong>Email:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{email}</span>
            <button onClick={handleOpenEmailModal} style={buttonStyle}>
              Change
            </button>
          </div>
        </div>

        {/* Password */}
        <div style={boxStyle}>
          <strong>Password:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{"*".repeat(password.length)}</span>
            <button onClick={handleOpenPasswordModal} style={buttonStyle}>
              Change
            </button>
          </div>
        </div>

        {/* Color Theme */}
        <div style={boxStyle}>
          <strong>Color Theme:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{colorTheme}</span>
            <button onClick={handleOpenThemeModal} style={buttonStyle}>
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Changing Email */}
      {showEmailModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Change Email</h3>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSaveEmail} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleCloseEmailModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Changing Password */}
      {showPasswordModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Change Password</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSavePassword} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleClosePasswordModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Changing Color Theme */}
      {showThemeModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Change Color Theme</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="radio"
                  value="Light"
                  checked={newColorTheme === 'Light'}
                  onChange={(e) => setNewColorTheme(e.target.value)}
                />{' '}
                Light
              </label>
              <label style={{ marginLeft: '10px' }}>
                <input
                  type="radio"
                  value="Dark"
                  checked={newColorTheme === 'Dark'}
                  onChange={(e) => setNewColorTheme(e.target.value)}
                />{' '}
                Dark
              </label>
            </div>
            <div>
              <button onClick={handleSaveTheme} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleCloseThemeModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;