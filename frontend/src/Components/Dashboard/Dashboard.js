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
function Dashboard() {
  const { user } = useAuth0();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "50%" }}>
            <Typography sx={{ fontSize: 30, color: "green" }}>
              Welcome to the Rakup Management Portal!
            </Typography>
            <Typography sx={{ fontSize: 15, marginTop: 2 }}>
              This portal allows you to manage the members in your orginzation,
              manage Generators so your users can gain points, and manage
              Redeemers so your members can reap the benefits of their good
              behavior!
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Box
            onClick={() => {
              navigate("/members");
            }}
            sx={{
              cursor: "pointer",
              padding: 2,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "5%",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <Typography sx={{ fontSize: 20, color: "#fff" }}>
              Manage Members
            </Typography>
            <GroupsIcon style={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              padding: 2,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "5%",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              navigate("/generators");
            }}
          >
            <Typography sx={{ fontSize: 20, color: "#fff" }}>
              Manage Generators
            </Typography>
            <SavingsIcon style={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              padding: 2,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "5%",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              navigate("/redeemers");
            }}
          >
            <Typography sx={{ fontSize: 20, color: "#fff" }}>
              Manage Redeemers
            </Typography>
            <StoreIcon style={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              padding: 2,
              backgroundColor: theme.palette.primary.main,
              borderRadius: "5%",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={() => {
              navigate("/partners");
            }}
          >
            <Typography sx={{ fontSize: 20, color: "#fff" }}>
              Manage Partners
            </Typography>
            <HandshakeIcon style={{ fontSize: 40, color: "#fff" }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default withAuthenticationRequired(Dashboard, {
  onRedirecting: () => <Loading />,
});
