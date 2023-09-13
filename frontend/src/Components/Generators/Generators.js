import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Alert from "@mui/material/Alert";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import AddGeneratorDialog from "./AddGeneratorDialog";

const DIALOGRESULTS = {
  ADDGENERATORCANCELLED: 0,
  ADDGENEATORERROR: 1,
  ADDGENERATORSUCCESS: 2,
};
function Generators() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [showDialogAlert, setShowDialogAlert] = React.useState(false);
  const [dialogAlertResult, setDialogAlertResult] = React.useState("");
  const [dialogAlertSeverity, setDialogAlertSeverity] = React.useState("");
  const [generators, setGenerators] = React.useState([]);
  const [generatorsLoaded, setGeneratorsLoaded] = React.useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    loadGeneratorData();
  }, []);
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
  const loadGeneratorData = async () => {
    setGeneratorsLoaded(false);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/generator/get-all-generators",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw Error("Can't get generators");
      let generators = await response.json();
      setGenerators(generators);
      setGeneratorsLoaded(true);
      console.log(generators);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseDialog = (dialogResult) => {
    if (dialogResult === DIALOGRESULTS.ADDGENERATORCANCELLED) {
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDGENEATORERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Adding Generator");
      setDialogAlertSeverity("error");
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDGENERATORSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult("Generator Added Successfully");
      setDialogAlertSeverity("success");
      setAddDialogOpen(false);
      loadGeneratorData();
    }
    setAddDialogOpen(false);
  };

  return (
    <React.Fragment>
      {addDialogOpen && (
        <AddGeneratorDialog
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
          <Typography color="white">Add New Generator</Typography>
          <AddIcon style={{ color: "#fff" }} />
        </Fab>
        <div style={{ height: "100%", width: "100%" }}>
          <DataGrid
            components={{
              Toolbar: GridToolbar,
            }}
            disableSelectionOnClick={true}
            sx={{ fontSize: 17 }}
            density={"comfortable"}
            getRowId={(row) => row.id}
            rows={generators}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            loading={!generatorsLoaded}
          />
        </div>
      </Box>
    </React.Fragment>
  );
}

const Loading = () => <div>Loading</div>;
export default withAuthenticationRequired(Generators, {
  onRedirecting: () => <Loading />,
});
