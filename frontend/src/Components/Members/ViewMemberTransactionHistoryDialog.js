import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
export default function ViewMemberTransactionHistoryDialog({
  open,
  closeDialog,
  member,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    getMemberTransactionHistory();
  }, []);

  const getMemberTransactionHistory = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/get-member-transaction-history/" +
          member.id,
        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      let jsonResponse = await response.json();
      setTransactions(jsonResponse);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getBorderColor = (transaction) => {
    if (transaction.transactionTypeObject.name === "credit") {
      return "1px dashed red";
    }
    if (transaction.transactionTypeObject.name === "debit") {
      return "1px dashed green";
    }
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.transactionTypeObject.name === "credit") {
      return <MoneyOffIcon />;
    }
    if (transaction.transactionTypeObject.name === "debit") {
      return <MonetizationOnIcon />;
    }
  };

  const getPrimaryText = (transaction) => {
    if (transaction.transactionTypeObject.name === "credit") {
      return (
        transaction.redeemerObject.name +
        " (" +
        transaction.pointValue +
        " point)"
      );
    }
    if (transaction.transactionTypeObject.name === "debit") {
      return (
        transaction.generatorObject.name +
        " (" +
        transaction.pointValue +
        " point)"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>
        Transaction History for {member.firstName} {member.lastName}
      </DialogTitle>
      <DialogContent sx={{ height: 400, width: 450 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          {!isLoading && (
            <React.Fragment>
              <Box sx={{ border: "1px solid black", textAlign: "center" }}>
                <Typography sx={{ fontSize: 20, color: "black" }}>
                  Account Balance{" "}
                  <Typography sx={{ fontSize: 20, color: "green" }}>
                    {member.accountBalance}
                  </Typography>
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 18,
                  color: "black",
                  marginTop: 2,
                  marginBottom: 1,
                }}
              >
                History
              </Typography>
              <List>
                {transactions.map((transaction, index) => {
                  return (
                    <ListItem
                      key={index}
                      sx={{
                        border: getBorderColor(transaction),
                        marginBottom: 1,
                      }}
                    >
                      <ListItemIcon>
                        {getTransactionIcon(transaction)}
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "18px",
                          color: "black",
                        }}
                        primary={getPrimaryText(transaction)}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          )}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: 200,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                Getting transaction History
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size="4rem" />
              </Box>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
