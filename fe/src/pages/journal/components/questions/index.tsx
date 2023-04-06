
import { Button, Checkbox, MenuItem, TextField } from '@mui/material';
import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { Stack } from "@mui/system";
import React from "react";
import './style.scss';

interface JournalQuestionsProps {
  seq: number;
  questions: {
    qs: string;
    sub?: string;
    type: string; //'scale' | 'input' | 'yesno';
    scaleText?: {
      low: string;
      high: string;
    };
    options?: string[];
  };
  val: any;
  saveAnswer: (values: any) => void;
}

const journalBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const JournalSlider = styled(Slider)(({ theme }) => ({
  color: '#B0FF4D',
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: journalBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: journalBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 24,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 15,
    width: 15,
    borderRadius: 20,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

const JournalQuestions: React.FC<JournalQuestionsProps> = ({ questions, saveAnswer, val }) => {
  const marks = [
    {
      value: 0,
      label: <div><p>0</p><p>{questions?.scaleText?.low}</p></div>,
    },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    {
      value: 10,
      label: <div><p>10</p><p>{questions?.scaleText?.high}</p></div>,
    },
  ]
  return (
    <div className="JournalQuestionsPage">
      <Stack className="JournalQuestionsPage__ques" gap={3} flexDirection={'column'} alignItems="center" justifyContent={'center'}>
        <h2 style={{ marginBottom: 40 }}>{questions.qs}</h2>
        <h4>{questions.sub}</h4>
        {questions.type === 'scale' && (
          <JournalSlider
            aria-label="journal scale"
            marks={marks}
            step={1} min={0} max={10}
            valueLabelDisplay="on"
            value={val || 0}
            onChange={(e, value) => { saveAnswer(value) }}
          />
        )}
        {questions.type === 'input' && (
          <TextField sx={{ width: 700 }} value={val} onChange={(e) => { saveAnswer(e?.target?.value) }} />)}
        {questions.type === 'multi' && (
          <TextField
            select
            label="Select answer(s)"
            SelectProps={{ multiple: true }}
            fullWidth
            value={val || []}
            onChange={(e) => { saveAnswer(e.target.value) }}
          >
            {questions?.options?.map((opt: string, idx: number) => (
              <MenuItem key={idx} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        )}

        {questions.type === 'yesno' && (
          <Stack direction={'row'}>

            <Button variant="outlined" className={`primaryButton ${val == 'yes' && 'primaryButton-selected'}`} onClick={() => { saveAnswer('yes') }}>
              <Checkbox checked={val == 'yes'} /> Yes
            </Button>

            <Button variant="outlined" className={`primaryButton ${val == 'no' && 'primaryButton-selected'}`} onClick={() => { saveAnswer('no') }}>
              <Checkbox checked={val == 'no'} /> No</Button>
          </Stack>
        )}
      </Stack>

    </div >
  )
}

export default JournalQuestions;