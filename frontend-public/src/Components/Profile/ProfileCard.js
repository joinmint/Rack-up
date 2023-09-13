import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RedeemIcon from "@mui/icons-material/Redeem";
import SavingsIcon from "@mui/icons-material/Savings";
import StoreIcon from "@mui/icons-material/Store";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import responsiveCardHelpers from "../Utilities/ResponsiveCardHelpers";

function ProfileCard({
  assignBenfits,
  redeemBenefits,
  viewTransactionHistory,
  member,
}) {
  const theme = useTheme();
  const mediumScreenSize = useMediaQuery(theme.breakpoints.up("md"));
  const getImageSize = () => {
    if (mediumScreenSize) {
      return 200;
    } else {
      return 100;
    }
  };

  return (
    <Card
      sx={{
        width: responsiveCardHelpers.getMinWidth(mediumScreenSize),
        height: responsiveCardHelpers.getHeight(mediumScreenSize),
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 400,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: getImageSize(),
                height: getImageSize(),
              }}
            >
              <img
                style={{ border: "1px solid white", borderRadius: "50%" }}
                width="100%"
                height="100%"
                src={member.profileImage}
                alt="Profile"
              />
            </Box>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{ fontSize: 20, margin: 0 }}
              color="text.primary"
              gutterBottom
            >
              <b>
                {member.firstName} {member.lastName}
              </b>
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Joined: 1/1/23
            </Typography>
          </Box>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 5,
              marginTop: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Typography sx={{ fontSize: 25 }} color={"primary"}>
                {member.accountBalance}
              </Typography>
              <Typography sx={{ fontSize: 15 }}>Points</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={viewTransactionHistory}
            >
              <Typography sx={{ fontSize: 25 }} color={"primary"}>
                <HistoryEduIcon />
              </Typography>
              <Typography sx={{ fontSize: 15 }}>Log</Typography>
            </Box>
          </Paper>

          <Box sx={{}}>
            <Stack spacing={2} direction="column">
              <Button
                onClick={assignBenfits}
                variant="contained"
                startIcon={<SavingsIcon style={{ color: "#fff" }} />}
              >
                <Typography color="white">Earn Points</Typography>
              </Button>
              <Button
                onClick={redeemBenefits}
                sx={{ bgcolor: "#07A0C3" }}
                variant="contained"
                startIcon={<StoreIcon style={{ color: "#fff" }} />}
              >
                <Typography color="white">Spend Points</Typography>
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
