import _ from "lodash";
import "./style.scss"
import React, { useEffect, useState } from "react";
import StatsCard from "../../components/statsCard";
import { LinearProgress, Stack, CircularProgress, Grow, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, Autocomplete, Checkbox, TextField, Alert, Snackbar } from "@mui/material";
import InfoCard from "../../components/infoCard";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllRepoCommits, selectRepo } from "../../store/reducer/dashReducer";
import { Edit } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { getAllRepo, saveRepoGoal } from "../../store/reducer/repoReducer";
import AvaBalance from '../../assets/ava_balance.png'

interface CommitTypes {
  type: string;
  count: number;
  percent: number;
}
interface Languages {
  lang: string;
  size: number;
  percent: number;
}

interface RepoStats {
  productivity: number;
  fav_day: {
    day: string,
    commits: number,
  };
  avg_stats: {
    additions: number,
    deletions: number,
  };
  commit_types: CommitTypes[];
  languages: Languages[];
  time_commit: {
    [key: string]: number,
  };
  all_stats: {
    additions: number,
    deletions: number,
  };
  date_commit: {
    [key: string]: number,
  };
}

const AllRepos = () => {
  const {
    allDashData,
    compiledData: data,
    loadingData,
    loadRepo,
    savingRepo,
    repoList, loadRepoList
  } = useSelector((state: any) => state.repo);

  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedRepos, setSelectedRepos] = useState<any>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [showErr, setShowErr] = useState(false);


  const openEditModal = () => {
    setSelectedRepos(allDashData?.map((repo: any) => ({ id: repo.id, name: repo.name })))
    setShowModal(true)
  };


  const saveRepoChanges = async () => {
    await dispatch(saveRepoGoal(selectedRepos));
    setShowModal(false)
  };

  useEffect(() => {
    if (_.isEmpty(repoList)) {
      dispatch(getAllRepo());
    }
  }, [])


  return (
    <div className="summary">
      <h2 style={{ marginBottom: 20, marginLeft: 10, display: 'flex', alignItems: 'center' }}>
        All Project Summary
        <button className="button-none" onClick={() => { openEditModal() }}>
          <Edit />
        </button>
      </h2>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showErr} autoHideDuration={3000} onClose={() => { setShowErr(false) }}>
        <Alert severity="error">Max 5 Repositories!</Alert>
      </Snackbar>

      {showModal && (
        <Dialog
          open={showModal}
          onClose={() => { setShowModal(false) }}
          style={{ padding: 20 }}
        >
          <DialogContent>
            <h3>Edit your repository selection</h3>
            <p>Please select max 5 Repositories</p>
            <br />
            <Autocomplete
              style={{ margin: '10px 0', width: 500 }}
              multiple
              options={repoList?.map((repo: any) => ({ id: repo.id, name: repo.name }))}
              disableCloseOnSelect
              disabled={savingRepo}
              loading={loadRepoList}
              loadingText={"Fetching your repos..."}
              noOptionsText={"Sorry you don't have any repo:("}
              getOptionLabel={(option: { name: string }) => option?.name}
              isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
              renderOption={(props, option: { name: string, id: number }, { selected }) => {
                return (
                  <li {...props} key={option?.id}>
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
              renderInput={(params) => (
                <TextField {...params} label="Repositories" />
              )}
              value={selectedRepos ?? []}
              onChange={(e, values: any) => {
                if (values.length > 5) {
                  setShowErr(true);
                } else {
                  setSelectedRepos(values)
                  setShowErr(false);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowModal(false) }} disabled={savingRepo}>Cancel</Button>
            <Button variant={"outlined"} onClick={() => { saveRepoChanges() }} autoFocus disabled={savingRepo}>
              Confirm&nbsp;{savingRepo && (<CircularProgress size={15} />)}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {loadRepo ? (
        // Skeleton loading while fetching
        <div>
          <LinearProgress color="success" />
        </div>
      ) : !allDashData?.length ? (
        <div className="centerpage">
          <h3>You have not added any repositories. <br />Add from your GitHub to view your summary!</h3>
          <Button variant={"outlined"} onClick={() => { openEditModal() }} style={{ width: '30%', marginTop: 10 }}>Add repository</Button>
        </div>
      ) : (
        <div className="summary-wrap">
          <Stack direction="row" gap={2} sx={{ marginTop: 3 }}>
            <Stack gap={2} style={{ flex: 4 }} justifyContent="space-between">
              <Stack gap={2} >
                {allDashData?.map((repo: any, index: number) => (
                  <button className="button-none  repo-list-item" onClick={() => { dispatch(getAllRepoCommits(repo)); }}>
                    <Stack direction={"row"} key={`repos-${index}`} justifyContent="space-around" className="repo-list" alignItems={"center"}>
                      <p style={{ flex: 1 }}>{index + 1}</p>
                      <p style={{ flex: 5 }} className={"neon repo-list-name"}>{repo.name}</p>
                      <p style={{ flex: 2 }} className="repo-detail">{loadingData ? '-' : repo.commit_data.commit_count} <small>Commits</small></p>
                      <p style={{ flex: 2 }} className="repo-detail">{loadingData ? '-' : repo.branches_count} <small>Branches</small></p>
                      <p style={{ flex: 2 }} className="repo-detail">{repo.open_issues_count} <small>Open Issues</small></p>
                      <p style={{ flex: 2 }} className="repo-detail">{loadingData ? '-' : repo.pulls?.length ?? 0} <small>Pull Requests</small></p>
                    </Stack>
                  </button>
                ))}
                {
                  allDashData?.length < 5 && (
                    [1, 2, 3, 4, 5].map((count, index) => {

                      if (count + allDashData?.length < 5) {
                        return (
                          <Stack direction={"row"} gap={1} key={`empty-repos-${index}`} justifyContent="space-around" className="repo-list repo-list-empty">
                            <p style={{ flex: 1 }}>...</p>
                          </Stack>
                        )
                      } else if (count + allDashData?.length === 5) {
                        return (
                          <button className="button-none" onClick={() => { openEditModal() }}>
                            <Stack direction={"row"} gap={1} key={`empty-repos-${index}`} justifyContent="space-around" className="repo-list repo-list-add">
                              <p style={{ flex: 1 }}>Add up to 5 repos +</p>
                            </Stack>
                          </button>
                        )
                      }

                    })
                  )
                }
              </Stack>
              <Stack direction={"row"} gap={2} sx={{ marginTop: 2 }} justifyContent="flex-start">
                <InfoCard
                  title={"Repositories"}
                  value={loadingData ? <CircularProgress /> : data?.repo_count}
                  subtext={`Total Repositories`}
                />
                <InfoCard
                  title={"Open Pull Requests"}
                  value={loadingData ? <CircularProgress /> : data?.open_pr}
                  subtext={`Code Review`}
                />
                <InfoCard
                  title={"Open Issues"}
                  value={loadingData ? <CircularProgress /> : data?.open_issue}
                  subtext={`Current Tasks`}
                />
              </Stack>
            </Stack>
            {loadingData ? (
              <Stack justifyContent={'center'} gap={2} alignItems="center" style={{ flex: 1 }}>
                <img src={AvaBalance} height={150} className="loadingava" />
                <span>loading...</span>
                {/* <CircularProgress /> */}
              </Stack>
            ) : (
              <>
                <Grow in={!loadingData}>
                  <Stack direction={"column"} gap={2} style={{ flex: 1 }}>
                    <StatsCard
                      title={"Total Commits"}
                      value={data?.commit_count}
                      subtext={"Striving there!"}
                      style={{ flex: 1 }}
                    />
                    <StatsCard
                      title={"Average addition/ commit"}
                      value={data?.avgAdd}
                      subtext={"Nice commit size."}
                      style={{ flex: 1 }}
                    />
                    <StatsCard
                      title={"Average deletion/ commit"}
                      value={data?.avgDel}
                      subtext={"Are you doing a lot of bugfix/ refactoring?"}
                      style={{ flex: 1 }}
                    />
                  </Stack>
                </Grow>
                <Grow in={!loadingData}>
                  <div className="summary-col" style={{ flex: 1 }}>
                    <span className="summary-title">Top Commit Types</span>
                    {data?.commit_types?.map(
                      (commit: CommitTypes, index: number) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <div className="circle">{index + 1}</div>
                          <span>{commit.type}</span>
                        </div>
                      )
                    )}
                    <br />
                    {data?.languages && (
                      <>
                        <span className="summary-title">Top Languages Used</span>
                        {_.chain(data?.languages)
                          .map(
                            (lang: any, index: number) =>
                              index < 5 && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 10,
                                  }}
                                >
                                  <div className="circle circle-oval">
                                    {lang.percent}%
                                  </div>
                                  <span>{lang.lang}</span>
                                </div>
                              )
                          )
                          .value()}
                      </>
                    )}
                  </div>
                </Grow>
              </>
            )}
          </Stack>

        </div>
      )}
    </div>
  );
};

export default AllRepos;
