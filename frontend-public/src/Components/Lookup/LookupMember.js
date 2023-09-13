import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function LookupMember() {
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [lookupCode, setLookupCode] = useState("");

  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));

  const handleMemberLookup = async () => {
    try {
      //if a lookup code is provided that needs to take precedent
      //so we default to a code lookup
      let lookupType = null;
      if (lastName !== "" && dob !== "") lookupType = "combo";
      if (lookupCode !== "") lookupType = "code";

      let result = await lookupMemberInfoPublic(lookupType);
      window.location.replace(
        process.env.REACT_APP_PUBLIC_URL + "?memberID=" + result.id
      );
    } catch (e) {
      setNotFound(true);
    }
  };

  const lookupMemberInfoPublic = async (lookupType) => {
    if (!lookupType) return;
    try {
      let formattedDOB = "";
      if (dob !== "") formattedDOB = dob.format("M/D/YYYY");

      console.log(formattedDOB);
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/member/lookup-member-info-public",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lookupType: lookupType,
            dob: formattedDOB,
            lastName: lastName,
            code: lookupCode,
          }),
        }
      );
      if (!response.ok) throw Error("Not Found");
      let serverResponse = await response.json();
      return serverResponse;
    } catch (e) {
      throw Error(e);
    }
  };

  const canFind = () => {
    let comboLookup = lastName !== "" && dob !== "";
    let codeLookup = lookupCode !== "";
    if (comboLookup || codeLookup) return true;
    return false;
  };

  return (
    <Card
      sx={{
        width: responsiveCardHelpers.getMinWidth(mediumScreenSize),
        height: responsiveCardHelpers.getHeight(mediumScreenSize),
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 400,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 1,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: 14 }} color={"black"}>
              Need to find member? You can search by Last Name and DOB or use
              the manual entry code listed on their ID card.
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <TextField
              margin="dense"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Enter member last name"
              variant="outlined"
              //error={incorrectCode}
              fullWidth
              sx={{ marginBottom: 3 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem>
                <DatePicker
                  value={dob}
                  onChange={(newValue) => setDob(newValue)}
                />
              </DemoItem>
            </LocalizationProvider>
            <Typography
              sx={{ fontSize: 14, marginTop: 1, marginBottom: 1 }}
              color={"black"}
            >
              OR
            </Typography>
            <TextField
              margin="dense"
              id="lookupCode"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              label="Enter member Lookup Code"
              variant="outlined"
              //error={incorrectCode}
              fullWidth
            />
          </Box>
          {notFound && (
            <Typography color={theme.palette.error.main}>
              Member not found
            </Typography>
          )}
          <Button
            onClick={handleMemberLookup}
            disabled={!canFind()}
            sx={{ marginTop: 2 }}
            variant="contained"
            startIcon={<PersonSearchIcon style={{ color: "#fff" }} />}
          >
            <Typography color="white">Find Member</Typography>
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LookupMember;
