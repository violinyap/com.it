import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Grow } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Tags from '../../../../components/tags';
import MultiLineChart from '../linechart';

const JournalGraph = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [data, setData] = useState([]);

  const { allData } = useSelector((state: any) => state.journal);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  const transformData = () => {
    const compiled: any = [];
    allData.prod?.forEach((jour: any) => {
      const jourDate = new Date(jour.Date);
      if (jourDate.getMonth() === month) {
        const dateString = jourDate.getDate()
        compiled.push({
          type: 'Productivity',
          score: Number(jour.Score),
          date: Number(dateString)
        })
      }
    })
    allData.stress?.forEach((jour: any) => {
      const jourDate = new Date(jour.Date);
      if (jourDate.getMonth() === month) {
        console.log('jourDate', jourDate.getDate(), Number(jourDate.getDate()))
        const dateString = jourDate.getDate()
        compiled.push({
          type: 'Stress',
          score: Number(jour.Score),
          date: Number(dateString)
        })
      }
    })

    const newTodoByDate = {}
    const completeTodoByDate = {}
    allData.todo?.forEach((todo) => {
      const todoCreateDate = new Date(todo.CreatedAt);
      const todoCompleteDate = new Date(todo.CompletedAt);
      if (todoCreateDate.getMonth() === month) {
        newTodoByDate[todoCreateDate.getDate()] = (newTodoByDate[todoCreateDate.getDate()] ?? 0) +1;
      }
      if (todo.Completed && todoCompleteDate.getMonth() === month) {
        completeTodoByDate[todoCompleteDate.getDate()] = (completeTodoByDate[todoCompleteDate.getDate()] ?? 0) +1;
      }
    })

    Object.keys(newTodoByDate)?.forEach((key) => {
      console.log('newTodoByDate', key, Number(key))
      compiled.push({
        type: 'New Todo',
        score: Number(newTodoByDate[key]),
        date: Number(key)
      })
    })
    Object.keys(completeTodoByDate)?.forEach((key) => {
      compiled.push({
        type: 'Completed Todo',
        score: Number(completeTodoByDate[key]),
        date: Number(key)
      })
    })
    setData(compiled.sort((a,b)=>a.date - b.date));
  }

  useEffect(() => {
    transformData();
  }, [allData, month]);


  return (
    <div>
      <Stack gap={1} direction="row" alignItems={'center'}>
        <Tags value={monthNames[month]} />
        <button className="button-none" onClick={() => { setMonth(mon => mon === 0 ? 11 : mon - 1) }}>
          <ChevronLeft />
        </button>
        <button className="button-none" onClick={() => { setMonth(mon => mon === 11 ? 0 : mon + 1) }}>
          <ChevronRight />
        </button>
      </Stack>
      <div>
        {data.length ? (
          <MultiLineChart data={data} />
        ) : (
          <p>No journal made this month</p>
        )}
      </div>
    </div>
  )
}

export default JournalGraph