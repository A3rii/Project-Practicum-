import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function DatePicker() {
   const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));

   return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
         <DemoContainer components={['TimePicker', 'TimePicker']}>
            <TimePicker
               label="From"
               className='sport-timePicker'
            />
            <TimePicker
               label="Till"
               onChange={(newValue) => setValue(newValue)}
               className='sport-timePicker'
            />
         </DemoContainer>
      </LocalizationProvider>
   );
}