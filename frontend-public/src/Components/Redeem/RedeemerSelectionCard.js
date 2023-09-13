import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

function RedeemerSelectionCard({
  backToProfile,
  member,
  showRedeemerConfirmation,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [redeemers, setRedeemers] = useState([]);
  const [collectPartnerCode, setCollectPartnerCode] = useState(false);
  const [selectedRedeemer, setSelectedRedeemer] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    getRedeemersPublic();
  }, []);
  const getRedeemersPublic = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/redeemer/get-all-redeemers-public/" +
          member.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let redeemers = await response.json();
      setRedeemers(
        redeemers.map((r) => {
          return { label: r.name, id: r.id, pointValue: r.pointValue };
        })
      );
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitTransaction = async () => {
    try {
      let addTransactionResult = await addRedeemerTransactionPublic();

      //show confirmation of transcation
      showRedeemerConfirmation(
        "Removed " +
          addTransactionResult.pointValue +
          " Points to " +
          member.firstName +
          " " +
          member.lastName +
          "'s Account!"
      );
    } catch (errorMessage) {
      //setInsufficientFunds
      if (errorMessage === "invalid_code") {
        setIncorrectCode(true);
        setInsufficientFunds(false);
      }
      if (errorMessage === "insufficient_funds") {
        setInsufficientFunds(true);
        setIncorrectCode(false);
      }
    }
  };

  const addRedeemerTransactionPublic = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/redeemer/add-redeemer-transaction-public",
        {
          method: "POST",
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: partnerCode,
            member_id: member.id,
            redeemer_id: selectedRedeemer.id,
          }),
        }
      );
      let serverResponse = await response.json();
      if (!response.ok) throw serverResponse.error;
      return serverResponse;
    } catch (e) {
      throw e;
    }
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
            height: 350,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
              Redeem Points
            </Typography>
          </Box>
          {isLoading && (
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 200,
                }}
              >
                <Box sx={{ textAlign: "center" }}>Loading Redeemers</Box>
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress size="4rem" />
                </Box>
              </Box>
            </React.Fragment>
          )}
          {!isLoading && (
            <React.Fragment>
              {!collectPartnerCode && (
                <React.Fragment>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 18 }} color="text.primary">
                      <b>Spend points on benefits your orginzation offers</b>
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.primary"
                      gutterBottom
                    >
                      Select benefit from the last below
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={redeemers}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Benefit" />
                      )}
                      value={selectedRedeemer}
                      onChange={(e, val) => {
                        setSelectedRedeemer(val);
                      }}
                    />
                  </Box>
                </React.Fragment>
              )}
              {collectPartnerCode && (
                <React.Fragment>
                  <Box sx={{ textAlign: "center" }}>
                    {!incorrectCode && !insufficientFunds && (
                      <React.Fragment>
                        <Typography
                          sx={{ fontSize: 18 }}
                          color="text.primary"
                          gutterBottom
                        >
                          <b>
                            {selectedRedeemer.label} (+
                            {selectedRedeemer.pointValue})
                          </b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.primary"
                          gutterBottom
                        >
                          To spend {selectedRedeemer.pointValue} point(s) from{" "}
                          {member.firstName}'s account please enter your partner
                          code below.
                        </Typography>
                      </React.Fragment>
                    )}
                    {incorrectCode && (
                      <React.Fragment>
                        <Typography
                          sx={{ fontSize: 18 }}
                          color={theme.palette.error.main}
                          gutterBottom
                        >
                          <b>Sorry, this code is invalid</b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color={theme.palette.error.main}
                        >
                          Forgot your partner code? Contact administrator or{" "}
                          <i>click here</i>
                        </Typography>
                      </React.Fragment>
                    )}
                    {insufficientFunds && (
                      <Typography
                        sx={{ fontSize: 18 }}
                        color={theme.palette.error.main}
                        gutterBottom
                      >
                        <b>Sorry, Insufficient Funds</b>
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <TextField
                      margin="dense"
                      id="code"
                      value={partnerCode}
                      onChange={(e) => setPartnerCode(e.target.value)}
                      label="Enter your partner code here"
                      variant="outlined"
                      error={incorrectCode}
                      fullWidth
                    />
                  </Box>
                </React.Fragment>
              )}

              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {!collectPartnerCode && (
                  <Button
                    onClick={() => {
                      setSelectedRedeemer("");
                      backToProfile();
                    }}
                    variant="outlined"
                    startIcon={<ArrowBackIosNewIcon />}
                  >
                    Back
                  </Button>
                )}
                {collectPartnerCode && (
                  <Button
                    onClick={() => {
                      setCollectPartnerCode(false);
                      setIncorrectCode(false);
                    }}
                    variant="outlined"
                    startIcon={<ArrowBackIosNewIcon />}
                  >
                    Back
                  </Button>
                )}

                {!collectPartnerCode && (
                  <Button
                    onClick={() => {
                      setCollectPartnerCode(true);
                    }}
                    variant="contained"
                    endIcon={<ArrowForwardIosIcon style={{ color: "#fff" }} />}
                    disabled={!selectedRedeemer}
                  >
                    <Typography color="white">Add</Typography>
                  </Button>
                )}
                {collectPartnerCode && (
                  <Button
                    onClick={handleSubmitTransaction}
                    variant="contained"
                    endIcon={<ArrowForwardIosIcon style={{ color: "#fff" }} />}
                    disabled={!partnerCode}
                  >
                    <Typography color="white">Submit</Typography>
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RedeemerSelectionCard;
