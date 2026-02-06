import React from "react";
import { Fab, Tooltip, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FaBolt } from "react-icons/fa";

interface MyFABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  title?: string; // The text shown on the button
  tooltipLabel?: string; // Label for the hover tooltip
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const MyFloatingActionButton: React.FC<MyFABProps> = ({
  onClick,
  icon = <FaBolt className="mr-2" />, // Default icon with margin-right
  title, // Optional title
  tooltipLabel = "New Action",
  color = "primary",
}) => {
  return (
    <Tooltip 
      title={tooltipLabel} 
      placement="left" 
      arrow 
      TransitionComponent={Zoom}
    >
      <Fab
        variant={title ? "extended" : "circular"} // If title exists, use pill shape
        color={color}
        aria-label={title || tooltipLabel}
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          // Customizing colors to match your reference image (Indigo/Violet)
          backgroundColor: "#6366f1", 
          textTransform: "none", // Keeps text from being all caps
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.025em",
          px: title ? 3 : 0, // Extra padding if text is present
          boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#4f46e5",
            transform: "scale(1.05) translateY(-2px)",
            boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4)",
          },
        }}
      >
        {icon}
        {title}
      </Fab>
    </Tooltip>
  );
};

export default MyFloatingActionButton;