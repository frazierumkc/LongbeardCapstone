import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Contacts = () => {
  // Id of currently logged in user
  const getCurrentId = () => {
    return localStorage.getItem('currentId');
  };
  const currentId = getCurrentId();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState(""); // contact_id to add
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // for filtering contacts
  const [searchUserId, setSearchUserId] = useState(""); // for finding user to add
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
    
  // If user has not yet logged in
  useEffect(() => {
    const userId = localStorage.getItem('currentId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

  //including email and split count
  const fetchContacts = useCallback(() => {
    axios
      .get("http://localhost:8080/api/contactsinfo", {
        params: { account_id: currentId },
      })
      .then((res) => {
        const formatted = res.data.map((c) => ({
          firstName: c.first_name,
          lastName: c.last_name,
          contactId: c.contact_id,
          email: c.email,             
          splitCount: c.split_count || 0,
        }));
        setContacts(formatted);
      })
      .catch((err) => console.error("Failed to load contacts:", err));
  }, [currentId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

  // Search for a user by ID and prefill name fields
  const handleSearchUser = () => {
    if (!searchUserId) {
      alert("Enter a User ID to search");
      return;
    }
    axios
      .get("http://localhost:8080/api/accounts", {
        params: { account_id: searchUserId },
      })
      .then((res) => {
        if (res.data.length === 0) {
          alert("User not found");
        } else {
          const user = res.data[0];
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setUserId(searchUserId);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        alert("Failed to fetch user data.");
      });
  };

  // Add a new contact
  const handleAddContact = () => {
    if (firstName && lastName && userId) {
      axios
        .post("http://localhost:8080/api/contacts", {
          account_id: currentId,
          contact_id: userId,
          first_name: firstName,
          last_name: lastName,
        })
        .then(() => {
          setFirstName("");
          setLastName("");
          setUserId("");
          setSearchUserId("");
          fetchContacts();
        })
        .catch((err) => {
          console.error("Error adding contact:", err);
          alert("Failed to add contact.");
        });
    } else {
      alert("Please fill in all fields");
    }
  };

  // Delete a contact
  const handleDeleteContact = (contact) => {
    axios
      .delete("http://localhost:8080/api/contacts", {
        params: {
          account_id: currentId,
          contact_id: contact.contactId,
        },
      })
      .then(() => fetchContacts())
      .catch((err) => {
        console.error("Failed to delete contact:", err);
        alert("Could not delete contact.");
      });
  };

  const inputStyle = {
    marginBottom: "5px",
    padding: "5px",
    borderRadius: "10px",
    border: "2px solid rgba(166, 166, 166, 0.6)",
    backgroundColor: "white",
    color: "black",
  };

  const boxStyle = {
    height: "240px",
    borderRadius: "30px",
    padding: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 70, 0, 0.8)",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 60, 0, 0.6)",
    border: "2px solid rgba(166, 166, 166, 0.6)",
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      fullName.includes(term) ||
      contact.contactId.toString().includes(term)
    );
  });

  const backgroundImage = darkMode ? 'url("/triangle_dark.png")' : 'url("/triangle.png")';

  return (
    <div
      style={{
        marginTop: "10vh",
        height: "90vh",
        overflow: "auto",
        backgroundImage: backgroundImage,
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

      {/* Global Search Field */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search contacts by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "10px",
            border: "2px solid white",
            backgroundColor: "rgba(255,255,255,0.8)",
            color: "black",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "10px",
          paddingBottom: "30px",
        }}
      >
        {/* Add Contact Box */}
        <div
          style={{
            ...boxStyle,
            backgroundColor: "rgba(0,128,0,0.6)",
            justifyContent: "flex-start",
            height: "240px" 
          }}
        >
          <h3 style={{ color: "white", marginBottom: "10px" }}>
            + Add New Contact
          </h3>
          {/* Search existing user */}
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Search User ID..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              style={{
                ...inputStyle,
                flexGrow: 1,
                marginRight: "5px",
              }}
            />
            <button
              onClick={handleSearchUser}
              style={{
                padding: "8px 12px",
                backgroundColor: "#129238",
                color: "white",
                border: "none",  
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",      
                width: "35px",       
                height: "28px",       
                display: "flex",     
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0, 70, 0, 0.8)",
              }}
            >
              Find
            </button>
          </div>
          {/* Prefilled or manual entry */}
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
            onChange={e => setUserId(e.target.value)}  
            style={inputStyle}
          />
          <button
            onClick={handleAddContact}
            style={{
              padding: "10px",
              backgroundColor: "#129238",
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
        {filteredContacts.map((contact, index) => (
          <div
            key={index}
            style={{
              ...boxStyle,
              backgroundColor: "rgba(0, 128, 0, 0.8)",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => handleDeleteContact(contact)}
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
              <div style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "0.5rem" }}>
                User ID: {contact.contactId}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "0.5rem" }}>
                Email: {contact.email}
              </div>
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