import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CommitRaw {
  commit: {
    message: string;
    author: {
      date: string;
    },
  },
  stats: {
    additions: number;
    deletions: number;
  },
  files: any[];
}

interface CommitData {
  id: string;
  message: string;
  add: number;
  del: number;
  date: Date;
  day: number;
  time: string;
  files: {
    filename: string;
    changes: number;
  }
}

export const getAllRepoCommits = createAsyncThunk(
  "dash/getAllRepoCommits",
  async (data: { name: string }, thunkAPI: any) => {
    thunkAPI.dispatch(selectRepo(data));
    const uid = thunkAPI.getState()?.user?.user?.id;
    const goals = thunkAPI.getState()?.profile?.data;
    const response = await axios.get("http://localhost:10801/repos/allcommit", {
      params: {
        repo: data.name,
        uid,
        owner: _.get(data, "owner.login"),
        author: _.get(thunkAPI.getState(), "user.user.login"),
      }
    });
    console.log("response getAllRepoCommits", response);
    return {
      data: { ...response?.data?.data },
      extras: {
        wdays: goals.wdays,
        wend: goals.wend,
        wstart: goals.wstart
      }
    };
  }
);

export const dashSlice = createSlice({
  name: "dash",
  initialState: {
    selectedRepo: {},
    commits: [],
    commitData: {},
    loadingData: false,
    period: '3m', // 3m 1m 2w
  },
  reducers: {
    selectRepo: (state, action) => {
      console.log("selectRepo", action.payload);
      state.selectedRepo = action.payload;
    },
    updatePeriod: (state, action) => {
      state.period = action.payload;
    }
  },
  extraReducers: (builder) => {

    builder.addCase(getAllRepoCommits.pending, (state, action) => {
      state.loadingData = true;
    });

    builder.addCase(getAllRepoCommits.fulfilled, (state, action) => {
      // Add user to the state array
      console.log("getAllRepoCommits.fulfilled", action.payload);

      const allCommits = action.payload?.data?.commits ?? [];
      const extras = action.payload?.extras ?? {};
      console.log('extras', extras)

      const comByDay = Array.from({ length: 7 }, () => 0);//[0, 0, 0, 0, 0, 0, 0];
      const comByTime: any = {};
      const comByFile: any = {};
      const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const arr24 = Array.from({ length: 24 }, (v, i) => i);

      let allAdds = 0;
      let allDels = 0;

      const comByMsg: any = {};

      const extraData = {
        indays: 0,
        outdays: 0,
        intime: 0,
        outtime: 0,
        over: 0,
      }

      const compileComm = allCommits.map((com: CommitRaw, idx: number) => {
        const comDate = new Date(com.commit.author.date);
        const comDay = comDate.getDay();
        const comTime: string = comDate.toLocaleTimeString()
        comByDay[comDay] = comByDay[comDay] + 1;
        comByTime[comTime.substring(0, 2)] = (comByTime[comTime.substring(0, 2)] ?? 0) + 1;

        const inWorkDay = extras?.wdays?.includes(daysInWeek[comDay]);

        if (!inWorkDay) {
          extraData.over += 1
        }

        if (_.inRange(Number(comTime.substring(0, 2)), Number(extras.wstart.substring(0, 2)), Number(extras.wend.substring(0, 2)) + 1)) {
          extraData.intime += 1;
        } else {
          extraData.outtime += 1;
          if (inWorkDay) {
            extraData.over += 1
          }
        }

        com.files.forEach((file) => {
          comByFile[file.filename] = (comByFile[file.filename] ?? 0) + 1;
        })
        const comMsg = com.commit.message.split(' ')[0];
        comByMsg[comMsg] = (comByMsg[comMsg] ?? 0) + 1;

        allAdds += com.stats.additions ?? 0;
        allDels += com.stats.deletions ?? 0;

        return ({
          id: `com-${idx}`,
          message: com.commit.message,
          add: com.stats.additions,
          del: com.stats.deletions,
          date: com.commit.author.date,
          day: comDay,
          time: comTime,
          files: com.files,
        })
      })
      let totalLang = 0;
      const allLangs = action.payload?.data?.lang;
      allLangs?.forEach((lang: any) => {
        totalLang += lang.size;
      })
      const languagesData = allLangs?.sort((lang: any) => -1 * lang.size)
        .slice(0, 5)
        .map((lang: any) => ({
          ...lang,
          percent: (lang.size * 100 / totalLang).toFixed(1)
        }))

      // Process data
      const allFiles = Object.keys(comByFile)
        .sort((a, b) => comByFile[b] - comByFile[a]);

      const dayGraph = daysInWeek.map((day, idx) => {
        if (extras?.wdays?.includes(day)) {
          extraData.indays += comByDay[idx]
        } else {
          extraData.outdays += comByDay[idx]
        }
        return ({
          day,
          commits: comByDay[idx]
        })
      })

      console.log('comByMsg', comByMsg)

      const comData = {
        dayGraph,
        timeGraph: arr24.map((_, idx) => {
          const timeString = idx.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
          return (
            {
              time: timeString,
              commits: comByTime[timeString] ?? 0,
            }
          )
        }),
        fileGraph: allFiles.slice(0, Math.min(allFiles.length, 5)).map((file) => (
          {
            file: file,
            fileShort: file.split('/').slice(-3).join('/'),
            commits: comByFile[file]
          }
        )),
        languages: languagesData ?? [],
        avg_stats: {
          additions: compileComm.length ? Math.round(allAdds / compileComm.length) : 0,
          deletions: compileComm.length ? Math.round(allDels / compileComm.length) : 0,
        },
        commit_types: Object.keys(comByMsg).map((key) => (
          {
            type: key,
            count: comByMsg[key],
            percent: (comByMsg[key] * 100) / compileComm.length
          }
        )).sort((a, b) => b.count - a.count).slice(0, 5),
        fav_day: _.maxBy(dayGraph, (com) => com.commits),
        total: compileComm.length,
        branch: action.payload?.data?.branch ?? [],
        issues: action.payload?.data?.issue ?? [],
        issueClosed: action.payload?.data?.issue?.filter((iss: any) => iss.state == "closed")?.length,
        extra: {
          ...extraData,
          outdayper: (extraData.outdays * 100) / compileComm.length,
          outtimeper: (extraData.outtime * 100) / compileComm.length,
          overper: ((extraData.over * 100) / compileComm.length).toFixed(1),
        }
      };

      console.log('comData', comData)
      state.loadingData = false;
      state.commitData = comData;
      state.commits = compileComm;
    });
  },
});

export const { selectRepo, updatePeriod } = dashSlice.actions;

export default dashSlice.reducer;
