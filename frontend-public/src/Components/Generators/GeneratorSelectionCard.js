import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CircularProgress from "@mui/material/CircularProgress";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function GeneratorCard({ backToProfile, member, showGeneratorConfirmation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [generators, setGenerators] = useState([]);
  const [collectPartnerCode, setCollectPartnerCode] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [incorrectCode, setIncorrectCode] = useState(false);
  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    getGeneratorsPublic();
  }, []);
  const getGeneratorsPublic = async () => {
    setIsLoading(true);
    try {
      console.log(member.id);
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/generator/get-all-generators-public/" +
          member.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let generators = await response.json();
      setGenerators(
        generators.map((g) => {
          return { label: g.name, id: g.id, pointValue: g.pointValue };
        })
      );
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitTransaction = async () => {
    let addTransactionResult = await addGeneratorTransactionPublic();
    if (addTransactionResult) {
      //show confirmation of transcation
      showGeneratorConfirmation(
        "Added " +
          addTransactionResult.pointValue +
          " Points to " +
          member.firstName +
          " " +
          member.lastName +
          "'s Account!"
      );
    }
  };
  const addGeneratorTransactionPublic = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/generator/add-generator-transaction-public",
        {
          method: "POST",
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: partnerCode,
            member_id: member.id,
            generator_id: selectedGenerator.id,
          }),
        }
      );
      if (response.status === 400) {
        setIncorrectCode(true);
      } else {
        let serverResponse = await response.json();
        return serverResponse;
      }
    } catch (e) {
      console.log(e);
    }
  };
  console.log(theme);
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
              Earn Points
            </Typography>
          </Box>
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 200,
              }}
            >
              <Box sx={{ textAlign: "center" }}>Loading Generators</Box>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size="4rem" />
              </Box>
            </Box>
          )}
          {!isLoading && (
            <React.Fragment>
              {!collectPartnerCode && (
                <React.Fragment>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 18 }} color="text.primary">
                      <b>Earn points by completing actions.</b>
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Select action from the last below
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
                      options={generators}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Action" />
                      )}
                      value={selectedGenerator}
                      onChange={(e, val) => {
                        setSelectedGenerator(val);
                      }}
                    />
                  </Box>
                </React.Fragment>
              )}
              {collectPartnerCode && (
                <React.Fragment>
                  <Box sx={{ textAlign: "center" }}>
                    {!incorrectCode && (
                      <React.Fragment>
                        <Typography
                          sx={{ fontSize: 18 }}
                          color="text.primary"
                          gutterBottom
                        >
                          <b>
                            {selectedGenerator.label} (+
                            {selectedGenerator.pointValue})
                          </b>
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.primary"
                          gutterBottom
                        >
                          To apply {selectedGenerator.pointValue} point(s) to{" "}
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
                        >
                          <b>Sorry, the partner code you entered was invalid</b>
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
                      setSelectedGenerator("");
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
                    disabled={!selectedGenerator}
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

export default GeneratorCard;
