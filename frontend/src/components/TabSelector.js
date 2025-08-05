import React from "react";

const TabSelector = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: "center" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: "10px 24px",
            fontSize: 16,
            borderRadius: 8,
            border: activeTab === tab.key ? "2px solid #3498db" : "1.5px solid #bdc3c7",
            background: activeTab === tab.key ? "#eaf6fb" : "white",
            color: "#2c3e50",
            fontWeight: activeTab === tab.key ? 700 : 500,
            cursor: "pointer",
            boxShadow: activeTab === tab.key ? "0 2px 8px #3498dbaa" : "none",
            transition: "all 0.2s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
