import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Button from "@mui/material/Button";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

const locales = {
  "en-US": import("date-fns/locale/en-US"),
};

async function getLocale() {
  const locale = await locales["en-US"];
  return locale.default;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: getLocale(),
});

//TODO:   set Date to  start :new Date(date , start_time)  , timeEnd :new Date(date , end_time)
//TODO:   start Date and end Date is the same

export default function Schedule() {
  const [allEvents, setAllEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: null,
    end: null,
  });
  const [firstSlot, setFirstSlot] = useState(null);
  const [secondSlot, setSecondSlot] = useState(null);

  const handleStartDate = (start) => {
    const getStartDate = new Date(start);
    console.log(getStartDate);
    setStartDate(getStartDate);
  };

  function handleAddEvent() {
    console.log(newEvent);
    const formattedEvent = {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };

    setAllEvents([...allEvents, formattedEvent]);
    console.log(allEvents);

    // Reset form fields
    setStartDate(null);
    setNewEvent({ title: "", start: null, end: null });
    setFirstSlot(null);
    setSecondSlot(null);
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="calendar">
      <div>
        <Button
          startIcon={<AddIcon />}
          sx={{ marginLeft: "3rem" }}
          variant="contained"
          onClick={handleOpen}>
          Add Events
        </Button>
        <Modal
          keepMounted
          open={open}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 300,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "5px",
            }}>
            <Typography
              gutterBottom
              sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Create An Event
            </Typography>
            <Divider />

            {/** Date Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.5rem",
                marginTop: ".5rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <TextField
                    sx={{ width: 260 }}
                    InputProps={{
                      endAdornment: (
                        <AccountBoxIcon style={{ color: "#888" }} />
                      ),
                    }}
                    label="Enter Name"
                    variant="outlined"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                  <DatePicker
                    label="Pick Date"
                    value={startDate}
                    onChange={(start) => handleStartDate(start)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>

            {/** Time Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker", "TimePicker"]}>
                  <TimePicker
                    label="Start Time"
                    reduceAnimations={true}
                    value={firstSlot}
                    ampm={true}
                    onChange={(newValue) => {
                      setFirstSlot(newValue);
                      const hour = newValue.hour();
                      const minute = newValue.minute();
                      setNewEvent({
                        ...newEvent,
                        start: new Date(
                          startDate.getFullYear(),
                          startDate.getMonth(),
                          startDate.getDate(),
                          hour,
                          minute,
                          0
                        ),
                      });
                    }}
                  />
                  <TimePicker
                    label="End Time"
                    value={secondSlot}
                    reduceAnimations={true}
                    ampm={true}
                    onChange={(newValue) => {
                      setSecondSlot(newValue);
                      const hour = newValue.hour();
                      const minute = newValue.minute();
                      setNewEvent({
                        ...newEvent,
                        end: new Date(
                          startDate.getFullYear(),
                          startDate.getMonth(),
                          startDate.getDate(),
                          hour,
                          minute,
                          0
                        ),
                      });
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Divider sx={{ margin: "1rem 0" }} />
            <Box
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem",
              }}>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleAddEvent}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <Calendar
        defaultView={Views.DAY}
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        timeSlot={5}
        style={{ height: 500, margin: "50px" }}
      />
    </div>
  );
}
