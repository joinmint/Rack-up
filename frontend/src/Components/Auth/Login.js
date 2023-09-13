import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../Loading/Loading";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import SavingsIcon from "@mui/icons-material/Savings";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import StoreIcon from "@mui/icons-material/Store";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
function Login() {
  const { user } = useAuth0();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "80%",
      }}
    >
      <Paper sx={{ textAlign: "center", width: "100%", marginTop: 10 }}>
        <Box>Test</Box>
      </Paper>
    </Box>
  );
}

export default Login;
