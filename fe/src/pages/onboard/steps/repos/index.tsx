import React, { useEffect, useState } from "react";

import dayjs, { Dayjs } from 'dayjs';
// import "../style.scss";
import "./style.scss";
import { Popper, Autocomplete, Button, TextField, MenuItem, Stack, Checkbox, Snackbar, Alert } from "@mui/material";
import { getAllRepo } from "../../../../store/reducer/repoReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store/store";

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const Repositories = (props: { handleNext: ({ repos }: any) => void }) => {
  const isInOnboard = window.location.pathname === '/onboard';
  const [selectedRepos, setSelectedRepos] = useState<{ id: string, name: string }[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [showErr, setShowErr] = useState(false);


  const { repoList } = useSelector((state: any) => state?.repo);
  const { repos } = useSelector((state: any) => state?.profile?.data);

  const onClickNext = () => {
    props.handleNext({
      repos: selectedRepos
    })
  }


  useEffect(() => {
    setSelectedRepos(repoList?.filter((repo: any) => repos.includes(String(repo.id))
    ).map((repo: any) => ({ id: repo.id, name: repo.name })))
  }, [])

  return (
    <Stack spacing={3} className="Steps">

      {isInOnboard && (
        <>

          <div style={{ textAlign: 'center' }}>
            <h3>Your Active Repositories</h3>
            <span>Your selected repositories will be analysed in your dashboard. You can change this list later.</span>
          </div>
          <h4>Please select max 5 Repositories</h4>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={repoList?.map((repo: { id: string, name: string }) => ({ id: repo.id, name: repo.name }))}
            disableCloseOnSelect
            getOptionLabel={(option: { id: string, name: string }) => option?.name}
            isOptionEqualToValue={(option: { id: string, name: string }, value: { id: string, name: string }) => option.id === value.id}
            renderOption={(props, option, { selected }) => {
              return (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option?.name}
                </li>
              )
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Repositories" />
            )}
            value={selectedRepos}
            onChange={(e, values) => {
              console.log(values)
              if (values.length > 5) {
                setShowErr(true);
              } else {
                setSelectedRepos(values)
                setShowErr(false);
              }
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              console.log('newInputValue', newInputValue)
              setInputValue(newInputValue)
            }}
          />
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showErr} autoHideDuration={3000} onClose={() => { setShowErr(false) }}>
            <Alert severity="error">Max 5 Repositories!</Alert>
          </Snackbar>
        </>
      )}
      <Button variant="outlined" onClick={() => { onClickNext() }}>
        Done
      </Button>
    </Stack>

  );
};

export default Repositories;
