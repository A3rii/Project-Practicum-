import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function SetTime() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [open, setOpen] = React.useState(true);
  const [close, setClose] = React.useState(false);
  const [toogleModal, setToogleModal] = React.useState(false);



  const handleOnClose = () => {
    setClose(!close);
    setToogleModal(!toogleModal);
    setOpen(!open);
  };

  const handleOnOpen = () => {
    setClose(!close);
    setOpen(!open);
  };

  return (
    <>
      <div className="setTime-title">
        <h4>Sport Center Time Management </h4>
        <div className="setTime-switchBtn">
          <FormControlLabel
            sx={{
              display: 'block',
            }}
            control={
              <Switch
                checked={open}
                onChange={() => handleOnOpen()}
                name="open"
                color="primary"
              />
            }
            label="Open"
          />

          <FormControlLabel
            sx={{
              display: 'block',
            }}
            control={
              <Switch
                checked={close}
                onChange={() => handleOnClose()}
                name="close"
                color="primary"
              />
            }
            label="Close"
          />
          {toogleModal && <AskingModal onClose={() => setToogleModal(false)} />}
        </div>
      </div>

      {daysOfWeek.map((day, index) => (
        <div className="set-openingTime" key={index}>
          <label className="day-label">{day}</label>
          <div className="setTime-control">
            <FormControlDay time_description="Open" />
            -
            <FormControlDay time_description="Close" />
          </div>
        </div>
      ))}

      <div className="setTime-btn-action">
        <button type='button' className='setTime-reset'>Reset</button>
        <button type='button' className='setTime-save'>Save</button>
      </div>
    </>
  );
}

// eslint-disable-next-line react/prop-types
const FormControlDay = ({ time_description }) => {
  const [time, setTime] = React.useState('');

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const formatAmPm = formattedHour >= 12 ? 'pm' : 'am';
        const timeValue = `${formattedHour}:${formattedMinute} ${formatAmPm}  `;
        timeOptions.push({ value: timeValue, label: timeValue });
      }
    }
    return timeOptions;
  };

  const timeOptions = generateTimeOptions();

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">{time_description}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={time}
        label="Time"
        onChange={handleChange}
      >
        <MenuItem value="">None</MenuItem>
        {timeOptions.map((option, index) => (
          <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// eslint-disable-next-line react/prop-types
function AskingModal({ onClose }) {
  return (
    <Modal className="setTime-modal" show={true} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Comfirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to close your sport center ?  </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>  Close </Button>
        <Button variant="primary" onClick={onClose}>  Save Change </Button>

      </Modal.Footer>
    </Modal>
  );
}
