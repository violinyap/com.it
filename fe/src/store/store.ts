import { configureStore } from "@reduxjs/toolkit";
import dashReducer from "./reducer/dashReducer";
import repoReducer from "./reducer/repoReducer";
import userReducer from "./reducer/userReducer";

import { useDispatch } from 'react-redux'
import profileReducer from "./reducer/profileReducer";
import journalReducer from "./reducer/journalReducer";


const store = configureStore({
  reducer: {
    user: userReducer,
    repo: repoReducer,
    dash: dashReducer,
    profile: profileReducer,
    journal: journalReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;