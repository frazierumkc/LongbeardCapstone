import React, { useState } from 'react';

const ProfilePage = () => {
  // Profile data state
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [accountBalance, setAccountBalance] = useState(100);
  const userId = '12345';

  // Modal states for funds and name changes
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showFirstNameModal, setShowFirstNameModal] = useState(false);
  const [showLastNameModal, setShowLastNameModal] = useState(false);

  // State for modal input fields
  const [fundsToAdd, setFundsToAdd] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  // Handlers for funds modal
  const handleOpenFundsModal = () => {
    setShowFundsModal(true);
  };

  const handleCloseFundsModal = () => {
    setShowFundsModal(false);
    setFundsToAdd('');
  };

  const handleFundsInputChange = (event) => {
    setFundsToAdd(event.target.value);
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundsToAdd);
    if (!isNaN(amount) && amount > 0) {
      setAccountBalance((prevBalance) => prevBalance + amount);
      handleCloseFundsModal();
    } else {
      alert('Please enter a valid amount greater than 0');
    }
  };

  // Handlers for first name modal
  const handleOpenFirstNameModal = () => {
    setNewFirstName(firstName);
    setShowFirstNameModal(true);
  };

  const handleCloseFirstNameModal = () => {
    setShowFirstNameModal(false);
    setNewFirstName('');
  };

  const handleFirstNameInputChange = (event) => {
    setNewFirstName(event.target.value);
  };

  const handleSaveFirstName = () => {
    if (newFirstName.trim() !== '') {
      setFirstName(newFirstName.trim());
      handleCloseFirstNameModal();
    } else {
      alert('First name cannot be empty.');
    }
  };

  // Handlers for last name modal
  const handleOpenLastNameModal = () => {
    setNewLastName(lastName);
    setShowLastNameModal(true);
  };

  const handleCloseLastNameModal = () => {
    setShowLastNameModal(false);
    setNewLastName('');
  };

  const handleLastNameInputChange = (event) => {
    setNewLastName(event.target.value);
  };

  const handleSaveLastName = () => {
    if (newLastName.trim() !== '') {
      setLastName(newLastName.trim());
      handleCloseLastNameModal();
    } else {
      alert('Last name cannot be empty.');
    }
  };

  // Styles
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

  // Updated button style with green border edges
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
      {/* Top Navigation Bar */}
      <header style={headerStyle}>
        <div style={logoStyle}>LOGO</div>
        {/* Additional tabs can be added here */}
      </header>

      {/* Profile Data Container */}
      <div style={containerStyle}>
        {/* First Name */}
        <div style={boxStyle}>
          <strong>First Name:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{firstName}</span>
            <button onClick={handleOpenFirstNameModal} style={buttonStyle}>
              Change
            </button>
          </div>
        </div>

        {/* Last Name */}
        <div style={boxStyle}>
          <strong>Last Name:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{lastName}</span>
            <button onClick={handleOpenLastNameModal} style={buttonStyle}>
              Change
            </button>
          </div>
        </div>

        {/* User ID (read-only) */}
        <div style={boxStyle}>
          <strong>User ID:</strong>
          <span>{userId}</span>
        </div>

        {/* Account Balance with plus symbol */}
        <div style={boxStyle}>
          <strong>Account Balance:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>${accountBalance.toFixed(2)}</span>
            <button
              onClick={handleOpenFundsModal}
              style={{ ...buttonStyle, padding: '0 5px', marginLeft: '10px' }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Adding Funds */}
      {showFundsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Add Funds</h3>
            <input
              type="number"
              value={fundsToAdd}
              onChange={handleFundsInputChange}
              placeholder="Enter amount"
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleAddFunds} style={buttonStyle}>
                Add
              </button>
              <button onClick={handleCloseFundsModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Changing First Name */}
      {showFirstNameModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Change First Name</h3>
            <input
              type="text"
              value={newFirstName}
              onChange={handleFirstNameInputChange}
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSaveFirstName} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleCloseFirstNameModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Changing Last Name */}
      {showLastNameModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Change Last Name</h3>
            <input
              type="text"
              value={newLastName}
              onChange={handleLastNameInputChange}
              style={inputStyle}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSaveLastName} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleCloseLastNameModal} style={{ ...buttonStyle, marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;





