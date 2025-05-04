import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Dashboard = () => {
  
  // Remove later
  const [inputId, setInputId] = useState('');
  // Remove Later
  const setCurrentId = () => {
    if (inputId.trim()) {
      localStorage.setItem('currentId', inputId);
      setInputId('');
    } else {
      alert('Please enter a valid user ID.');
    }
  };
  // Remove later
  const removeCurrentId = () => {
    localStorage.setItem('currentId', '');
    setInputId('');
  };

  // Id of currently logged in user
  const getCurrentId = () => {
    return localStorage.getItem('currentId');
  };
  const currentId = getCurrentId();

  const [showForm, setShowForm] = useState(false);
  const [expense, setExpense] = useState({
    title: "",
    cost: "",
    date: "",
    time: "",
    partner: "",
    partnerId: 0,
    method: "%",
    value: "50", // default value for percentage
    approvalStatus: "pending",
  });
  const [splitResult, setSplitResult] = useState({ you: 0, partner: 0 });
  const [recentSplits, setRecentSplits] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Function to handle the split calculation based on method and values
  const handleSplitCalculation = useCallback(() => {
    const cost = parseFloat(expense.cost);
    const val = parseFloat(expense.value);

    if (expense.method === "%") {
      // Calculate the share based on percentage
      const partnerShare = (cost * val) / 100;
      const youShare = cost - partnerShare; // You pay the remaining amount
      setSplitResult({ partner: partnerShare, you: youShare });
    } else {
      // Calculate the split based on dollar amount
      const partnerShare = val;
      const youShare = cost - partnerShare;
      setSplitResult({ partner: partnerShare, you: youShare });
    }
  }, [expense.cost, expense.method, expense.value]);

  // Function to handle change in any input field
  const handleChange = (field, value) => {
    setExpense(prevExpense => ({
      ...prevExpense,
      [field]: value
    }));
  };
  

  // Effect hook to recalculate the split whenever cost, value, or method changes
  useEffect(() => {
    if (expense.cost && expense.value) {
      handleSplitCalculation(); // Recalculate the split every time the cost or value changes
    }
  }, [expense.cost, expense.value, expense.method, handleSplitCalculation]); // Depend on cost, value, and method changes

  // Effect hook to get contacts for current account
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/contacts?account_id=${currentId}`)
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  }, [currentId]);

  // Function to handle form submission
  const handleSubmit = () => {
    handleSplitCalculation();
    setRecentSplits([
      {
        ...expense,
        splitResult: { ...splitResult },
      },
      ...recentSplits,
    ]);
    setShowForm(false);
    submitExpense(expense.title, expense.cost, `${expense.date} ${expense.time.slice(0, -3)}`, expense.partnerId, splitResult.partner);
    setExpense({
      title: "",
      cost: "",
      date: "",
      time: "",
      partner: "",
      partnerId: "",
      approvalStatus: "pending",
      method: "%",
      value: "50"})
  };

  // Disable submit button if not all required fields are filled out
  const isSubmitDisabled = () => {
    const cost = parseFloat(expense.cost);
    const value = parseFloat(expense.value);

    if (expense.method === "%") {
      return (
        !expense.title ||
        !expense.cost ||
        expense.cost <= 0 ||
        !expense.partner ||
        !expense.value ||
        value > 100 || // Disable if percentage is above 100
        value <= 0 || // or if percentage is 0 or less
        isNaN(value)
      );
    } else {
      return (
        !expense.title ||
        !expense.cost ||
        expense.cost <= 0 ||
        !expense.partner ||
        !expense.value ||
        value > cost || // Disable if dollar amount exceeds the cost
        value <= 0 || // or if value is 0 or less
        isNaN(value)
      );
    }
  };

  // Function to handle cancel and hide the form
  const handleCancel = () => {
    setShowForm(false); // Hide the form
    setExpense({
      title: "",
      cost: "",
      date: "",
      time: "",
      partner: "",
      partnerId: "",
      method: "%",
      value: "50", // reset default value
    }); // Reset the expense state
  };
  
  const [requests, setRequests] = useState([]);
  const [modalData, setModalData] = useState(null);

  // Fetch all expenses owned by a single account
  const fetchExpenses = useCallback(async () => {
    
    try {
      const response = await axios.get(`http://localhost:8080/api/expenses?account_id=${currentId}`);
      const data = response.data;
  
      const parsedExpenses = data.map((exp) => {
        const partnerShare = exp.partner_share ?? 0;
        const youShare = exp.you_share ?? 0;
  
        return {
          title: exp.expense_title,
          cost: exp.expense_amount.toString(),
          date: exp.expense_date_time.split("T")[0],
          time: new Date(exp.expense_date_time).toLocaleTimeString("en-US", { hour12: true }),
          partner: exp.partner_name,
          method: "%",
          value: exp.partner_percentage?.toString(),
          approvalStatus: exp.member_approval_status === null ? "pending" : exp.member_approval_status === 1 ? "accept" : "decline",
          splitResult: {
            partner: partnerShare,
            you: youShare,
          },
        };
      });
  
      setRecentSplits(parsedExpenses);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  }, [currentId]);

  // Fetch all requests toward a single account
  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/requests/pending?account_id=${currentId}`);
      const data = response.data;
  
      const parsedRequests = data.map((req) => {
        return {
          id: req.split_id,
          title: req.expense_title,
          partner: `${req.first_name} ${req.last_name}`,
          cost: req.expense_amount.toFixed(2),
          value: req.split_amount.toFixed(2),
          date: req.expense_date_time.split("T")[0],
          time: new Date(req.expense_date_time).toLocaleTimeString("en-US", { hour12: true }),
          status: req.member_approval_status === null ? "pending" : req.member_approval_status ? "accepted" : "decline"
        };
      });
  
      setRequests(parsedRequests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  }, [currentId]);
  
  useEffect(() => {
    fetchRequests();
    fetchExpenses();
  }, [fetchRequests, fetchExpenses]);
  
  // Submit a single expense
  const submitExpense = async (expenseTitle, expenseAmount, expenseDateTime, contactId, splitAmount) => {
    const newExpense = {
      account_id: getCurrentId(),
      expense_title: expenseTitle,
      expense_amount: expenseAmount,
      expense_date_time: expenseDateTime
    };
  
    try {
      // Create the expense/split
      const expenseResponse = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });
  
      const expenseData = await expenseResponse.json();
      console.log('Expense created:', expenseData);
  
      const { split_id } = expenseData;
  
      if (!split_id) {
        throw new Error('No split_id returned from expense creation');
      }
  
      // Add the contact as a split member
      await fetch('http://localhost:8080/api/splitmember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          split_id,
          account_id: contactId,
          split_amount: splitAmount,
        }),
      });

    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  // Accept or decline a split
  const updateSplit = (splitId, approvalStatus) => {
      axios.put('http://localhost:8080/api/splitmember', {
        split_id: splitId,
        account_id: currentId,
        member_approval_status: approvalStatus,
      });
    }

  const confirmResponse = () => {
    if (modalData) {
      setRequests(prev =>
        prev.map(req =>
          req.id === modalData.id ? { ...req, status: modalData.responseType } : req
        )
      );
      updateSplit(modalData.id, modalData.responseType === "accept" ? true : false);
      setModalData(null);
    }
  };

  const cancelResponse = () => {
    setModalData(null);
  };

  const openModal = (id, responseType) => {
    setModalData({ id, responseType });
  };

  // --------------------------------------------------
  // HTML/CSS code
  // --------------------------------------------------
  return (
    <div style={{ display: "flex",
    height: "90vh",
    marginTop: "10vh",
    textAlign: "center",
    backgroundImage: 'url("/triangle.png")',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',}}>
      <div style={{ flex: 1.618, padding: '1rem', overflow: "auto" }}>

      {/*Remove later*/}
      <div style={{ padding: '10px' }}><input
        type="text"
        placeholder="Enter User ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        style={{ marginRight: '8px' }}
      />
      <button onClick={setCurrentId}>Set User ID</button></div>

        <h1 style={{ color: "white",  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Recent Expenses</h1>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel(); // If in form mode, cancel and reset
            } else {
              const now = new Date();
              setExpense((prev) => ({
                ...prev,
                date: now.toISOString().slice(0, 10),
                time: now.toLocaleTimeString("en-US", { hour12: true }),
              }));
              setShowForm(true); // Show form
            }
          }}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1.2rem",
            backgroundColor: showForm ? "red" : "rgb(0, 128, 0)", // Change button color for cancel
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 6px rgba(0,70,0,0.6)",
          }}
        >
          {showForm ? "Cancel" : "+ Create new expense"} {/* Change button text */}
        </button>

        {showForm && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "rgba(0,128,0,0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "40px",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 4px 8px rgba(0,70,0,0.8)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}>
            <div style={{ textAlign: "left" }}>
              <div>
                <strong>Title:</strong>
                <input
                  type="text"
                  value={expense.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  style={{ width: "100%", padding: "5px", marginTop: "5px", borderRadius: "30px" }}
                />
              </div>
              <div>
                <strong>Cost:</strong>
                <input
                  type="number"
                  value={expense.cost}
                  onChange={(e) => handleChange("cost", e.target.value)}
                  style={{ width: "100%", padding: "5px", marginTop: "5px", borderRadius: "30px" }}
                />
              </div>
              <div>
                <strong>Date:</strong> {expense.date}
              </div>
              <div>
                <strong>Time:</strong> {expense.time}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div><strong>{expense.partner}</strong></div>
              <div>{expense.method === "%" ? `${expense.value || 0}%` : ""}</div>
              <div>{expense.method === "%" ? `$${(expense.cost * (expense.value / 100)).toFixed(2)}` : `$${expense.value}`}</div>
              <br />
              <div><strong>You</strong></div>
              <div>{expense.method === "%" ? `${100 - (parseFloat(expense.value) || 0)}%` : ""}</div>
              <div>{expense.method === "%" ? `$${(expense.cost * (1 - expense.value / 100)).toFixed(2)}` : `$${(expense.cost - expense.value).toFixed(2)}`}</div>
            </div>
          </div>

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label>Split with:</label>
            <select
  value={expense.partnerId} // use partnerId to keep it consistent
  onChange={(e) => {
    const selectedContact = contacts.find(
      (contact) => contact.account_id.toString() === e.target.value
    );
    if (selectedContact) {
      handleChange("partner", `${selectedContact.first_name} ${selectedContact.last_name}`);
      handleChange("partnerId", selectedContact.account_id);
    }
  }}
  style={{ width: "100%", padding: "5px", marginTop: "5px", borderRadius: "30px" }}
>
  <option value="">Select Partner</option>
  {contacts.map((contact) => (
    <option key={contact.account_id} value={contact.account_id}>
      {contact.first_name} {contact.last_name}
    </option>
  ))}
</select>


            <label style={{ marginTop: "10px", display: "block" }}>
              {expense.partner} will pay:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                value={expense.method}
                onChange={(e) => handleChange("method", e.target.value)}
                style={{ width: "60px", padding: "5px", borderRadius: "30px" }}
              >
                <option value="%">%</option>
                <option value="$">$</option>
              </select>
              <input
                type="number"
                value={expense.value}
                onChange={(e) => handleChange("value", e.target.value)}
                style={{ width: "100%", padding: "5px", borderRadius: "30px" }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            style={{
              margin: "20px auto",
              marginBottom: "0px",
              display: "block",
              backgroundColor: "#4caf50",
              color: "white",
              padding: "10px 20px",
              borderRadius: "30px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: isSubmitDisabled() ? "not-allowed" : "pointer",
            }}
          >
            SUBMIT SPLIT
          </button>
        </div>
      )}

        {recentSplits.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <ul style={{ listStyleType: "none", padding: "0" }}>
              {recentSplits.map((split, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "rgba(0,128,0,0.8)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "30px",
                    width: "400px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 4px 8px rgba(0,70,0,0.8)",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)" }}>
                    <div style={{ textAlign: "left" }}>
                      <div>
                        <strong>Title:</strong> {split.title}
                      </div>
                      <div>
                        <strong>Cost:</strong> ${split.cost}
                      </div>
                      <div>
                        <strong>Date:</strong> {split.date}
                      </div>
                      <div>
                        <strong>Time:</strong> {split.time}
                      </div>
                      <span>{split.approvalStatus === "pending" ? "🟡 Pending" : split.approvalStatus === "accept" ? "✅ Accepted": "❌ Declined"}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div><strong>{split.partner}</strong></div>
                      <div>{split.method === "%" ? `${split.value || 0}%` : ""}</div>
                      <div>${split.splitResult.partner.toFixed(2)}</div>
                      <br />
                      <div><strong>You</strong></div>
                      <div>{split.method === "%" ? `${100 - (parseFloat(split.value) || 0)}%` : ""}</div>
                      <div>${split.splitResult.you.toFixed(2)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Requests section */}
      <div style={{ flex: 1, padding: '1rem', backgroundColor: "rgba(0,128,0,0.8)", boxShadow: '0 2px 8px rgba(0,0,0,0.8)',overflow: 'auto' }}>
        <h1 style={{ color: '#fff',  textShadow: "2px 2px 4px rgba(0, 80, 0, 0.8)"  }}>Recent Requests</h1>

        {requests.map(req => (
          <div
            key={req.id}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: '30px',
              padding: '1rem',
              marginTop: '1rem',
              boxShadow: '0 2px 5px rgba(0,70,0,0.8)',
              color: "white",
              textShadow: "2px 2px 4px rgba(0, 60, 0, 0.6)"
            }}
          >
            <h2 style={{margin: 0}}>{req.title}</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '0.5rem',
              gap: '2rem'
            }}>
              {/* Left column */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p><strong>Requested by:</strong> {req.partner}</p>
                <p><strong>Date:</strong> {req.date} at {req.time}</p>
              </div>

              {/* Right column */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p><strong>Total cost:</strong> ${req.cost}</p>
                <p><strong>Requested of you:</strong> ${req.value}</p>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              {req.status === 'pending' ? (
                <>
                  <button
                    style={{ marginRight: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '30px',
                      boxShadow: '0 2px 5px rgba(0,70,0,0.8)',
                      cursor: "pointer" }}
                    onClick={() => openModal(req.id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    style={{ padding: '0.5rem 1rem',
                      backgroundColor: '#e53935',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '30px',
                      boxShadow: '0 2px 5px rgba(0,70,0,0.8)',
                      cursor: "pointer" }}
                    onClick={() => openModal(req.id, 'decline')}
                  >
                    Decline
                  </button>
                </>
              ) : (
                <span
                  style={{
                    backgroundColor: req.status === 'accept' ? '#4caf50' : 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '30px',
                    display: 'inline-block',
                  }}
                >
                  {req.status === 'accept' ? 'ACCEPTED' : 'DECLINED'}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Confirmation modal */}
        {modalData && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              <h2>Confirm {modalData.responseType === 'accept' ? 'Acceptance' : 'Decline'}</h2>
              <p>Are you sure you want to
              <span style={{ color: modalData.responseType === 'accept' ? 'green' : 'red', fontWeight: "bold" }}> {modalData.responseType.toUpperCase()} </span>
              this request?</p>
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={confirmResponse}
                  style={{
                    marginRight: '1rem',
                    padding: '0.5rem 1.2rem',
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: "pointer"
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={cancelResponse}
                  style={{
                    padding: '0.5rem 1.2rem',
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px'
                    ,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
