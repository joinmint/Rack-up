import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddPartnerDialog from "./AddPartnerDialog";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
const DIALOGRESULTS = {
  ADDPARTNERCANCELLED: 0,
  ADDPARTNERERROR: 1,
  ADDPARTNERSUCCESS: 2,
};

function Partners() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [showDialogAlert, setShowDialogAlert] = React.useState(false);
  const [dialogAlertResult, setDialogAlertResult] = React.useState("");
  const [dialogAlertSeverity, setDialogAlertSeverity] = React.useState("");
  const [partners, setPartners] = React.useState([]);
  const [partnersLoaded, setPartnersLoaded] = React.useState(false);
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
      field: "email",
      headerName: "Email",
      width: 300,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "code",
      headerName: "Secret Code",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    setPartnersLoaded(false);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/partner/get-all-partners",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw Error("Can't load partners");
      let partners = await response.json();
      setPartners(partners);
      setPartnersLoaded(true);
      console.log(partners);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseDialog = (dialogResult) => {
    if (dialogResult === DIALOGRESULTS.ADDPARTNERCANCELLED) {
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDPARTNERERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Adding Partner");
      setDialogAlertSeverity("error");
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDPARTNERSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult("Partner Added Successfully");
      setDialogAlertSeverity("success");
      setAddDialogOpen(false);
      loadPartnerData();
    }
    setAddDialogOpen(false);
  };

  return (
    <React.Fragment>
      {addDialogOpen && (
        <AddPartnerDialog
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
          <Typography color="white">Add New Partner</Typography>
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
            rows={partners}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            loading={!partnersLoaded}
          />
        </div>
      </Box>
    </React.Fragment>
  );
}

const Loading = () => <div>Loading</div>;
export default withAuthenticationRequired(Partners, {
  onRedirecting: () => <Loading />,
});
