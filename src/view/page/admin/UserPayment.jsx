import {
  Paper,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Replay as ReplayIcon,
  FilterList as FilterListIcon,
  IosShare as IosShareIcon,
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function UserPayment() {
  return (
    <>
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          padding: "15px",
          marginLeft: "2rem",
          border: 0,
          borderTop: 0,
          borderRadius: 0,
        }}
        elevation={0}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
            }}>
            <ReplayIcon sx={{ cursor: "pointer" }} />

            <TextField size="small" label="Search" />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                sx={{ width: 150 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{ cursor: "pointer", fontWeight: "bold" }}>
              <FilterListIcon />
              <Typography>Filter</Typography>
            </Stack>
          </div>
          <Tooltip title={"Export report"}>
            <Button variant="contained" startIcon={<IosShareIcon />}>
              Export
            </Button>
          </Tooltip>
        </div>

        <Divider />

        <TableContainer style={{ height: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Currency</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
