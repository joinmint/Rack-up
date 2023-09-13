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

export default function AddGeneratorDialog({
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

  const handleAddGenerator = async () => {
    if (inError()) return;

    setIsAdding(true);
    let addResult = await addGeneratorToDB();
    setIsAdding(false);
    closeDialog(DIALOGRESULTS.ADDGENERATORSUCCESS);
  };

  const addGeneratorToDB = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/generator/add-generator",
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
      closeDialog(DIALOGRESULTS.ADDGENEATORERROR);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Add a New Generator</DialogTitle>
      <DialogContent sx={{ height: 400, width: 500 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          Your generators are the actions members will take to generate points
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
            <Box sx={{ textAlign: "center" }}>Adding Generator</Box>
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
              label="Geneartor Name"
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
              helperText="How many points should a member recieve for taking this action?"
              label="Point Value"
              error={errors.includes("pointValue")}
              variant="standard"
            />
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog(DIALOGRESULTS.ADDGENERATORCANCELLED);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddGenerator();
          }}
        >
          Add Generator
        </Button>
      </DialogActions>
    </Dialog>
  );
}
