import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getAllRepo = createAsyncThunk(
  "repos/getAllRepos",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/repos/all", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);

export const getRepoGoal = createAsyncThunk(
  "repos/getRepoGoal",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/repos/goal", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);

export const getAllRepoForDashboard = createAsyncThunk(
  "dash/getAllRepoForDashboard",
  async (args, thunkAPI: any) => {
    const userData = thunkAPI.getState()?.user?.user;

    const response = await axios.get("http://localhost:10801/repos/dash", {
      params: {
        uid: _.get(userData, "id"),
        author: _.get(userData, "login"),
      },
    });
    console.log("response", response);
    return response.data;
  }
);

export const saveRepoGoal = createAsyncThunk(
  "repos/saveRepoGoal",
  async (data: any, thunkAPI: any) => {
    console.log("repos/saveRepoGoal", data);
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.post("http://localhost:10801/onboard/repos", {
      uid,
      repos: data.map((repo: any) => repo.id).join(','),
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const repoSlice = createSlice({
  name: "repo",
  initialState: {
    repoList: [],
    allDashData: [],
    compiledData: {},
    loadingData: false,
    loadRepo: false,
    loadRepoList: false,
    savingRepo: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRepo.pending, (state, action) => {
      state.loadRepoList = true;
    });
    builder.addCase(getAllRepo.fulfilled, (state, action) => {
      console.log("getAllRepo.fulfilled", action.payload);
      state.repoList = action.payload.data;
      state.loadRepoList = false;
    });

    builder.addCase(getRepoGoal.pending, (state, action) => {
      state.loadRepo = true;
    });
    builder.addCase(getRepoGoal.fulfilled, (state, action) => {
      console.log("getRepoGoal.fulfilled action.payload", action.payload);
      state.allDashData = action.payload.data;
      state.loadRepo = false;
    });

    builder.addCase(saveRepoGoal.pending, (state, action) => {
      state.savingRepo = true;
    });
    builder.addCase(saveRepoGoal.fulfilled, (state, action) => {
      console.log("saveRepoGoal.fulfilled action.payload", action.payload);
      state.savingRepo = false;
    });


    builder.addCase(getAllRepoForDashboard.pending, (state, action) => {
      state.loadingData = true;
    });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getAllRepoForDashboard.fulfilled, (state, action) => {
      // Add user to the state array
      console.log("getAllRepoForDashboard.fulfilled", action.payload);
      const allRepos = action.payload?.data;
      state.allDashData = allRepos;

      const languagesCount: { [key: string]: number } = {};
      let totalLang = 0;
      const msgCount: { [key: string]: number } = {};
      const comData = {
        allAdd: 0,
        allDel: 0,
        commit_count: 0,
        open_issue: 0,
        open_pr: 0,
      };

      allRepos?.forEach((repo: any) => {
        const data = repo.commit_data;
        comData.commit_count += data.commit_count ?? 0;
        comData.allAdd += data.all_stats.additions ?? 0;
        comData.allDel += data.all_stats.deletions ?? 0;
        comData.open_issue += repo.open_issues_count ?? 0;
        comData.open_pr += repo.pulls.filter((pull: any) => pull.state === "open")?.length ?? 0;

        for (const [key, value] of Object.entries(data.commit_types)) {
          msgCount[key] = (msgCount[key] ?? 0) + Number(value);
        }

        data.languages?.forEach((lang: { lang: string, size: number }) => {
          languagesCount[lang.lang] =
            (languagesCount[lang.lang] ?? 0) + lang.size;
          totalLang += lang.size;
        });
      });

      state.compiledData = {
        avgAdd: Math.round(comData.allAdd / comData.commit_count ?? 0),
        avgDel: Math.round(comData.allDel / comData.commit_count ?? 0),
        commit_types: Object.keys(msgCount)
          .map((key) => ({
            type: key,
            count: msgCount[key],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        languages: Object.keys(languagesCount)
          .map((key) => ({
            lang: key,
            count: languagesCount[key],
            percent: ((languagesCount[key] * 100) / totalLang).toFixed(1),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        repo_count: action.payload?.repo_count,
        open_issue: comData.open_issue,
        commit_count: comData.commit_count,
        open_pr: comData.open_pr
      };
      state.loadingData = false;
    });
  },
});

export default repoSlice.reducer;
