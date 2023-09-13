import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddMemberDialog from "./AddMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import ViewMemberCardDialog from "./ViewMemberCardDialog";
import ViewMemberTransactionHistoryDialog from "./ViewMemberTransactionHistoryDialog";
import Typography from "@mui/material/Typography";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import EditIcon from "@mui/icons-material/Edit";
const DIALOGRESULTS = {
  ADDMEMBERCANCELLED: 0,
  ADDMEMBERERROR: 1,
  ADDMEMBERPHOTOERROR: 2,
  ADDMEMBERSUCCESS: 3,
  EDITMEMBERCANCELLED: 4,
  EDITMEMBERERROR: 5,
  EDITMEMBERSUCCES: 6,
  DELETEMEMBERERROR: 7,
  DELETEMEMBERSUCCESS: 8,
};

function Members() {
  const [viewMemberCardDialogOpen, setViewMemberCardDialogOpen] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMemberDialogOpen, setEditMemberDialogOpen] = React.useState(false);
  const [viewMemberTransactionDialog, setViewMemberTransactionDialog] =
    React.useState(false);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [showDialogAlert, setShowDialogAlert] = React.useState(false);
  const [dialogAlertResult, setDialogAlertResult] = React.useState("");
  const [dialogAlertSeverity, setDialogAlertSeverity] = React.useState("");
  const [members, setMembers] = React.useState([]);
  const [membersLoaded, setMembersLoaded] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    loadMemberData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
      align: "center",
      headerAlign: "center",
    },
    { field: "firstName", headerName: "First name", width: 130 },
    {
      field: "lastName",
      headerName: "Last name",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dob",
      headerName: "DOB",
      type: "number",
      sortable: false,
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accountBalance",
      headerName: "Account Balance",
      type: "number",
      sortable: false,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Actions",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <IconButton
            aria-label=""
            color="primary"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setSelectedRow(cellValues.row);
              setMenuOpen(true);
            }}
          >
            <ManageAccountsIcon style={{ fontSize: 40 }} />
          </IconButton>
        );
      },
      width: 200,
    },
  ];
  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    setMenuOpen(false);
  };
  const getActionMenuItems = (selectedRow, closeMenu) => {
    return (
      <div>
        <MenuItem
          onClick={() => {
            setSelectedRow(selectedRow);
            setViewMemberCardDialogOpen(true);
            setMenuOpen(false);
            setAnchorEl(null);
          }}
        >
          <CardMembershipIcon sx={{ marginRight: 2 }} /> Generate Membership
          Card
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedRow(selectedRow);
            setViewMemberTransactionDialog(true);
            setMenuOpen(false);
            setAnchorEl(null);
          }}
        >
          <ReceiptIcon sx={{ marginRight: 2 }} />
          View Transaction History
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(
              process.env.REACT_APP_PUBLIC_URL + "?memberID=" + selectedRow.id
            );
            setMenuOpen(false);
            setAnchorEl(null);
          }}
        >
          <OpenInBrowserIcon sx={{ marginRight: 2 }} />
          View Public Portal
        </MenuItem>
      </div>
    );
  };

  const loadMemberData = async () => {
    setMembersLoaded(false);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/member/get-all-members",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw Error("Cant fetch data");
      }
      let members = await response.json();
      setMembers(members);
      setMembersLoaded(true);
    } catch (e) {
      setMembersLoaded(true);
    }
  };

  const handleCloseDialog = (dialogResult) => {
    if (dialogResult === DIALOGRESULTS.ADDMEMBERCANCELLED) {
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDMEMBERERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Adding Member");
      setDialogAlertSeverity("error");
      setAddDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.ADDMEMBERPHOTOERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult(
        "Member added, but there was an error uploading the photo"
      );
      setDialogAlertSeverity("warning");
      setAddDialogOpen(false);
      loadMemberData();
    }
    if (dialogResult === DIALOGRESULTS.ADDMEMBERSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult("Member Added Successfully");
      setDialogAlertSeverity("success");
      setAddDialogOpen(false);
      loadMemberData();
    }
  };

  const handleCloseEditDialog = (dialogResult) => {
    if (dialogResult === DIALOGRESULTS.EDITMEMBERCANCELLED) {
      setEditMemberDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.EDITMEMBERERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Editing Member");
      setDialogAlertSeverity("error");
      setEditMemberDialogOpen(false);
    }
    if (dialogResult === DIALOGRESULTS.EDITMEMBERSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult(
        selectedRow.FirstName +
          " " +
          selectedRow.LastName +
          " Edited Successfully"
      );
      setSelectedRow(null);
      setDialogAlertSeverity("success");
      setEditMemberDialogOpen(false);
      loadMemberData();
    }
    if (dialogResult === DIALOGRESULTS.DELETEMEMBERSUCCESS) {
      setShowDialogAlert(true);
      setDialogAlertResult(
        selectedRow.FirstName +
          " " +
          selectedRow.LastName +
          " Deleted Successfully"
      );
      setSelectedRow(null);
      setDialogAlertSeverity("success");
      setEditMemberDialogOpen(false);
      loadMemberData();
    }
    if (dialogResult === DIALOGRESULTS.DELETEMEMBERERROR) {
      setShowDialogAlert(true);
      setDialogAlertResult("Error Deleting Member");
      setDialogAlertSeverity("error");
      setEditMemberDialogOpen(false);
    }
  };

  return (
    <React.Fragment>
      {menuOpen && (
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={menuOpen}
          onClose={closeMenu}
        >
          {getActionMenuItems(selectedRow, closeMenu)}
        </Menu>
      )}
      {viewMemberTransactionDialog && (
        <ViewMemberTransactionHistoryDialog
          open={viewMemberTransactionDialog}
          closeDialog={() => {
            setViewMemberTransactionDialog(false);
            setSelectedRow(null);
          }}
          member={selectedRow}
        />
      )}
      {addDialogOpen && (
        <AddMemberDialog
          open={addDialogOpen}
          closeDialog={handleCloseDialog}
          DIALOGRESULTS={DIALOGRESULTS}
        />
      )}
      {viewMemberCardDialogOpen && (
        <ViewMemberCardDialog
          open={viewMemberCardDialogOpen}
          closeDialog={() => {
            setViewMemberCardDialogOpen(false);
            setSelectedRow(null);
          }}
          member={selectedRow}
        />
      )}
      {editMemberDialogOpen && (
        <EditMemberDialog
          open={editMemberDialogOpen}
          closeDialog={handleCloseEditDialog}
          member={selectedRow}
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
          <Typography color="white">Add New Member</Typography>
          <AddIcon style={{ color: "#fff" }} />
        </Fab>

        <div style={{ height: "70%", width: "100%" }}>
          <DataGrid
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{ fontSize: 17 }}
            disableSelectionOnClick={true}
            getRowId={(row) => row.id}
            rows={members}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            loading={!membersLoaded}
            density={"comfortable"}
          />
        </div>
      </Box>
    </React.Fragment>
  );
}

const Loading = () => <div>Loading</div>;
export default withAuthenticationRequired(Members, {
  onRedirecting: () => <Loading />,
});
