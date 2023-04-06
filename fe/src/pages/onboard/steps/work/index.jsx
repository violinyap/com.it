import React, { useState } from "react";

import "../style.scss";
import "../../style.scss";
import { Popper, Box, Button, TextField, MenuItem, Stack, Autocomplete, Checkbox, Slider, Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";

const Work = (props) => {
  
  const onboardData = useSelector((state) => state?.profile?.data)
  const workDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const [wdays, setWdays] = useState(onboardData?.wdays ?? workDays.slice(0, 5));
  const [wtimeStart, setWtimeStart] = useState(onboardData?.wstart ?? '07:30');
  const [wtimeEnd, setWtimeEnd] = useState(onboardData?.wend ?? '18:00');
  const [prodLevel, setProdLevel] = useState(onboardData?.productivity ?? 8);
  const [stressLevel, setStressLevel] = useState(onboardData?.stress ?? 2);
 
  const onClickNext = () => {
    props.handleNext({
      wdays,
      wstart: wtimeStart,
      wend: wtimeEnd,
      productivity: prodLevel,
      stress: stressLevel,
    })
  }

  return (
    <Stack spacing={3} className="Steps">
      <h3>Your Ideal Working Schedule</h3>
      <TextField
        select
        placeholder="Select workday"
        label="Day"
        SelectProps={{ multiple: true }}
        fullWidth
        value={wdays}
        onChange={(e) => { setWdays(e.target.value) }}
        className="input-field input-field-standard"
      >
        {workDays.map((day) => (
          <MenuItem key={day} value={day}>
            {day}
          </MenuItem>
        ))}
      </TextField>
      <div className="Steps__Multiopt">
        <TextField
          id="time"
          label="Start"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          sx={{ width: 150 }}
          value={wtimeStart}
          onChange={(e) => { setWtimeStart(e.target.value);}}
        />
        <TextField
          id="time"
          label="End"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          sx={{ width: 150 }}
          value={wtimeEnd}
          onChange={(e) => { setWtimeEnd(e.target.value);}}
        />

      </div>
      <h3>Set Your Goals</h3>

      <Stack spacing={2} direction="row" sx={{ width: '100%' }} alignItems="center">
        <h4>Productivity</h4>
        <Slider 
          value={prodLevel}
          onChange={(e) => { setProdLevel(e.target.value);}} 
          step={1} marks min={0} max={10}  
          valueLabelDisplay="auto"/>
        <h4>{prodLevel}</h4>
      </Stack>

      <Stack spacing={2} direction="row" sx={{ width: '100%' }} alignItems="center">
        <h4>Stress</h4>
        <Slider 
          value={stressLevel}
          onChange={(e) => { setStressLevel(e.target.value);}} 
          step={1} marks min={0} max={10}  
          valueLabelDisplay="auto"/>
        <h4>{stressLevel}</h4>
      </Stack>

      


      <Button variant="outlined" onClick={onClickNext}>
        Next
      </Button>
    </Stack>

  );
};

export default Work;
