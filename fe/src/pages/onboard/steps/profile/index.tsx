import React, { useState } from "react";
import "../style.scss";
import { Button, TextField, MenuItem, Stack } from "@mui/material";
import { OnboardDataType } from "../../../../store/types";
import { useSelector } from "react-redux";


const Profile = (props: { handleNext: (currInput: OnboardDataType) => void }) => {
  const onboardData = useSelector((state: any) => state?.profile?.data)
  const [birthdate, setBirthdate] = React.useState<string | ''>(onboardData?.bday ?? '');
  const [mbti, setMbti] = useState(onboardData?.mbti ?? 'ENTJ');

  const handleChange = (newValue: string | '') => {
    setBirthdate(newValue);
  };

  const onClickNext = () => {
    props.handleNext({
      bday: birthdate,
      mbti: mbti
    })
  }

  const options = [['E', 'I'], ['N', 'S'], ['T', 'F'], ['P', 'J']];
  return (
    <Stack spacing={3} className="Steps">
      <h3>Your Birthday</h3>
      <TextField
        placeholder="DD/MM/YYYY"
        value={birthdate}
        onChange={(e) => handleChange(e.target.value)}
        type={'date'}
        className="input-field input-field-standard"
      >
      </TextField>
      <h3>Your MBTI</h3>
      <div className="Steps__Multiopt">
        {options.map((opts, index) => (
          <TextField
            select
            value={mbti[index]}
            key={`opt-${index}`}
            onChange={(e) => {
              let newMbti = mbti.replace(mbti[index], e.target.value);
              setMbti(newMbti)
            }}
            className="input-field mbti-field"
          >
            {opts.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

        ))}
      </div>

      <Button variant="outlined" onClick={() => onClickNext()}>
        Next
      </Button>
    </Stack>

  );
};

export default Profile;
