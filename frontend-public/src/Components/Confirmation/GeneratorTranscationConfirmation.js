import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
function GeneratorTransactionConfirmation({
  confirmationMessage,
  close,
  member,
}) {
  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));
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
            justifyContent: "center",
            height: 350,
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: 10 }}>
            <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
              {confirmationMessage}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => {
                window.location.replace(
                  process.env.REACT_APP_PUBLIC_URL + "?memberID=" + member.id
                );
              }}
              variant="contained"
              endIcon={<AccountBoxIcon style={{ color: "#fff" }} />}
            >
              <Typography color="white">Go Back to Profile</Typography>
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GeneratorTransactionConfirmation;
