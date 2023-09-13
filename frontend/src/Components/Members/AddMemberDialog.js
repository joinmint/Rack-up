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
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Typography from "@mui/material/Typography";
import imageCompression from "browser-image-compression";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ERROR = {
  ADDMEMBERERROR: 0,
  CROPPHOTOERROR: 1,
  COMPRESSPHOTOERROR: 2,
};

export default function AddMemberDialog({ open, closeDialog, DIALOGRESULTS }) {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const dialogEndRef = useRef(null);
  const scrollToBottom = () => {
    dialogEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { getAccessTokenSilently } = useAuth0();

  const getBorderColor = () => {
    if (errors.includes("dob")) return "1px solid red";
    return "";
  };

  const getUploadImageButtonColor = () => {
    if (errors.includes("image")) return "error";
    return "primary";
  };

  const inError = () => {
    let formErrors = [];
    //check text boxes are entered
    if (firstName === "") {
      formErrors.push("firstName");
    }
    if (lastName === "") {
      formErrors.push("lastName");
    }
    if (email === "") {
      formErrors.push("email");
    }
    if (address === "") {
      formErrors.push("address");
    }
    if (dob === "") {
      formErrors.push("dob");
    }
    if (photoURL === null) {
      formErrors.push("image");
    }
    setErrors(formErrors);

    return formErrors.length;
  };

  const handleAddMember = async () => {
    if (inError()) return;
    setIsAdding(true);
    try {
      //first we need create the user to get the QR ID
      let addedMember = await addMemberToDB();

      //now get file object from cropper
      let croppedFile = await getFileFromCropper();

      //compress the cropped file before uploading
      let compressedImage = await compressImage(croppedFile);

      //now we get the presigned url with member QR ir
      let presignedURL = await handleGetPresignedURL(
        addedMember.id,
        compressedImage
      );

      //now upload photo using the presigned URL
      let uploadResponse = await handleUploadProfilePhoto(
        compressedImage,
        presignedURL.image_url
      );
      setIsAdding(false);
      closeDialog(DIALOGRESULTS.ADDMEMBERSUCCESS);
    } catch (error) {
      setIsAdding(false);
      if (error === ERROR.ADDMEMBERERROR) {
        //At this point a member was added so we we will close the dialog telling user the member wasn't added
        setIsAdding(false);
        closeDialog(DIALOGRESULTS.ADDMEMBERERROR);
      } else {
        //Otherwise the error was with image upload so close the dialog but tell user photo wasn't uplaoded
        setIsAdding(false);
        closeDialog(DIALOGRESULTS.ADDMEMBERPHOTOERROR);
      }
    }
  };

  const addMemberToDB = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/member/add-member",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            address: address,
            dob: dob.format("M/D/YYYY"),
          }),
        }
      );

      if (!response.ok) {
        throw Error("Can't add member");
      }
      let serverResponse = await response.json();
      return serverResponse;
    } catch (e) {
      console.log("GOT HERE FYI");
      throw ERROR.ADDMEMBERERROR;
    }
  };

  const handleGetPresignedURL = async (qrID, file) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          "/api/member/generate-member-photo-s3-url/" +
          qrID,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          //body: JSON.stringify({
          //}),
        }
      );
      let r = await response.json();
      return r;
    } catch (e) {
      closeDialog(DIALOGRESULTS.UPLOADPHOTOERROR);
    }
  };

  const getFileFromCropper = async () => {
    const file = await fetch(cropper.getCroppedCanvas().toDataURL())
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], "member_photo.png", { type: "image/png" });
      });

    return file;
  };
  const handleUploadProfilePhoto = async (file, presignedURL) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: file,
    };
    try {
      const response = await fetch(presignedURL, requestOptions);
      let r = await response;
      return r;
    } catch (e) {
      console.log(e);
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectPhoto = (e) => {
    if (e.target.files) {
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
      scrollToBottom();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        closeDialog();
      }}
    >
      <DialogTitle>Add a New Member</DialogTitle>
      <DialogContent sx={{ height: 1000, width: 600 }}>
        <DialogContentText sx={{ marginBottom: 3, marginTop: 3 }}>
          Your members are the individuals who will recieve benefits from your
          orginization.
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
            <Box sx={{ textAlign: "center" }}>Adding Member</Box>
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
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First Name"
              error={errors.includes("firstName")}
              variant="standard"
            />
            <TextField
              margin="dense"
              id="lastName"
              value={lastName}
              sx={{ marginLeft: 10 }}
              onChange={(e) => setLastName(e.target.value)}
              label="Last Name"
              error={errors.includes("lastName")}
              variant="standard"
            />
            <TextField
              margin="dense"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              label="Address"
              fullWidth
              error={errors.includes("address")}
              variant="standard"
            />
            <TextField
              margin="dense"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              fullWidth
              error={errors.includes("email")}
              variant="standard"
            />
            <Box
              sx={{
                marginBottom: 5,
                marginTop: 5,
                padding: 1,
                border: getBorderColor(),
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label="Birthday">
                  <DatePicker
                    value={dob}
                    onChange={(newValue) => setDOB(newValue)}
                  />
                </DemoItem>
              </LocalizationProvider>
            </Box>

            <Button
              component="label"
              variant="contained"
              startIcon={<FileOpenIcon style={{ color: "#fff" }} />}
              color={getUploadImageButtonColor()}
              sx={{ marginBottom: 5 }}
            >
              <Typography color={"white"}>Upload Profile Image</Typography>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleSelectPhoto}
                hidden
              />
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Cropper
                src={photoURL}
                style={{ height: 400, width: 400 }}
                initialAspectRatio={1 / 1}
                minCropBoxHeight={50}
                minCropBoxWidth={50}
                moveable={true}
                dragMode={"move"}
                cropBoxResizable={false}
                guides={false}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />
            </Box>
            <div ref={dialogEndRef} />
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeDialog(DIALOGRESULTS.ADDMEMBERCANCELLED);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleAddMember();
          }}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
