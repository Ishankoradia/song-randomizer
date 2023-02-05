import React from "react";
import { Box, Snackbar, Alert, Typography } from "@mui/material";

const ToastMessage = ({
  open,
  seconds,
  message,
  messages,
  handleClose,
  severity,
}) => {
  const handleCloseButton = () => {
    handleClose();
  };

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={seconds * 1000}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseButton}
      >
        {message.length <= 0 ? (
          <Alert onClose={handleCloseButton} severity={severity}>
            {messages.map((message, idx) => (
              <Typography key={idx}>{message.message}</Typography>
            ))}
          </Alert>
        ) : (
          <Alert onClose={handleCloseButton} severity={severity}>
            {message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default ToastMessage;
