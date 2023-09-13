import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTheme } from "@mui/material/styles";

function ViewTransactionsCard({ backToProfile, member }) {
  const [transactions, setTransactions] = useState([]);
  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    getTransactionsPublic();
  }, []);
  const getTransactionsPublic = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/get-member-transaction-history-public/" +
          member.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw Error("Can't get transactions");
      let transactions = await response.json();
      setTransactions(transactions);
    } catch (e) {
      //DESIGNERRORHANDLING
      console.error(e);
    }
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.transactionTypeObject.name === "credit") {
      return <MoneyOffIcon style={{ color: theme.palette.warning.main }} />;
    }
    if (transaction.transactionTypeObject.name === "debit") {
      return (
        <MonetizationOnIcon style={{ color: theme.palette.primary.main }} />
      );
    }
  };

  const getPrimaryText = (transaction) => {
    if (transaction.transactionTypeObject.name === "credit") {
      return (
        transaction.redeemerObject.name + "-(" + transaction.pointValue + ")"
      );
    }
    if (transaction.transactionTypeObject.name === "debit") {
      return (
        transaction.generatorObject.name + " (+" + transaction.pointValue + ")"
      );
    }
  };

  return (
    <Card
      sx={{
        width: responsiveCardHelpers.getMinWidth(mediumScreenSize),
        height: responsiveCardHelpers.getHeight(mediumScreenSize),
        padding: 0,
      }}
    >
      <CardContent>
        <Paper
          sx={{
            textAlign: "center",
          }}
        >
          <Typography>Last 5 Transactions</Typography>
        </Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: responsiveCardHelpers.getHeight(mediumScreenSize) - 20,
          }}
        >
          <Box sx={{ textAlign: "left" }}>
            {transactions.map((transaction, index) => {
              return (
                <Box key={index} sx={{ display: "flex", marginBottom: 1 }}>
                  {getTransactionIcon(transaction)}
                  <Typography sx={{ marginLeft: 1 }}>
                    {getPrimaryText(transaction)}
                  </Typography>
                </Box>
              );
            })}
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
                backToProfile();
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

export default ViewTransactionsCard;
