import React, { useState, useEffect } from "react";

const Expenses = () => {
  const [showForm, setShowForm] = useState(false);
  const [expense, setExpense] = useState({
    title: "",
    cost: "",
    date: "",
    time: "",
    partner: "Firstname Lastname",
    method: "%",
    value: "40", // default value for percentage
  });
  const [splitResult, setSplitResult] = useState({ you: 0, partner: 0 });
  const [recentSplits, setRecentSplits] = useState([]);

  // Function to handle the split calculation based on method and values
  const handleSplitCalculation = () => {
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
  };

  // Function to handle change in any input field
  const handleChange = (field, value) => {
    setExpense({ ...expense, [field]: value });
  };

  // Effect hook to recalculate the split whenever cost, value, or method changes
  useEffect(() => {
    if (expense.cost && expense.value) {
      handleSplitCalculation(); // Recalculate the split every time the cost or value changes
    }
  }, [expense.cost, expense.value, expense.method]); // Depend on cost, value, and method changes

  // Function to handle form submission
  const handleSubmit = () => {
    handleSplitCalculation();
    setRecentSplits([
      ...recentSplits,
      {
        ...expense,
        splitResult: { ...splitResult },
      },
    ]);
    setShowForm(false);
  };

  // Disable submit button if not all required fields are filled out
  const isSubmitDisabled = () => {
    const cost = parseFloat(expense.cost);
    const value = parseFloat(expense.value);

    if (expense.method === "%") {
      return (
        !expense.title ||
        !expense.cost ||
        !expense.partner ||
        !expense.value ||
        value > 100 || // Disable if percentage is above 100
        isNaN(value)
      );
    } else {
      return (
        !expense.title ||
        !expense.cost ||
        !expense.partner ||
        !expense.value ||
        value > cost || // Disable if dollar amount exceeds the cost
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
      partner: "Firstname Lastname",
      method: "%",
      value: "40", // reset default value
    }); // Reset the expense state
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ color: "rgb(0, 128, 0)" }}>Recent Expenses</h1>
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
          borderRadius: "5px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
      >
        {showForm ? "Cancel" : "+ Create new expense"} {/* Change button text */}
      </button>

      {showForm && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#66bb6a",
            color: "white",
            padding: "20px",
            borderRadius: "20px",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "left" }}>
              <div>
                <strong>Title:</strong>
                <input
                  type="text"
                  value={expense.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div>
                <strong>Cost:</strong>
                <input
                  type="number"
                  value={expense.cost}
                  onChange={(e) => handleChange("cost", e.target.value)}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
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
              <div>{expense.method === "%" ? `${expense.value || 0}%` : `$${expense.value || 0}`}</div>
              <div>${splitResult.partner.toFixed(2)}</div>
              <br />
              <div><strong>You</strong></div>
              <div>{expense.method === "%" ? `${100 - (parseFloat(expense.value) || 0)}%` : ""}</div>
              <div>${splitResult.you.toFixed(2)}</div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            style={{
              margin: "20px auto",
              display: "block",
              backgroundColor: "#006400",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: isSubmitDisabled() ? "not-allowed" : "pointer",
            }}
          >
            SUBMIT SPLIT
          </button>

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label>Split with:</label>
            <select
              value={expense.partner}
              onChange={(e) => handleChange("partner", e.target.value)}
              style={{ width: "100%", padding: "5px", marginTop: "5px" }}
            >
              <option>Firstname Lastname</option>
              <option>Jane Smith</option>
            </select>

            <label style={{ marginTop: "10px", display: "block" }}>
              {expense.partner} will pay:
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                value={expense.method}
                onChange={(e) => handleChange("method", e.target.value)}
                style={{ width: "60px", padding: "5px" }}
              >
                <option value="%">%</option>
                <option value="$">$</option>
              </select>
              <input
                type="number"
                value={expense.value}
                onChange={(e) => handleChange("value", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
          </div>
        </div>
      )}

      {recentSplits.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {recentSplits.map((split, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#66bb6a",
                  color: "white",
                  padding: "20px",
                  borderRadius: "20px",
                  width: "400px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div><strong>{split.partner}</strong></div>
                    <div>{split.method === "%" ? `${split.value || 0}%` : `$${split.value || 0}`}</div>
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
  );
};

export default Expenses;
