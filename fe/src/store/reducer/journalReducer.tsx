import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const saveJournalData = createAsyncThunk(
  "journal/saveJournalData",
  async (data: any, thunkAPI) => {
    const allState: any = thunkAPI.getState();
    const response = await axios.post("http://localhost:10801/journal", {
      type: data.type,
      score: data.score,
      answers: JSON.stringify(data.answers),
      uid: allState.user?.user?.id,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      type: data.type,
      score: data.score,
      answers: data.answers,
      uid: allState.user?.user?.id,
    };
  }
);

export const getJournalData = createAsyncThunk(
  "journal/getJournalData",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/journal", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);


export const getJournalHistory = createAsyncThunk(
  "journal/getJournalHistory",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/journal/history", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);





export const saveNewTodo = createAsyncThunk(
  "journal/saveNewTodo",
  async (data: any, thunkAPI) => {
    const allState: any = thunkAPI.getState();
    const response = await axios.post("http://localhost:10801/todo/new", {
      type: data.type,
      task: data.task,
      uid: allState.user?.user?.id,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("saveNewTodo response", response);
    return {
      todoId: response.data.data.InsertedID,
      type: data.type,
      task: data.task,
    };
  }
);


export const updateTodo = createAsyncThunk(
  "journal/updateTodo",
  async (data: any, thunkAPI) => {
    const response = await axios.post("http://localhost:10801/todo/update", {
      completed: data.completed,
      todo_id: data.todoId,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response", response);

    thunkAPI.dispatch(getAllTodo())
    return;
  }
);

export const getAllTodo = createAsyncThunk(
  "journal/getAllTodo",
  async (args, thunkAPI: any) => {
    const uid = thunkAPI.getState()?.user?.user?.id;
    const response = await axios.get("http://localhost:10801/todo", {
      params: {
        uid,
      },
    });
    return response.data;
  }
);


const calcDiffDays = (date_1: string, date_2: string) => {
  let difference = Math.abs(new Date(date_1).getTime() - new Date(date_2).getTime());
  let TotalDays = Math.floor(difference / (1000 * 3600 * 24));
  return TotalDays;
}


export const journalSlice = createSlice({
  name: "journal",
  initialState: {
    stress: {
      date: "",
      score: 0,
      answers: "",
      done: ''
    },
    productive: {
      date: "",
      score: 0,
      answers: "",
      done: ''
    },
    todo: {
      work: {},
      personal: {},
      learn: {},
      completed: {}
    },
    stats: {
      prod: '',
      stress: '',
      todo: '',
      freq: 0,
    },
    allData: {
      prod: [],
      stress: [],
      todo: [],
    },
    journalLoad: false,
    todoLoad: false,
    savingData: false,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(saveJournalData.pending, (state, action) => {
      state.savingData = true;
    });
    builder.addCase(saveJournalData.fulfilled, (state, action) => {
      console.log("saveJournalData.fulfilled", action.payload);
      const newJournal = action.payload;
      if (newJournal.type === "productivity") {
        state.productive = {
          date: new Date().toString(),
          score: newJournal.score,
          answers: JSON.stringify(newJournal.answers),
          done: new Date().toString(),
        }
      }

      if (newJournal.type === "stress") {
        state.stress = {
          date: new Date().toString(),
          score: newJournal.score,
          answers: JSON.stringify(newJournal.answers),
          done: new Date().toString(),
        }
      }

      state.savingData = false;
    });

    builder.addCase(getJournalData.pending, (state, action) => {
      state.journalLoad = true;
    });

    builder.addCase(getJournalData.fulfilled, (state, action) => {
      console.log("getJournalData.fulfilled action.payload", action.payload);
      const prodData = action.payload.data.prod;
      const stressData = action.payload.data.stress;
      state.productive = {
        date: prodData.Date,
        score: prodData.Score,
        answers: prodData.Answers.length > 0 && JSON.parse(prodData.Answers),
        done: prodData.Answers ? prodData.CreatedAt : false
      }
      state.stress = {
        date: stressData.Date,
        score: stressData.Score,
        answers: stressData.Answers.length > 0 && JSON.parse(stressData.Answers),
        done: stressData.Answers ? stressData.CreatedAt : false
      }
      state.journalLoad = false;
    });


    // JOURNAL HISTORY
    builder.addCase(getJournalHistory.pending, (state, action) => {
      state.journalLoad = true;
    });

    builder.addCase(getJournalHistory.fulfilled, (state, action) => {
      const prodData = action.payload.data.prod;
      const stressData = action.payload.data.stress;
      const todoData = action.payload.data.todo;
      const journalData: string[] = action.payload.data.journals;

      let prodScore = 0;
      let stressScore = 0;

      const prodArr = prodData?.filter((data: any) => calcDiffDays(new Date().toISOString(), data.Date) <= 7);
      prodArr.forEach((data: any) => {
        prodScore += Number(data.Score)
      })
      const stressArr = stressData?.filter((data: any) => calcDiffDays(new Date().toISOString(), data.Date) <= 7);
      stressArr.forEach((data: any) => {
        stressScore += Number(data.Score)
      })


      const openTodo = todoData?.filter((todo: any) => !todo.Completed)
      const completedTodo = todoData?.filter((todo: any) => calcDiffDays(todo.CompletedAt, todo.CreatedAt) <= 7);

      const weekJournal = _.uniq(journalData).filter((journal: string) => calcDiffDays(new Date().toISOString(), journal) <= 7);

      state.stats = {
        prod: (prodScore / prodArr.length).toFixed(1),
        stress: (stressScore / stressArr.length).toFixed(1),
        todo: (completedTodo.length * 100 / (openTodo.length + completedTodo.length)).toFixed(1),
        freq: weekJournal.length
      }

      state.allData = {
        prod: prodData,
        stress: stressData,
        todo: todoData,
      }
      state.journalLoad = false;
    });


    builder.addCase(saveNewTodo.pending, (state, action) => {
      state.todoLoad = true;
    });
    builder.addCase(saveNewTodo.fulfilled, (state, action) => {
      console.log('saveNewTodo', action.payload)

      const newTodoList = { ...state.todo }
      const newTodo = {
        [action.payload.todoId]: {
          id: action.payload.todoId,
          task: action.payload.task,
          completed: false,
          type: action.payload.type,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      }

      if (action.payload.type === "work") {
        newTodoList.work = Object.assign(newTodo, newTodoList.work)
      }

      if (action.payload.type === "personal") {
        newTodoList.personal = Object.assign(newTodo, newTodoList.personal)
      }

      if (action.payload.type === "learn") {
        newTodoList.learn = Object.assign(newTodo, newTodoList.learn)
      }

      state.todo = newTodoList;
      state.todoLoad = false;
    });

    builder.addCase(updateTodo.pending, (state, action) => {
      state.todoLoad = true;
    });

    builder.addCase(getAllTodo.pending, (state, action) => {
      state.todoLoad = true;
    });
    builder.addCase(getAllTodo.fulfilled, (state, action) => {
      console.log('getAllTodo', action.payload)

      const newTodoList = {
        work: {},
        personal: {},
        learn: {},
        completed: {}
      }

      const allTodo = action.payload.data;
      allTodo.forEach((todo: any) => {
        const newTodo = {
          [todo.ID]: {
            id: todo.ID,
            task: todo.Task,
            completed: todo.Completed,
            completedAt: todo.CompletedAt,
            createdAt: todo.CreatedAt,
            updatedAt: todo.UpdatedAt,
            type: todo.Type,
          }
        }

        if (todo.Completed) {
          newTodoList.completed = Object.assign(newTodo, newTodoList.completed)
        } else {
          if (todo.Type === "work") {
            newTodoList.work = Object.assign(newTodo, newTodoList.work)
          }

          if (todo.Type === "personal") {
            newTodoList.personal = Object.assign(newTodo, newTodoList.personal)
          }

          if (todo.Type === "learn") {
            newTodoList.learn = Object.assign(newTodo, newTodoList.learn)
          }
        }

      })
      state.todo = newTodoList;
      state.todoLoad = false;
    });
  },
});


export default journalSlice.reducer;
