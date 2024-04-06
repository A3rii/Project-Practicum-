import { useState } from "react";
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
  Checkbox,
  Box,
  TextField,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

export default function IncomingMatch() {
  /*Popover*/
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  /*Popover*/

  // State variables
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Data Management
  const columns = [
    { id: "name", label: "NAME", minWidth: 150 },
    { id: "court", label: "COURT", minWidth: 100 },
    { id: "booking_hours", label: "BOOKING HOURS", minWidth: 100 },
    { id: "incoming_date", label: "INCOMING DATE", minWidth: 100 },
    { id: "sport_type", label: "SPORT TYPE ", minWidth: 100 },
    { id: "status", label: "STATUS", minWidth: 100 },
  ];

  // Data Management
  function createData(
    name,
    court,
    booking_hours,
    incoming_date,
    sport_type,
    status
  ) {
    return { name, court, booking_hours, incoming_date, sport_type, status };
  }

  const rows = [
    createData("Kimly", "A", 2, "21. April .2024", "football", "Incoming"),
    createData("Vimean", "B", 3, "21. April .2024", "football", "Incoming"),
    createData("Chamroung", "B", 3, "21. April .2024", "football", "Incoming"),
  ];

  // Function to handle selecting all rows
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  // Function to handle toggling individual row selection
  const handleRowSelect = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected = [...selectedRows];

    if (selectedIndex === -1) {
      newSelected.push(index);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedRows(newSelected);
    setSelectAll(newSelected.length === rows.length);
  };

  return (
    <>
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          padding: "15px",
          marginTop: "2rem",
          marginLeft: "2rem",
        }}
        elevation={10}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Typography
            display="flex"
            alignItems="center"
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "14px", fontWeight: "bold" }}>
            Incoming Match
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: "1rem",
            }}>
            <Box sx={{ maxWidth: "100%" }}>
              <TextField
                size="small"
                sx={{ width: "20rem" }}
                label="Search..."
              />
            </Box>

            <FilterAltIcon
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
              style={{
                fontSize: "2rem",
                marginRight: "20px",
                cursor: "pointer",
              }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}>
              {/*Content Filter Here*/}

              <FormControl
                sx={{
                  width: "9rem",
                  height: "9rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <RadioGroup name="radio-buttons-group">
                  <FormControlLabel
                    value="all "
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="incoming"
                    control={<Radio />}
                    label="Incoming"
                  />
                  <FormControlLabel
                    value="done"
                    control={<Radio />}
                    label="Done"
                  />
                </RadioGroup>
              </FormControl>
            </Popover>
          </div>
        </div>

        <Divider />

        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0
                ? "No Incoming Matches"
                : rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onChange={() => handleRowSelect(index)}
                        />
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.name}
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.court}
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.booking_hours}
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.incoming_date}
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.sport_type}
                      </TableCell>
                      <TableCell align="left" style={{ minWidth: "100px" }}>
                        {row.status}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
