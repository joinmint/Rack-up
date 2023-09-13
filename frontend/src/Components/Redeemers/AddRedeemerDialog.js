import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export default function AddRedeemerDialog({
  open,
  closeDialog,
  DIALOGRESULTS,
}) {
  const [name, setName] = useState("");

  const [pointValue, setPointValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const inError = () => {
    let formErrors = [];
    //check text boxes are entered
    if (name === "") {
      formErrors.push("name");
    }
    if (pointValue === "") {
      formErrors.push("pointValue");
    }
    setErrors(formErrors);

    return formErrors.length;
  };

  const handleAddRedeemer = async () => {
    if (inError()) return;

    setIsAdding(true);
    let addResult = await addRedeemerToDB();
    setIsAdding(false);
    closeDialog(DIALOGRESULTS.ADDREDEEMERSUCCESS);
  };

  const addRedeemerToDB = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/redeemer/add-redeemer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            pointValue: parseInt(pointValue),
          }),
        }
      );
      let serverResponse = await response.json();
      return serverResponse;
    } catch (e) {
      console.log(e);
      closeDialog(DIALOGRESULTS.ADDREDEEMERERROR);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Add a New Redeemer</DialogTitle>
      <DialogContent sx={{ height: 400, width: 500 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          Your redeemers are objects/things that members can use their points
          on!
        </DialogContentText>
        {isAdding && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 200,
            }}
          >
            <Box sx={{ textAlign: "center" }}>Adding Redeemer</Box>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size="4rem" />
            </Box>
          </Box>
        )}
        {!isAdding && (
          <React.Fragment>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Redeemer Name"
              error={errors.includes("name")}
              helperText="This is the friendly name your partners will search for when they scan a card"
              variant="standard"
              fullWidth
            />
            <TextField
              margin="dense"
              id="point-value"
              value={pointValue}
              onChange={(e) => {
                //ensure typed text is numeric
                if (isNaN(e.target.value)) return;
                else setPointValue(e.target.value);
              }}
              label="Point Value"
              helperText="How many points does a member need to redeem this benefit?"
              error={errors.includes("pointValue")}
              variant="standard"
            />
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog(DIALOGRESULTS.ADDREDEEMERCANCELLED);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddRedeemer();
          }}
        >
          Add Redeemer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
