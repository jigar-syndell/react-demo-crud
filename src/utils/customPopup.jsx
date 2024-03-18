import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CustomPopup = ({ type, message }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {open && (
        <Alert
          severity={type}
          sx={{
            backgroundColor: "white",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          }}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />,
            error: <ErrorOutlineIcon fontSize="inherit" />,
          }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default CustomPopup;
