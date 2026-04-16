import React from "react";
import { useNavigate } from "react-router-dom";

interface SkillsetButtonProps {
  employeeId: string | number;
  employeeName?: string;
  isManager?: boolean;
}

const SkillsetButton: React.FC<SkillsetButtonProps> = ({
  isManager = false,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("skillset/home")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 22px",
        background: "linear-gradient(135deg, #001d3d, #003566)",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,53,102,0.3)",
      }}
    >
      <span style={{ fontSize: "15px" }}>🎯</span>
      {isManager ? "View Skillset" : "My Skillset"}
    </button>
  );
};

export default SkillsetButton;