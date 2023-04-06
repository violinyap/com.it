import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRepo } from "../../../store/reducer/repoReducer";

const Commits = () => {
  const dispatch = useDispatch();
  const { selectedRepo, commits } = useSelector((state) => state.dash);

  return (
    <div className="commitsbar">
      <h3>Commits for: {_.get(selectedRepo, "name")}</h3>
      <div>
        {commits.map((commit) => {
          const commitDate = _.get(commit, "commit.author.date");

          return (
            <div className="commitbox">
              <p style={{ flex: 3 }}>{_.get(commit, "commit.message")}</p>
              <p style={{ flex: 1 }}>{_.get(commit, "commit.author.name")}</p>
              <p style={{ flex: 1 }}>{new Date(commitDate).toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Commits;
