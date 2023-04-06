import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatsCard from "../../components/statsCard";
import { LinearProgress, Select, Skeleton, Stack, MenuItem, Grow, Alert } from "@mui/material";
import "./style.scss";
import Sidebar from "../../components/sidebar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BubbleChart from "./components/bubblechart";
import InfoCard from "../../components/infoCard";
import LineChart from "./components/linechart";
import ColumnChart from "./components/columnchart";
import AllRepos from "./all";
import { selectRepo, updatePeriod } from "../../store/reducer/dashReducer";
import { getAllRepoForDashboard, getRepoGoal } from "../../store/reducer/repoReducer";
import { AppDispatch } from "../../store/store";
import { GitHub } from "@mui/icons-material";
import { getProfileGoal } from "../../store/reducer/profileReducer";
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

const RepoSummary = () => {
  const [chartType, setChartType] = useState<string>('time');
  // const [period, setPeriod] = useState('3m');

  const {
    commitData: data,
    selectedRepo,
    loadingData,
    period
  } = useSelector((state: any) => state.dash);

  const {
    savingRepo,
    repoList
  } = useSelector((state: any) => state.repo);

  const {
    wdays = [],
    wstart,
    wend
  } = useSelector((state: any) => state.profile.data);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!savingRepo) {
      dispatch(getRepoGoal());
      dispatch(getAllRepoForDashboard());
    }
  }, [savingRepo]);

  useEffect(() => {
    if (!wstart || !wend) {
      dispatch(getProfileGoal());
    }
  }, [wstart, wend])

  return (
    <div className="dashboard">
      <div className="dashboard__sidebar">
        <Sidebar />
      </div>

      {selectedRepo?.name ? (
        <div className="summary">
          <h2 style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>

            <button className="button-none" onClick={() => { dispatch(selectRepo({})) }}>
              <ArrowBackIosIcon />{" "}
            </button>{" "}
            {selectedRepo?.name ?? "All"} Project Summary
            {selectedRepo?.name && (
              <a href={selectedRepo?.html_url} style={{ marginLeft: 8 }} target="_blank">
                <GitHub />
              </a>
            )}

            {/* <Select
              className="round-select"
              value={period}
              onChange={(e) => dispatch(updatePeriod(e.target.value))}
            >
              <MenuItem value={'3m'}>3 months</MenuItem>
              <MenuItem value={'1m'}>1 month</MenuItem>
              <MenuItem value={'2w'}>2 weeks</MenuItem>
            </Select> */}
          </h2>

          {!loadingData && !_.isEmpty(data) ? (
            <div className="summary-wrap">
              {data.total > 0 ? (
                <Alert severity="warning">
                  {data.extra.overper > 20 ? 'Are you overworking yourself? ' : 'Keep up your work life balance! '}
                  <span className={data.extra.overper > 20 ? "red" : "neon"}>{data.extra.overper}%</span> commits were made outside your working hours – {wdays.join(', ')} {'('}{wstart} - {wend}{')'}
                </Alert>
              ) : (
                <Alert severity="error">
                  You don't have any commit in this period
                </Alert>
              )}
              <Stack direction="row" gap={2} sx={{ marginTop: 1 }}>
                <Stack justifyContent={"space-between"} style={{ flex: 4 }}>
                  <Grow in={!loadingData} {...(!loadingData ? { timeout: 1000 } : {})}>
                    <div className="summary-wrap-graph">
                      <Select
                        className="graph-select-type"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                      >
                        <MenuItem value={'time'}>By Time</MenuItem>
                        <MenuItem value={'day'}>By Day</MenuItem>
                        <MenuItem value={'files'}>By Files</MenuItem>
                      </Select>
                      {chartType === 'files' && (
                        <BubbleChart data={data.fileGraph ? _.cloneDeep(data.fileGraph) : []} width={720} height={450} tfield={'fileShort'} vfield="commits" />
                      )}
                      {chartType === 'time' && (
                        <LineChart data={data.timeGraph} xField={"time"} yField={"commits"} width={700} height={380} />
                      )}
                      {chartType === 'day' && (
                        <ColumnChart data={data.dayGraph} xField={"day"} yField={"commits"} width={700} height={380} />
                      )}
                    </div>
                  </Grow>
                  <Grow
                    in={!loadingData}
                    {...(!loadingData ? { timeout: 4000 } : {})}
                  >
                    <Stack direction={"row"} gap={2} sx={{ marginTop: 2 }} justifyContent="space-between">
                      <InfoCard
                        title={"Total commits in the period"}
                        value={data.total ?? 0}
                        subtext={`Commits`}
                      />
                      <InfoCard
                        title={"Total branches"}
                        value={data.branch?.length ?? "-"}
                        subtext={`Branches`}
                      />
                      <InfoCard
                        title={"Issues closed"}
                        value={`${data.issueClosed ?? 0}`}
                        subvalue={`/${data.issues.length}`}
                        subtext={`Issues`}
                      />
                    </Stack>
                  </Grow>
                </Stack>
                {data.total > 0 && (
                  <Grow
                    in={!loadingData}
                    {...(!loadingData ? { timeout: 2000 } : {})}
                  >
                    <Stack direction={"column"} gap={2} style={{ flex: 1 }}>
                      <StatsCard
                        title={"Your most commit in"}
                        value={data?.fav_day?.day}
                        subtext={`Seems like you love ${data?.fav_day?.day} so much.`}
                        style={{ flex: 1 }}
                      />
                      <StatsCard
                        title={"Average addition/ commit"}
                        value={data?.avg_stats?.additions}
                        subtext={"Keep the size under 300 lines."}
                        style={{ flex: 1 }}
                      />
                      <StatsCard
                        title={"Average deletion/ commit"}
                        value={data?.avg_stats?.deletions}
                        subtext={"Are you doing a lot of bugfix/ refactoring?"}
                        style={{ flex: 1 }}
                      />
                    </Stack>
                  </Grow>
                )}
                <Grow
                  in={!loadingData}
                  {...(!loadingData ? { timeout: 3000 } : {})}
                >
                  <Stack gap={2} className="summary-col" style={{ flex: 1 }}>
                    {data?.commit_types?.length > 0 ? (
                      <div>
                        <p className="summary-title">Top Commit Types</p>
                        {data?.commit_types?.map(
                          (commit: CommitTypes, index: number) => (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 10,
                              }}
                              key={`type-${commit.type}`}
                            >
                              <div className="circle">{index + 1}</div>
                              <span>{commit.type}</span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="summary-title">No commit yet</p>
                    )}
                    {data?.languages?.length > 0 && (
                      <div>
                        <p className="summary-title">Top Languages Used</p>
                        {_.chain(data?.languages)
                          .sortBy('percent')
                          .reverse()
                          .map(
                            (lang: Languages, index: number) =>
                              index < 5 && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 10,
                                  }}
                                  key={`type-${lang.lang}`}
                                >
                                  <div className="circle circle-oval">
                                    {lang.percent}%
                                  </div>
                                  <span>{lang.lang}</span>
                                </div>
                              )
                          )
                          .value()}
                      </div>
                    )}
                  </Stack>
                </Grow>
              </Stack>

            </div>
          ) : (
            // Skeleton loading while fetching
            <div>
              <LinearProgress />
              <Stack direction="row" gap={2} sx={{ marginTop: 3 }}>
                <Stack>
                  <Skeleton variant="rounded" width={750} height={500} />
                  <Stack direction={"row"} gap={2} sx={{ marginTop: 2 }} justifyContent="space-between">
                    <Skeleton variant="rounded" height={100} style={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={100} style={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={100} style={{ flex: 1 }} />
                  </Stack>
                </Stack>
                <Stack direction={"column"} gap={2} style={{ flex: 1 }}>
                  <Skeleton variant="rounded" width={'100%'} style={{ flex: 1 }} />
                  <Skeleton variant="rounded" width={'100%'} style={{ flex: 1 }} />
                  <Skeleton variant="rounded" width={'100%'} style={{ flex: 1 }} />
                </Stack>
                <Stack gap={2} style={{ flex: 1 }}>
                  <Skeleton variant="rounded" width={'100%'} style={{ flex: 1 }} />
                </Stack>
              </Stack>

            </div>
          )}
        </div >
      ) : (
        <AllRepos />
      )
      }
    </div >
  );
};

export default RepoSummary;
