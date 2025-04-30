import React, { useState } from 'react';
 

//Profile & Settings

const Profile = () => {
  //Profile Sample data
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [accountBalance, setAccountBalance] = useState(100);
  const userId = '12345';

  //Setting sample data
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [colorTheme, setColorTheme] = useState('Light');

  // State for modal input fields
  const [fundsToAdd, setFundsToAdd] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newColorTheme, setNewColorTheme] = useState(colorTheme);

  const [modal, setModal] = useState(null);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5vh',
    paddingBottom: '80px',
  };

  const sectionStyle = {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    color: 'white',
    textShadow: '1px 1px 3px black',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 70, 0, 0.8)',
    width: '90%',
    maxWidth: '400px',
    margin: '20px 0',
  };

  const boxStyle = {
    borderBottom: '1px solid white',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    fontSize: '1em',
    cursor: 'pointer',
    border: '2px solid white',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    color: 'white',
    textShadow: 'none',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '1em',
    marginTop: '10px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid green',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'relative',
    border: '3px solid green'
  };

  const closeIconStyle = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'green',
  };

  //Profile & Settings
  const openModal = (type) => {
    if (type === 'firstName') setNewFirstName(firstName);
    if (type === 'lastName') setNewLastName(lastName);
    if (type === 'funds') setFundsToAdd('');
    if (type === 'email') setNewEmail(email);
    if (type === 'password') setNewPassword(password);
    if (type === 'theme') setNewColorTheme(colorTheme);
    setModal(type);
  };

  const closeModal = () => setModal(null);

  //Save changes handler
  const saveChanges = () => {
    if (modal === 'firstName' && newFirstName.trim()) setFirstName(newFirstName.trim());
    if (modal === 'lastName' && newLastName.trim()) setLastName(newLastName.trim());
    if (modal === 'funds' && !isNaN(parseFloat(fundsToAdd))) {
      const amt = parseFloat(fundsToAdd);
      if (amt > 0) setAccountBalance(prev => prev + amt);
    }
    if (modal === 'email' && newEmail.trim()) setEmail(newEmail.trim());
    if (modal === 'password' && newPassword.trim()) setPassword(newPassword.trim());
    if (modal === 'theme') setColorTheme(newColorTheme);
    closeModal();
  };

  return (
    <div style={{
      backgroundImage: 'url("/triangle.png")',
      backgroundSize: 'contain',
      backgroundPosition: 'center',

      backgroundRepeat: 'repeat',
      height: '90vh',
      overflow: 'auto',
    }}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h2 style={{ textAlign: 'center' }}>Profile</h2>
          <div style={boxStyle}><strong>First Name:</strong><span>{firstName}<button onClick={() => openModal('firstName')} style={buttonStyle}>Change</button></span></div>
          <div style={boxStyle}><strong>Last Name:</strong><span>{lastName}<button onClick={() => openModal('lastName')} style={buttonStyle}>Change</button></span></div>
          <div style={boxStyle}><strong>User ID:</strong><span>{userId}</span></div>
          <div style={boxStyle}>
            <strong>Balance:</strong>
            <span>${accountBalance.toFixed(2)}
              <button onClick={() => openModal('funds')} style={buttonStyle}>+</button>
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ textAlign: 'center' }}>Settings</h2>
          <div style={boxStyle}><strong>Email:</strong><span>{email}<button onClick={() => openModal('email')} style={buttonStyle}>Change</button></span></div>
          <div style={boxStyle}><strong>Password:</strong><span>{'*'.repeat(password.length)}<button onClick={() => openModal('password')} style={buttonStyle}>Change</button></span></div>
          <div style={boxStyle}><strong>Theme:</strong><span>{colorTheme}<button onClick={() => openModal('theme')} style={buttonStyle}>Change</button></span></div>
        </div>
      </div>

      {modal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <span style={closeIconStyle} onClick={closeModal}>×</span>
            <h3>Update {modal.charAt(0).toUpperCase() + modal.slice(1)}</h3>
            {modal === 'theme' ? (
              <div style={{ marginTop: '10px' }}>
                <label>
                  <input
                    type="radio"
                    value="Light"
                    checked={newColorTheme === 'Light'}
                    onChange={() => setNewColorTheme('Light')}
                  /> Light
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    value="Dark"
                    checked={newColorTheme === 'Dark'}
                    onChange={() => setNewColorTheme('Dark')}
                  /> Dark
                </label>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button onClick={saveChanges} style={{ ...buttonStyle, borderColor: 'green', color: 'green' }}>Save</button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type={modal === 'password' ? 'password' : (modal === 'funds' ? 'number' : 'text')}
                  value={
                    modal === 'firstName' ? newFirstName :
                    modal === 'lastName' ? newLastName :
                    modal === 'funds' ? fundsToAdd :
                    modal === 'email' ? newEmail :
                    modal === 'password' ? newPassword :
                    ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (modal === 'firstName') setNewFirstName(val);
                    if (modal === 'lastName') setNewLastName(val);
                    if (modal === 'funds') setFundsToAdd(val);
                    if (modal === 'email') setNewEmail(val);
                    if (modal === 'password') setNewPassword(val);
                  }}
                  style={inputStyle}
                />
                <button onClick={saveChanges} style={{ ...buttonStyle, marginTop: '15px', borderColor: 'green', color: 'green' }}>Save</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;





