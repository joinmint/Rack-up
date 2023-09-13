import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function EditMemberDialog({
  open,
  closeDialog,
  member,
  DIALOGRESULTS,
}) {
  const [email, setEmail] = useState(member.Email);
  const [lastName, setLastName] = useState(member.LastName);
  const [firstName, setFirstName] = useState(member.FirstName);
  const [address, setAddress] = useState(member.Address);
  const [age, setAge] = useState(member.Age);

  const handleEditMember = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/edit-member/" +
          member.MemberID,
        {
          method: "PUT",
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            address: address,
            age: age,
          }),
        }
      );
      await response.json();
      closeDialog(DIALOGRESULTS.EDITMEMBERSUCCESS);
    } catch (e) {
      closeDialog(DIALOGRESULTS.EDITMEMBERERROR);
    }
  };
  const handleDeleteMember = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/delete-member/" +
          member.MemberID,
        {
          method: "DELETE",
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      closeDialog(DIALOGRESULTS.DELETEMEMBERSUCCESS);
    } catch (e) {
      closeDialog(DIALOGRESULTS.DELETEMEMBERERROR);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Edit Member</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          Edit information for {member.FirstName} {member.LastName}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          label="First Name"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          label="Last Name"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Address"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          fullWidth
          variant="standard"
        />
        <TextField
          margin="dense"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          label="Age"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog(DIALOGRESULTS.EDITMEMBERCANCELLED);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleDeleteMember();
          }}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            handleEditMember();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
