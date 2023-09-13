import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import SavingsIcon from "@mui/icons-material/Savings";
import StoreIcon from "@mui/icons-material/Store";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Drawer from "@mui/material/Drawer";
import { useNavigate, useLocation } from "react-router-dom";

function CustomDrawer({ drawerWidth }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          key={"Home"}
          onClick={() => {
            navigate("/");
          }}
          disablePadding
          classes={{ selected: "your selected className" }}
          selected={location.pathname === "/"}
        >
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Members"}
          onClick={() => {
            navigate("/members");
          }}
          selected={location.pathname === "/members"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={"Members"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Generators"}
          onClick={() => {
            navigate("/generators");
          }}
          selected={location.pathname === "/generators"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <SavingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Generators"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Redeemers"}
          onClick={() => {
            navigate("/redeemers");
          }}
          selected={location.pathname === "/redeemers"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary={"Redeemers"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Partners"}
          onClick={() => {
            navigate("/partners");
          }}
          selected={location.pathname === "/partners"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <HandshakeIcon />
            </ListItemIcon>
            <ListItemText primary={"Partners"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Reports"}
          onClick={() => {
            navigate("/reports");
          }}
          selected={location.pathname === "/reports"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary={"Reports"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={"Integrations"}
          onClick={() => {
            navigate("/integrations");
          }}
          selected={location.pathname === "/integrations"}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <SettingsInputComponentIcon />
            </ListItemIcon>
            <ListItemText primary={"Integrations"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default CustomDrawer;
