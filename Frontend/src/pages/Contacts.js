import React, { useState } from "react";

const Contacts = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");

  const [contacts, setContacts] = useState([
    { firstName: "Alice", lastName: "Smith", splitCount: 3 },
    { firstName: "Bob", lastName: "Johnson", splitCount: 5 },
    { firstName: "Charlie", lastName: "Brown", splitCount: 1 },
    { firstName: "Dana", lastName: "White", splitCount: 2 },
    { firstName: "Eva", lastName: "Green", splitCount: 0 },
    { firstName: "Frank", lastName: "Black", splitCount: 4 },
    { firstName: "Grace", lastName: "Lee", splitCount: 1 },
    { firstName: "Hank", lastName: "Moore", splitCount: 2 },
    { firstName: "Ivy", lastName: "Taylor", splitCount: 0 },
    { firstName: "Jack", lastName: "Anderson", splitCount: 6 },
    { firstName: "Kara", lastName: "Wright", splitCount: 0 },
  ]);

  const handleAddContact = () => {
    if (firstName && lastName && userId) {
      setContacts([{ firstName, lastName, splitCount: 0 }, ...contacts]);
      setFirstName("");
      setLastName("");
      setUserId("");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDeleteContact = (indexToDelete) => {
    const updated = contacts.filter((_, index) => index !== indexToDelete);
    setContacts(updated);
  };

  const inputStyle = {
    marginBottom: "5px",
    padding: "5px",
    borderRadius: "10px",
    border: "2px solid black",
    backgroundColor: "white",
    color: "black",
  };

  const boxStyle = {
    height: "200px",
    borderRadius: "30px",
    padding: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 70, 0, 0.8)",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 60, 0, 0.6)",
    border: "2px solid white", // ← white border added
  };

  return (
    <div
      style={{
        marginTop: "10vh",
        height: "90vh",
        overflow: "auto",
        backgroundImage: 'url("/triangle.png")',
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        padding: "0 40px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "white",
          textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)",
          margin: "20px 0",
        }}
      >
        Contacts
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px",
          paddingBottom: "30px",
        }}
      >
        {/* Add Contact Box */}
        <div
          style={{
            ...boxStyle,
            backgroundColor: "rgba(0,128,0,0.6)",
            border: "2px dashed white", // keep distinct for add box
            justifyContent: "flex-start",
          }}
        >
          <h3 style={{ color: "white" }}>+ Add New Contact</h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ ...inputStyle, marginBottom: "10px" }}
          />
          <button
            onClick={handleAddContact}
            style={{
              padding: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 70, 0, 0.8)",
            }}
          >
            Save
          </button>
        </div>

        {/* Contact Cards */}
        {contacts.map((contact, index) => (
          <div
            key={index}
            style={{
              ...boxStyle,
              backgroundColor: "rgba(0, 128, 0, 0.8)",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => handleDeleteContact(index)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "4px 8px",
                backgroundColor: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
              title="Delete Contact"
            >
              Delete
            </button>

            <div>
              <h4 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                {contact.firstName} {contact.lastName}
              </h4>
            </div>
            <div style={{ fontSize: "1rem", opacity: 0.8 }}>
              Splits: {contact.splitCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;



