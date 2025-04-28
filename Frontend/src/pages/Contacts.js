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

  const boxStyle = {
    height: "200px",
    minHeight: "200px",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "2px solid green",
    position: "relative",
  };

  return (
    <div style={{ marginTop: "10vh", height: "90vh", overflow: "auto" }}>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        {/*Add Contact Box */}
        <div
          style={{
            ...boxStyle,
            backgroundColor: "#e0f7e9",
            border: "2px dashed green",
          }}
        >
          <h3 style={{ color: "green" }}>+ Add New Contact</h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ marginBottom: "5px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ marginBottom: "5px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginBottom: "10px", padding: "5px" }}
          />
          <button
            onClick={handleAddContact}
            style={{
              padding: "8px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>

        {/*Contact Cards with Delete and Split Count */}
        {contacts.map((contact, index) => (
          <div
            key={index}
            style={{
              ...boxStyle,
              backgroundColor: "#f9fff9",
              justifyContent: "space-between",
            }}
          >
            {/*red Delete button */}
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
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              title="Delete Contact"
            >
              Delete
            </button>

            <div>
              <h4 style={{ color: "green" }}>
                {contact.firstName} {contact.lastName}
              </h4>
            </div>
            <div style={{ color: "gray", fontSize: "0.9rem" }}>
              Splits: {contact.splitCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;

