import React from "react";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface MyFABProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const MyFloatingActionButton: React.FC<MyFABProps> = ({ 
  onClick, 
  icon = <AddIcon />, 
  label = "Add",
  color = "primary" 
}) => {
  return (
    <Tooltip title={label} placement="left" arrow>
      <Fab
        color={color}
        aria-label={label.toLowerCase()}
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 32, // Slightly more spacing for better touch targets
          right: 32,
          // Added a nice hover lift effect
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
          // Ensure it stays above your Topbar and Sidebar
          zIndex: 100, 
        }}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
};

export default MyFloatingActionButton;