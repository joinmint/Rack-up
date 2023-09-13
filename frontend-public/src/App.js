import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import LookupMember from "./Components/Lookup/LookupMember";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSearchParams } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [inError, setInError] = useState(false);
  const [noCode, setNoCode] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const memberID = searchParams.get("memberID");
    if (memberID) {
      getMemberData(memberID);
    } else {
      setNoCode(true);
      setIsLoading(false);
    }
  }, []);

  const getMemberData = async (memberID) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/get-member-info/" +
          memberID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw Error("Error getting member");
      let member = await response.json();

      if (member) setMember(member);
      else setInError(true);
      setIsLoading(false);
    } catch (e) {
      setInError(true);
      setIsLoading(false);
      //Redirect to member lookup page?
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {!isLoading && !inError && !noCode && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "95vh",
            width: "95vw",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard member={member} />} />
          </Routes>
        </Box>
      )}
      {!isLoading && inError && !noCode && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "95vh",
            width: "95vw",
          }}
        >
          <Box sx={{ textAlign: "center" }}>Member not found</Box>
        </Box>
      )}
      {!isLoading && !inError && noCode && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "95vh",
            width: "95vw",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "80%",
            }}
          >
            <LookupMember />
          </Box>
        </Box>
      )}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "95vh",
            width: "95vw",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size="10rem" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
