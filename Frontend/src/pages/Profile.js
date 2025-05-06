import React, { useState, useEffect } from 'react';
import axios from 'axios';


//Profile & Settings

const Profile = () => {
  // Id of currently logged in user
  const getCurrentId = () => {
    return localStorage.getItem('currentId');
  };
  const currentId = getCurrentId();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [colorTheme, setColorTheme] = useState('Light');

  const [fundsToAdd, setFundsToAdd] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newColorTheme, setNewColorTheme] = useState(colorTheme);
  const [darkMode, setDarkMode] = useState(false);

  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/accounts/darkmode', {
          params: { account_id: currentId },
        });

        if (response.data.length > 0) {
          setDarkMode(response.data[0].dark_mode === 1); // Assuming SQL returns 1/0
        }
      } catch (error) {
        console.error('Error fetching dark mode setting:', error);
      }
    };

    fetchDarkMode();
  }, [currentId]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/accounts`, { params: { account_id: currentId } })
      .then((res) => {
        const data = res.data[0];
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAccountBalance(data.account_balance);
      })
      .catch((err) => console.error("Failed to load account data", err));

    axios
      .get(`http://localhost:8080/api/settings`, { params: { account_id: currentId } })
      .then((res) => {
        const data = res.data[0];
        setEmail(data.email);
        setColorTheme(data.dark_mode === 1 ? 'Dark' : 'Light');
        setNewColorTheme(data.dark_mode === 1 ? 'Dark' : 'Light');
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, [currentId]);

  const openModal = (type) => {
    if (type === 'firstName') setNewFirstName(firstName);
    if (type === 'lastName') setNewLastName(lastName);
    if (type === 'funds') setFundsToAdd('');
    if (type === 'email') setNewEmail(email);
    if (type === 'password') {
      setNewPassword('');
      setCurrentPasswordInput('');
    }
    if (type === 'theme') setNewColorTheme(colorTheme);
    setModal(type);
  };

  const closeModal = () => setModal(null);

  const saveChanges = () => {
    if (modal === 'firstName' && newFirstName.trim()) {
      axios.put('http://localhost:8080/api/accounts/firstname', {
        account_id: currentId,
        first_name: newFirstName.trim(),
      });
      setFirstName(newFirstName.trim());
    }

    if (modal === 'lastName' && newLastName.trim()) {
      axios.put('http://localhost:8080/api/accounts/lastname', {
        account_id: currentId,
        last_name: newLastName.trim(),
      });
      setLastName(newLastName.trim());
    }

    if (modal === 'funds' && !isNaN(parseFloat(fundsToAdd))) {
      const amt = parseFloat(fundsToAdd);
      if (amt > 0) {
        const newBalance = accountBalance + amt;
        axios.put('http://localhost:8080/api/accounts/balance', {
          account_id: currentId,
          balance: newBalance,
        });
        setAccountBalance(newBalance);
      }
    }

    if (modal === 'email' && newEmail.trim()) {
      axios.put('http://localhost:8080/api/accounts/email', {
        account_id: currentId,
        email: newEmail.trim(),
      });
      setEmail(newEmail.trim());
    }

    if (modal === 'password' && currentPasswordInput.trim() && newPassword.trim()) {
      axios.put('http://localhost:8080/api/accounts/password', {
        account_id: currentId,
        current_password: currentPasswordInput.trim(),
        new_password: newPassword.trim(),
      })
      .then(() => {
        setPassword(newPassword.trim());
        alert("Password updated successfully.");
      })
      .catch((err) => {
        console.error("Password update failed", err);
        alert("Incorrect current password or server error.");
      });
    }

    if (modal === 'theme') {
      const darkmode = newColorTheme === 'Dark' ? 1 : 0;
      axios.put('http://localhost:8080/api/accounts/darkmode', {
        account_id: currentId,
        darkmode: darkmode,
      });
      setColorTheme(newColorTheme);
      setDarkMode(darkmode === 1);
    }

    closeModal();
  };

  // Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row', // horizontal layout
    justifyContent: 'center', // centers the sections horizontally
    alignItems: 'stretch',
    gap: '10vw', // space between the two sections
    marginTop: '15vh',
    paddingBottom: '80px',
  };
  

  const sectionStyle = {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
    padding: '25px',
    borderRadius: '40px',
    boxShadow: '0 4px 8px rgba(0, 70, 0, 0.8)',
    width: '90%',
    maxWidth: '400px',
    margin: '20px 0',
    border: "2px solid rgba(166, 166, 166, 0.6)",

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
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '30px',
    backgroundColor: '#4caf50',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '1em',
    marginTop: '10px',
    borderRadius: '30px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid green',
    outline: 'none',
    boxSizing: 'border-box',
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
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
    padding: '20px',
    borderRadius: '30px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'relative',
    border: "2px solid white",  //white border around data boxes

  };

  const closeIconStyle = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white',
  };

  const backgroundImage = darkMode ? 'url("/triangle_dark.png")' : 'url("/triangle.png")';

  return (
    <div style={{
      marginTop: "10vh",
      backgroundImage: backgroundImage,
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
          <div style={boxStyle}><strong>User ID:</strong><span>{currentId}</span></div>
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
                  <button onClick={saveChanges} style={{ ...buttonStyle, borderColor: 'g', color: 'white' }}>Save</button>
                </div>
              </div>
            ) : modal === 'password' ? (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...inputStyle, marginTop: '10px' }}
                />
                <button onClick={saveChanges} style={{ ...buttonStyle, marginTop: '15px', color: 'white' }}>
                  Save
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type={modal === 'funds' ? 'number' : 'text'}
                  value={
                    modal === 'firstName' ? newFirstName :
                    modal === 'lastName' ? newLastName :
                    modal === 'funds' ? fundsToAdd :
                    modal === 'email' ? newEmail :
                    ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (modal === 'firstName') setNewFirstName(val);
                    if (modal === 'lastName') setNewLastName(val);
                    if (modal === 'funds') setFundsToAdd(val);
                    if (modal === 'email') setNewEmail(val);
                  }}
                  style={inputStyle}
                />
                <button onClick={saveChanges} style={{ ...buttonStyle, marginTop: '15px'}}>Save</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bar at bottom of screen */}
      <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        backgroundColor: '#129238',
        color: 'white',
        padding: '10px 20px',
        fontSize: '14px',
        zIndex: 1000,
        boxShadow: '0 -3px 5px rgba(0,70,0,0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          © 2025 Longbeard Crew
        </div>
        <div style={{ flex: 1, textAlign: 'right', marginRight: 40 }}>
          Built with React, Express (Node.js), and MySQL.
        </div>
      </div>
    </div>
  );
};

export default Profile;
