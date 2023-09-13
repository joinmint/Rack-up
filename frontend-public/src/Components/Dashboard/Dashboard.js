import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProfileCard from "../Profile/ProfileCard";
import GeneratorSelectionCard from "../Generators/GeneratorSelectionCard";
import GeneratorTransactionConfirmation from "../Confirmation/GeneratorTranscationConfirmation";
import RedeemerTransactionConfirmation from "../Confirmation/RedeemerTransactionConfirmation";
import ViewTransactionsCard from "../Transactions/ViewTransactionsCard";
import RedeemerSelectionCard from "../Redeem/RedeemerSelectionCard";
import { ReactComponent as Logo } from "../../Assets/Theme/rackup_white.svg";
function Dashboard({ member }) {
  const [activeStep, setActiveStep] = React.useState("profile");
  const [confirmationMessage, setConfirmationMessage] = React.useState("");

  const getStepComponent = () => {
    if (activeStep === "profile") {
      return (
        <ProfileCard
          viewTransactionHistory={() => {
            setActiveStep("viewTransactions");
          }}
          assignBenfits={() => {
            setActiveStep("assign");
          }}
          redeemBenefits={() => {
            setActiveStep("redeem");
          }}
          member={member}
        />
      );
    }
    if (activeStep === "viewTransactions") {
      return (
        <ViewTransactionsCard
          backToProfile={() => {
            setActiveStep("profile");
          }}
          member={member}
        />
      );
    }
    if (activeStep === "assign") {
      return (
        <GeneratorSelectionCard
          backToProfile={() => {
            setActiveStep("profile");
          }}
          showGeneratorConfirmation={(confirmationMessage) => {
            setConfirmationMessage(confirmationMessage);
            setActiveStep("generatorConfirmation");
          }}
          member={member}
        />
      );
    }

    if (activeStep === "generatorConfirmation") {
      return (
        <GeneratorTransactionConfirmation
          confirmationMessage={confirmationMessage}
          close={() => {
            setActiveStep("profile");
          }}
          member={member}
        />
      );
    }
    if (activeStep === "redeem") {
      return (
        <RedeemerSelectionCard
          backToProfile={() => {
            setActiveStep("profile");
          }}
          showRedeemerConfirmation={(confirmationMessage) => {
            console.log("Called");
            setConfirmationMessage(confirmationMessage);
            setActiveStep("redeemerConfirmation");
          }}
          member={member}
        />
      );
    }
    if (activeStep === "redeemerConfirmation") {
      return (
        <RedeemerTransactionConfirmation
          confirmationMessage={confirmationMessage}
          close={() => {
            setActiveStep("profile");
          }}
          member={member}
        />
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "80%",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Logo width={400} height={150} />
      </Box>
      <Box>{getStepComponent()}</Box>
      <div></div>
    </Box>
  );
}

export default Dashboard;
