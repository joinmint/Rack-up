import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactComponent as ReactLogo } from "../../Assets/Theme/rackup_white.svg";
import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
function CustomAppBar({ drawerWidth }) {
  //const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  //const { user } = useAuth0();
  const location = useLocation();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <ReactLogo width={200} height={30} />

        <IconButton
          onClick={() =>
            logout({ returnTo: process.env.REACT_APP_AUTH0_CALLBACK_URL })
          }
          style={{ color: "#fff" }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;

/*
{isAuthenticated && (
          <React.Fragment>
            Welcome, {user.name}!
            <Button
              onClick={() => logout({ returnTo: window.location.origin })}
              color="inherit"
            >
              Logout
            </Button>
          </React.Fragment>
        )}
*/
