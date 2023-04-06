import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRepo, getRepoGoal } from "../../store/reducer/repoReducer";
import { getAllRepoCommits, selectRepo } from "../../store/reducer/dashReducer";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router";
import "./style.scss";
import { Collapse, Drawer } from "@mui/material";
import { Stack } from "@mui/system";

const Projects = () => {
  const [isDrawer, setIsDrawer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    allDashData,
  } = useSelector((state: any) => state.repo);

  // useEffect(() => {
  //   if (isEmpty(allDashData)) {
  //     dispatch(getRepoGoal());
  //   }
  // }, []);

  return (
    <div className="projectsbar">
      <Collapse orientation="horizontal" in={isDrawer}>

        <Stack className="projectsbar-wrap">
          <button className="repo-button repo-button-main" onClick={() => { dispatch(selectRepo({})) }}>
            <span>All Repository</span>
            {allDashData?.length ? (
              <div className="vert-line" style={{ height: allDashData?.length * 58 - 26 }}></div>
            ) : ''}
          </button>
          {allDashData?.map((repo: any, index: number) => (
            <Stack direction={'row'} alignItems="center" justifyContent={"center"}>
              <div className="mini-circle"></div>
              <button
                className="repo-button repo-button-sub"
                onClick={() => {
                  dispatch(getAllRepoCommits(repo));
                }}
              >
                {repo.name}
              </button>
            </Stack>
          ))}
          {/* <a className="repo-button repo-button-main" href="journal">
            <span>Today's Journal</span>
          </a> */}
        </Stack>
      </Collapse>
      <div className="projectsbar-toggle">
        <div className="projectsbar-toggle-bar" onClick={() => setIsDrawer((prevState) => !prevState)} />
        <button className="projectsbar-toggle-btn" onClick={() => setIsDrawer((prevState) => !prevState)}>
          <p>{isDrawer ? '<' : '>'}</p>
        </button>
      </div>
    </div >
  );
};

export default Projects;
