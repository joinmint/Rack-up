import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddRedeemerDialog from "./AddRedeemerDialog";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
const DIALOGRESULTS = {
  ADDREDEEMERCANCELLED: 0,
  ADDREDEEMERERROR: 1,
  ADDREDEEMERSUCCESS: 2,
};

function Redeemers() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [showDialogAlert, setShowDialogAlert] = React.useState(false);
  const [dialogAlertResult, setDialogAlertResult] = React.useState("");
  const [dialogAlertSeverity, setDialogAlertSeverity] = React.useState("");
  const [redeemers, setRedeemers] = React.useState([]);
  const [redeemersLoaded, setRedeemersLoaded] = React.useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "pointValue",
      headerName: "Point Value",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    loadRedeemerData();
  }, []);

  const loadRedeemerData = async () => {
    setRedeemersLoaded(false);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/redeemer/get-all-redeemers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      let redeemers = await response.json();
      setRedeemers(redeemers);
      setRedeemersLoaded(true);
      console.log(redeemers);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseDialog = (dialogResult) => {
    if (dialogResult === DIALOGRESULTS.ADDREDEEMERCANCELLED) {
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDREDEEMERERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Adding Redeemer");
      setDialogAlertSeverity("error");
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDREDEEMERSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult("Redeemer Added Successfully");
      setDialogAlertSeverity("success");
      setAddDialogOpen(false);
      loadRedeemerData();
    }
    setAddDialogOpen(false);
  };

  return (
    <React.Fragment>
      {addDialogOpen && (
        <AddRedeemerDialog
          open={addDialogOpen}
          closeDialog={handleCloseDialog}
          DIALOGRESULTS={DIALOGRESULTS}
        />
      )}
      {showDialogAlert && (
        <Alert
          onClose={() => {
            setShowDialogAlert(false);
          }}
          variant="filled"
          severity={dialogAlertSeverity}
          sx={{ marginBottom: 5 }}
        >
          {dialogAlertResult}
        </Alert>
      )}
      <Box component="div" sx={{ height: "80vh", width: "100%" }}>
        <Fab
          sx={{ position: "absolute", bottom: 16, right: 40 }}
          color="primary"
          aria-label="add"
          onClick={() => {
            setAddDialogOpen(true);
          }}
          variant="extended"
        >
          <Typography color="white">Add New Redeemer</Typography>
          <AddIcon style={{ color: "#fff" }} />
        </Fab>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{ fontSize: 17 }}
            density={"comfortable"}
            disableSelectionOnClick={true}
            getRowId={(row) => row.id}
            rows={redeemers}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            loading={!redeemersLoaded}
          />
        </div>
      </Box>
    </React.Fragment>
  );
}

const Loading = () => <div>Loading</div>;
export default withAuthenticationRequired(Redeemers, {
  onRedirecting: () => <Loading />,
});
