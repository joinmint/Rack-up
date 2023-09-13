import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "",
    },
    title: {
      display: true,
      text: "Monthly Points",
    },
  },
};

const horizonatlOptions = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: "y",
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "",
    },
    title: {
      display: true,
      text: "Total Points by Case Manager",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const horizontalLabels = [
  "Jim",
  "Kenny",
  "Omar",
  "Carlos",
  "Sandy",
  "Robbie",
  "Bartolo",
];

const data = {
  labels,
  datasets: [
    {
      label: "Total Points by Month",
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: "#0be881",
      borderColor: "black",
      borderWidth: 2,
    },
  ],
};

const horizontalData = {
  labels: horizontalLabels,
  datasets: [
    {
      label: "Total Points by Case Manager",
      data: [2, 3, 4, 5, 6, 7, 8],
      backgroundColor: "#0be881",
      borderColor: "black",
      borderWidth: 2,
    },
  ],
};

function Reports() {
  //const [userData, setUserData] = useState({});
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "10px",
          p: 8,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
            flexBasis: 200,
            flexGrow: 1,
            height: 200,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography>Total Points This Month</Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
            }}
          >
            <b>2000</b>
          </Typography>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
            flexBasis: 200,
            flexGrow: 1,
            height: 200,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography>Total Points This Year</Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
            }}
          >
            <b>2000</b>
          </Typography>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
            flexBasis: 200,
            flexGrow: 1,
            height: 200,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography>New Members</Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
            }}
          >
            <b>2000</b>
          </Typography>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
            flexBasis: 200,
            flexGrow: 1,
            height: 200,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography>Total Points Spent This Month</Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
            }}
          >
            <b>2000</b>
          </Typography>
        </Paper>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            p: 1,
            flexBasis: 200,
            flexGrow: 1,
            height: 200,
            bgcolor: "#f5f6fa",
          }}
        >
          <Typography>Total Points Spent This Year</Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: 20,
            }}
          >
            <b>2000</b>
          </Typography>
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 4,
          p: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 1, width: 600, height: 400 }}>
          <Bar options={options} data={data} />
        </Paper>
        <Paper elevation={3} sx={{ p: 1, width: 600, height: 400 }}>
          <Bar options={horizonatlOptions} data={horizontalData} />
        </Paper>
      </Box>
    </>
  );
}

export default Reports;
