import React, { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  // Id of currently logged in user
  const getCurrentId = () => {
    return localStorage.getItem('currentId');
  };
  const currentId = getCurrentId();

  const [initiatedSplits, setInitiatedSplits] = useState([]);
  const [receivedSplits, setReceivedSplits] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Fetch splits initiated by this user
    axios
      .get("http://localhost:8080/api/expenses/notpending", { params: { account_id: currentId } })
      .then((res) => {
        const formatted = res.data.map((item) => ({
          title: item.expense_title,
          date: item.expense_date_time,
          initiator: "You",
          partner: item.partner_name,
          amount: item.expense_amount,
          method: "$",
          value: item.you_share,          // how much you paid
          status: item.member_approval_status === 1 ? "Accepted" : "Declined",
        }));
        setInitiatedSplits(formatted);
      })
      .catch((err) => console.error("Error fetching initiated splits:", err));

    //Fetch splits received by this user (as member)
    axios
      .get("http://localhost:8080/api/requests/notpending", { params: { account_id: currentId } })
      .then((res) => {
        const formatted = res.data.map((item) => ({
          title: item.expense_title,
          date: item.expense_date_time,
          initiator: `${item.first_name} ${item.last_name}`,
          partner: "You",
          amount: item.expense_amount,
          method: "$",
          value: item.split_amount,       
          status: item.member_approval_status === 1 ? "Accepted" : "Declined",
        }));
        setReceivedSplits(formatted);
      })
      .catch((err) => console.error("Error fetching received splits:", err));
  }, [currentId]);

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

  const getStatusStyle = (status) => ({
    color: status === "Accepted" ? "lightgreen" : "salmon",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textShadow: "1px 1px 3px black",
  });

  const cardStyle = {
    backgroundColor: "rgba(0,128,0,0.8)",
    borderRadius: "40px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 4px 8px rgba(0, 70, 0, 0.8)",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
    wordWrap: "break-word",
    border: "2px solid white",  //white border around data boxes
  };

  const renderSplitCard = (split, isInitiated) => {
    const partnerPaid = split.method === "%"
      ? (split.amount * (100 - split.value)) / 100
      : split.amount - split.value;
    const youPaid = split.amount - partnerPaid;

    return (
      <div style={cardStyle} key={`${split.title}-${split.date}-${split.initiator}`}>        
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <span style={getStatusStyle(split.status)}>
            {split.status === "Accepted" ? "✅ Accepted" : "❌ Declined"}
          </span>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Description:</strong> {split.title}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.9rem", color: "#cfc", textShadow: "none" }}>
              {new Date(split.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </div>
            <div><strong>Amount:</strong> ${split.amount}</div>
            <div><strong>Initiator:</strong> {split.initiator}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div><strong>You Paid:</strong> ${youPaid.toFixed(2)}</div>
            <div>
              <strong>{isInitiated ? split.partner : split.initiator} Paid:</strong> ${partnerPaid.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const backgroundImage = darkMode ? 'url("/triangle_dark.png")' : 'url("/triangle.png")';

  return (
    <div style={{
      marginTop: "10vh",
      display: "flex",
      gap: "80px",
      justifyContent: "center",
      height: "90vh",
      backgroundImage: backgroundImage,
      backgroundSize: "contain",
      backgroundPosition: 'center',
      backgroundRepeat: "repeat",
      overflow: "hidden",
      padding: "0 40px",//0 40 fixed extra page scroll wheel
    }}>
      <div style={{ flex: 1, minWidth: "100px", maxWidth: "450px" }}>
        <h2 style={{ color: "white", textAlign: "center", textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
          Initiated Splits
        </h2>
        <div style={{ height: "80vh", overflow: "auto", padding: "0 5px" }}>
          {initiatedSplits.map((split) => renderSplitCard(split, true))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: "100px", maxWidth: "450px" }}>
        <h2 style={{ color: "white", textAlign: "center", textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
          Received Splits
        </h2>
        <div style={{ height: "80vh", overflow: "auto", padding: "0 5px" }}>
          {receivedSplits.map((split) => renderSplitCard(split, false))}
        </div>
      </div>
    </div>
  );
};

export default History;

