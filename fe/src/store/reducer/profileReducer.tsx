import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { OnboardDataType } from "../types";


export const saveOnboardData = createAsyncThunk(
  "profile/saveOnboardData",
  async (args, thunkAPI) => {
    const allState: any = thunkAPI.getState();
    console.log("saveOnboardData", allState?.profile);
    const response = await axios.post("http://localhost:10801/onboard", {
      bday: allState?.profile?.data.bday,
      mbti: allState?.profile?.data.mbti,
      productivity: allState?.profile?.data.productivity,
      stress: allState?.profile?.data.stress,
      wend: allState?.profile?.data.wend,
      wstart: allState?.profile?.data.wstart,
      wdays: allState?.profile?.data.wdays.join(','),
      coderType: allState?.profile?.data.coderType,
      repos: allState?.profile?.data.repos.map((repo: any) => repo.id).join(','),

      userId: allState.user?.user?.id,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);
    return response;
  }
);

export const getProfileGoal = createAsyncThunk(
  "profile/getProfileGoal",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/goal", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);

const convertResProfile = (newData: any) => (
  {
    bday: newData.Birthday,
    coderType: newData.CoderType,
    mbti: newData.MBTI,
    productivity: newData.Productivity,
    stoken: newData.SpotifyToken,
    stress: newData.Stress,
    wdays: newData.Workdays?.split(','),
    wstart: newData.Workstart,
    wend: newData.Workend,
    repos: newData.Repos?.split(','),
  }
)


export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: {
      bday: "",
      coderType: "",
      mbti: "",
      productivity: 0,
      stoken: "",
      stress: 0,
      wdays: [''],
      wstart: '',
      wend: '',
      repos: [''],
    },
    savingData: false,
  },
  reducers: {
    updateInput: (state, action) => {

      let newData = {
        ...state.data,
        ...action.payload
      }
      state.data = newData;
      console.log("updateInput", action.payload, newData, state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveOnboardData.pending, (state, action) => {
      state.savingData = true;
    });
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(saveOnboardData.fulfilled, (state, action) => {
      // Add user to the state array
      console.log("saveOnboardData.fulfilled", action.payload);
      const newData = action.payload.data.data;
      state.data = convertResProfile(newData);
      state.savingData = false;
    });

    builder.addCase(getProfileGoal.fulfilled, (state, action) => {
      console.log("getProfileGoal.fulfilled action.payload", action.payload);
      state.data = convertResProfile(action.payload.data);
    });

  },
});

export const { updateInput } = profileSlice.actions;

export default profileSlice.reducer;
