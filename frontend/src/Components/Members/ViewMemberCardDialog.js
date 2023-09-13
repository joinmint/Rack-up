import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
export default function ViewMemberCardDialog({ open, closeDialog, member }) {
  const [presignedURL, setPresignedURL] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    generateMemberIDCard();
  }, []);

  const generateMemberIDCard = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/generate-member-card/" +
          member.id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qr_id: member.id,
          }),
        }
      );
      let presignedURL = await response.json();
      setPresignedURL(presignedURL.image_url);
      setImageLoaded(true);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const viewQRLink = () => {
    window.open(process.env.REACT_APP_PUBLIC_URL + "?memberID=" + member.id);
  };
  const downloadCard = () => {
    const link = document.createElement("a");
    link.href = presignedURL;
    link.download = "test.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Print Membership Card</DialogTitle>
      <DialogContent sx={{ height: 500, width: 450 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          {!isLoading && (
            <React.Fragment>
              Membership card for {member.FirstName}
              <br />
              <br />
              <br />
              <br />
              {imageLoaded && (
                <Paper variant="outlined">
                  <img width="400" height="250" src={presignedURL} />
                </Paper>
              )}
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
              <Box sx={{ textAlign: "center" }}>Generating Membership</Box>
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
        <Button
          onClick={() => {
            viewQRLink();
          }}
        >
          View QR Link
        </Button>
        <Button
          onClick={() => {
            downloadCard();
          }}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
