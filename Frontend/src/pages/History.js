import React from "react";

const History = () => {
  const initiatedSplits = [
    { title: "Spammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", date: "2025-04-15", initiator: "You", partner: "Alice", amount: 80, method: "%", value: 40, status: "Accepted" },
    { title: "Uber", date: "2025-04-14", initiator: "You", partner: "Bob", amount: 30, method: "$", value: 12, status: "Declined" },
    { title: "Movie Tickets", date: "2025-04-13", initiator: "You", partner: "Charlie", amount: 50, method: "$", value: 25, status: "Accepted" },
    { title: "Gas", date: "2025-04-12", initiator: "You", partner: "Dana", amount: 40, method: "%", value: 50, status: "Accepted" },
    { title: "Concert", date: "2025-04-11", initiator: "You", partner: "Eve", amount: 120, method: "$", value: 60, status: "Declined" },
    { title: "Concert", date: "2025-04-11", initiator: "You", partner: "Eve", amount: 120, method: "$", value: 60, status: "Declined" },
    { title: "Concert", date: "2025-04-11", initiator: "You", partner: "Eve", amount: 120, method: "$", value: 60, status: "Declined" },
  ];

  const receivedSplits = [
    { title: "Groceries", date: "2025-04-13", initiator: "Charlie", partner: "You", amount: 60, method: "%", value: 25, status: "Accepted" },
    { title: "Hotel", date: "2025-04-12", initiator: "Dana", partner: "You", amount: 200, method: "$", value: 100, status: "Accepted" },
    { title: "Flight", date: "2025-04-11", initiator: "Alice", partner: "You", amount: 300, method: "%", value: 50, status: "Declined" },
    { title: "Lunch", date: "2025-04-10", initiator: "Bob", partner: "You", amount: 25, method: "$", value: 10, status: "Accepted" },
    { title: "Museum Tickets", date: "2025-04-09", initiator: "Eve", partner: "You", amount: 40, method: "%", value: 30, status: "Accepted" },
    { title: "Museum Tickets", date: "2025-04-09", initiator: "Eve", partner: "You", amount: 40, method: "%", value: 30, status: "Accepted" },
    { title: "Museum Tickets", date: "2025-04-09", initiator: "Eve", partner: "You", amount: 40, method: "%", value: 30, status: "Accepted" },
  ];

  const getStatusStyle = (status) => ({
    color: status === "Accepted" ? "lightgreen" : "salmon",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textShadow: "1px 1px 3px black"
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
    overflowWrap: "break-word"
  };

  const renderSplitCard = (split, isInitiated) => {
    const partnerPaid = split.method === "%"
      ? (split.amount * (100 - split.value)) / 100
      : split.amount - split.value;
    const youPaid = split.amount - partnerPaid;


   
    return (
      <div style={{ ...cardStyle}} key={`${split.title}-${split.date}-${split.initiator}`}>
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
          gap: "10px"
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.9rem", color: "#cfc", textShadow: "none" }}>
              {new Date(split.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </div>
            <div><strong>Requested Amount:</strong> ${split.amount}</div>
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

  return (
    <div style={{
      marginTop: "10vh",
      diplay: "flex",
      //padding: "20px",
      height: "90vh",
      backgroundImage: 'url("/triangle.png")',
      backgroundSize: "contain",
      backgroundPosition: 'center',

      backgroundRepeat: "repeat",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        gap: "80px",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        {/* Initiated Splits Section */}
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "450px" }}>
          <h2 style={{ color: "white", textAlign: "center", textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
            Initiated Splits
          </h2>
          <div style={{
            height: "80vh",
            overflow: "auto",
            padding: "0 5px", // Optional spacing inside
          }}>
            {initiatedSplits.map((split) => renderSplitCard(split, true))}
          </div>
        </div>

        {/* Received Splits Section */}
        <div style={{ flex: "1", minWidth: "300px", maxWidth: "450px" }}>
          <h2 style={{ color: "white", textAlign: "center", textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}>
            Received Splits
          </h2>
          <div style={{
            height: "80vh",
            overflow: "auto",
            padding: "0 5px",
          }}>
            {receivedSplits.map((split) => renderSplitCard(split, false))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
