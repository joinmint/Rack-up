import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Members from "./Components/Members/Members";
import Redeemers from "./Components/Redeemers/Redeemers";
import Generators from "./Components/Generators/Generators";
import Partners from "./Components/Partners/Partners";
import Login from "./Components/Auth/Login";
import Reports from "./Components/Reports/Reports";
import CustomAppBar from "./Components/Layout/CustomAppBar";
import CustomDrawer from "./Components/Layout/CustomDrawer";
import Box from "@mui/material/Box";

import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 200;

function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <CustomAppBar drawerWidth={drawerWidth} />
      <CustomDrawer drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/members" element={<Members />} />
          <Route path="/generators" element={<Generators />} />
          <Route path="/redeemers" element={<Redeemers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
