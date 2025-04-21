import React from "react";

const History = () => {
  const initiatedSplits = [
    {
      title: "Dinner",
      date: "2025-04-15",
      initiator: "You",
      partner: "Alice",
      amount: 80,
      method: "%",
      value: 40,
      status: "Accepted",
    },
    {
      title: "Uber",
      date: "2025-04-14",
      initiator: "You",
      partner: "Bob",
      amount: 30,
      method: "$",
      value: 12,
      status: "Declined",
    },
  ];

  const receivedSplits = [
    {
      title: "Groceries",
      date: "2025-04-13",
      initiator: "Charlie",
      partner: "You",
      amount: 60,
      method: "%",
      value: 25,
      status: "Accepted",
    },
    {
      title: "Hotel",
      date: "2025-04-12",
      initiator: "Dana",
      partner: "You",
      amount: 200,
      method: "$",
      value: 100,
      status: "Accepted",
    },
  ];

  const cardStyle = {
    backgroundColor: "#f0fff0",
    border: "2px solid green",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const getStatusStyle = (status) => ({
    color: status === "Accepted" ? "green" : "red",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  });

  const renderSplitCard = (split, isInitiated) => {
    const partnerPaid =
      split.method === "%"
        ? (split.amount * (100 - split.value)) / 100
        : split.amount - split.value;

    const youPaid = split.amount - partnerPaid;

    return (
      <div style={cardStyle} key={`${split.title}-${split.date}`}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>{split.title}</strong>
          <span style={getStatusStyle(split.status)}>
            {split.status === "Accepted" ? "✅ Accepted" : "❌ Declined"}
          </span>
        </div>

        <div
          style={{
            fontSize: "0.9rem",
            color: "gray",
            marginTop: "4px",
            marginBottom: "8px",
          }}
        >
          {new Date(split.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>

        <div>Initiator: {split.initiator}</div>
        <div>Requested Amount: ${split.amount}</div>
        <div>
          {isInitiated ? (
            <>
              You paid: ${youPaid.toFixed(2)} (
              {split.method === "%"
                ? `${100 - split.value}%`
                : `${((youPaid / split.amount) * 100).toFixed(0)}%`}
              )
              <br />
              {split.partner} paid: ${partnerPaid.toFixed(2)} (
              {split.method === "%"
                ? `${split.value}%`
                : `${((partnerPaid / split.amount) * 100).toFixed(0)}%`}
              )
            </>
          ) : (
            <>
              {split.partner} paid: ${partnerPaid.toFixed(2)} (
              {split.method === "%"
                ? `${100 - split.value}%`
                : `${((partnerPaid / split.amount) * 100).toFixed(0)}%`}
              )
              <br />
              You paid: ${youPaid.toFixed(2)} (
              {split.method === "%"
                ? `${split.value}%`
                : `${((youPaid / split.amount) * 100).toFixed(0)}%`}
              )
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "10vh", padding: "20px", height: "90vh", overflow: "auto" }}>
      <h1 style={{ textAlign: "center", color: "green" }}>Split History</h1>
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Initiated Splits */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "green", textAlign: "center" }}>Initiated Splits</h2>
          {initiatedSplits.map((split) => renderSplitCard(split, true))}
        </div>

        {/* Received Splits */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ color: "green", textAlign: "center" }}>Received Splits</h2>
          {receivedSplits.map((split) => renderSplitCard(split, false))}
        </div>
      </div>
    </div>
  );
};

export default History;
