import { Button, Checkbox, CircularProgress, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, MobileStepper, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import JournalQuestions from "../components/questions";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import "./style.scss";
import { Comment, Done, HistoryToggleOff, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import ProdAva from '../../../assets/ava_mindful.png';
import JournalCard from "../components/card";
import { useTheme } from '@mui/material/styles';


import AvaMindful from "../../../assets/ava_mindful.png";
import AvaHustle from "../../../assets/ava_hustle.png";
import AvaGoal from "../../../assets/ava_goal.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { getAllTodo, saveJournalData, saveNewTodo, updateTodo } from "../../../store/reducer/journalReducer";

import CommentIcon from '@mui/icons-material/Comment';
import Tags from "../../../components/tags";


interface Todo {
  id: string,
  task: string,
  completed: boolean,
  type: 'work' | 'personal' | 'learn',
  createdAt: string,
  updatedAt: string,
  completedAt: string,
}
const TodoJournal = () => {

  const dispatch = useDispatch<AppDispatch>();

  const [checked, setChecked] = React.useState(false);
  const [todoType, setTodoType] = useState('work');
  const [newTodo, setNewTodo] = useState('');

  const { work, personal, learn, completed } = useSelector((state: any) => state?.journal?.todo)

  const saveTodo = () => {
    dispatch(saveNewTodo({
      type: todoType,
      task: newTodo
    }))
    setNewTodo('')
  }

  const updateTodoState = ({ todoId, completed }: {
    todoId: string, completed: boolean
  }) => {
    dispatch(updateTodo({
      completed: completed,
      todoId: todoId
    }))
  }


  const calcDiffDays = (date_1: string, date_2: string) => {
    let difference = new Date(date_1).getTime() - new Date(date_2).getTime();
    let TotalDays = Math.floor(difference / (1000 * 3600 * 24));
    let TotalHours = Math.floor(difference / (1000 * 3600));
    let TotalMins = Math.floor(difference / (1000 * 60));
    let TotalSec = Math.floor(difference / (1000));
    return TotalDays ? `${TotalDays}d` :
      TotalHours ? `${TotalHours}h` :
        TotalMins ? `${TotalMins}m` :
          `${TotalSec}s`;
  }


  useEffect(() => {
    dispatch(getAllTodo())
  }, [])


  const TodoListItem = ({ todo }: { todo: Todo }) => (
    <Stack direction={"row"} gap={2} alignItems="center" key={todo.id}>
      <Checkbox
        checked={todo.completed}
        onChange={(event) => {
          console.log('checkbox', event.target.checked)
          updateTodoState({ todoId: todo.id, completed: event.target.checked })
        }}
      />
      <span className={`todo-item ${todo.completed ? 'todo-item-checked' : ''}`}>{todo.task}</span>

      <Tags value={
        <><HistoryToggleOff style={{ width: 10 }} />
          <span>{calcDiffDays(new Date().toISOString(), todo.createdAt)}</span></>
      } />

    </Stack>
  );

  const tagColors = {
    work: '#D71E77',
    learn: '#D74B1E',
    personal: '#1893A4',
  }
  const CompletedTodoItem = ({ todo }: { todo: Todo }) => (
    <Stack direction={"row"} gap={2} alignItems="center" key={todo.id}>
      <Checkbox
        checked={todo.completed}
        onChange={(event) => {
          console.log('checkbox', event.target.checked)
          updateTodoState({ todoId: todo.id, completed: event.target.checked })
        }}
      />
      <span className={`todo-item ${todo.completed ? 'todo-item-checked' : ''}`}>{todo.task}</span>

      <Tags color={'#236847'} value={
        <><Done style={{ width: 10 }} />
          <span>{calcDiffDays(todo.completedAt, todo.createdAt)}</span></>
      } />
      <Tags value={todo.type} color={tagColors[todo.type]} />

      <span>{new Date(todo.completedAt).toLocaleString('en-SG', { timeZone: 'UTC' })}</span>
    </Stack>
  );

  return (
    <Stack className="todo" gap={3}>
      <Stack direction={'row'} justifyContent="space-between">
        <Stack direction={'row'}>
          <a href="/journal"><ArrowBackIosIcon /></a>
          <div>
            <p className="lpar">JOURNAL ENTRY</p>
            <h2 className="neon">To-do list</h2>
          </div>
        </Stack>
        <Stack direction={'row'} gap={2} alignItems="center">
          <TextField
            id="filled-select-currency"
            select
            label="Type"
            value={todoType}
            variant="outlined"
            onChange={(e) => { setTodoType(e.target.value) }}
          >
            <MenuItem value={'work'}>
              Work
            </MenuItem>
            <MenuItem value={'personal'}>
              Personal
            </MenuItem>
            <MenuItem value={'learn'}>
              Learn
            </MenuItem>
          </TextField>
          <TextField
            id="outlined-multiline-flexible"
            label="Add new todo..."
            multiline
            maxRows={4}
            style={{ width: 400 }}
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value)
            }}
          />
          <Button
            variant="outlined"
            onClick={() => { saveTodo() }}
          >
            Add
          </Button>
        </Stack>
      </Stack>

      <Stack direction={'row'} style={{ marginLeft: 20 }} gap={2}>
        <Stack gap={1} style={{ flex: 1 }} className="todo-wrap">
          <p className="subhead">Work</p>
          {Object.values(work)?.map((todo: any) => (
            <TodoListItem todo={todo} />
          ))}
        </Stack>
        <Stack gap={1} style={{ flex: 1 }} className="todo-wrap">
          <p className="subhead">Personal</p>
          {Object.values(personal)?.map((todo: any) => (
            <TodoListItem todo={todo} />
          ))}
        </Stack>
        <Stack gap={1} style={{ flex: 1 }} className="todo-wrap">
          <p className="subhead">Learn</p>
          {Object.values(learn)?.map((todo: any) => (
            <TodoListItem todo={todo} />
          ))}
        </Stack>
      </Stack>

      <Stack gap={1} style={{ flex: 1, marginLeft: 20 }} className="todo-wrap">
        <p className="subhead">Completed</p>
        {Object.values(completed)?.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map((todo: any) => (
          <CompletedTodoItem todo={todo} />
        ))}
      </Stack>
    </Stack >
  );
};

export default TodoJournal;
