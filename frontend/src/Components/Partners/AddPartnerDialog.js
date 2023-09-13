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

export default function AddPartnerDialog({ open, closeDialog, DIALOGRESULTS }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const inError = () => {
    let formErrors = [];
    //check text boxes are entered
    if (name === "") {
      formErrors.push("name");
    }
    if (name === "") {
      formErrors.push("code");
    }
    if (email === "") {
      formErrors.push("email");
    }
    setErrors(formErrors);

    return formErrors.length;
  };

  const handleAddPartner = async () => {
    if (inError()) return;

    setIsAdding(true);
    let addResult = await addPartnerToDB();
    setIsAdding(false);
    closeDialog(DIALOGRESULTS.ADDPARTNERSUCCESS);
  };

  const addPartnerToDB = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/partner/add-partner",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            code: code,
          }),
        }
      );
      let serverResponse = await response.json();
      return serverResponse;
    } catch (e) {
      console.log(e);
      closeDialog(DIALOGRESULTS.ADDPARTNERERROR);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Add a New Partner</DialogTitle>
      <DialogContent sx={{ height: 600, width: 500 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          Your partners are the people, orginizations, and trusted individuals
          who will add and remove points from your members. Ultimately, only
          your partners can make transacitons on the member's behalf. They will
          use a code that only you two know to validate their identity.
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
            <Box sx={{ textAlign: "center" }}>Adding Partner</Box>
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
              label="Partner Name"
              error={errors.includes("name")}
              helperText="This is the name of your partner"
              variant="standard"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              label="Partner Code"
              error={errors.includes("code")}
              helperText="This is the secrete code that your partner will use to validate their identity"
              variant="standard"
              fullWidth
            />
            <TextField
              margin="dense"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              helperText="Your partner's email address"
              label="Email"
              error={errors.includes("email")}
              variant="standard"
              fullWidth
            />
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog(DIALOGRESULTS.ADDPARTNERCANCELLED);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddPartner();
          }}
        >
          Add Partner
        </Button>
      </DialogActions>
    </Dialog>
  );
}
