import React, { useEffect, useState } from "react";

import "./style.scss";

import JournalCard from "./components/card";
import { Grow, Stack } from "@mui/material";

import AvaHustle from "../../assets/ava_hustle.png";
import AvaMindful from "../../assets/ava_mindful.png";
import AvaGoal from "../../assets/ava_goal.png";

import Journal1Gif from "../../assets/journal1.gif";
import Journal2Gif from "../../assets/journal2.gif";
import Journal3Gif from "../../assets/journal3.gif";
import { getJournalData, getJournalHistory } from "../../store/reducer/journalReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import StatsCard from "../../components/statsCard";
import JournalGraph from "./components/graph";

const Journal = () => {
  const today = new Date();
  const startWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const dispatch = useDispatch<AppDispatch>();

  const { productive, stress, stats } = useSelector((state: any) => state?.journal);
  const { productivity: prodGoal, stress: stressGoal } = useSelector((state: any) => state?.profile?.data);


  useEffect(() => {
    dispatch(getJournalData());
    dispatch(getJournalHistory());
  }, [])

  const entries = [{
    key: 'productivity',
    title: 'Daily Productivity Test',
    scorename: productive.done ? 'Happy Score' : undefined,
    score: productive.score,
    quote: productive.done ? 'Take a break and treat yourself today!' : '',
    path: 'journal/productivity',
    pic: Journal1Gif,
    done: productive.done
  }, {
    key: 'stress',
    title: 'Daily Stress Check',
    scorename: stress.done ? 'Stress score' : undefined,
    score: stress.score,
    quote: stress.done ? 'Do not worry. You rock!' : '',
    path: 'journal/stress',
    pic: Journal2Gif,
    done: stress.done
  }, {
    key: 'todo',
    title: 'Todo Tracker',
    quote: 'Always keep track',
    path: 'journal/todo',
    pic: Journal3Gif
  }]

  return (
    <div className="JournalPage">
      <h1>Journals</h1>
      <p className="subhead">{today.toDateString()}</p>
      <Stack spacing={3} direction="row" style={{ marginTop: 30 }}>
        {entries.map((entry, index) => (
          <a href={entry.done ? '#' : entry.path} key={`card-${index}`} style={{ flex: 1 }}>
            <JournalCard
              title={entry.title}
              seq={index + 1}
              isEntered={true}
              key={entry.key}
              scorename={entry.scorename}
              score={entry.score}
              quote={entry.quote}
              pic={entry.pic}
            />
          </a>
        ))}
      </Stack>
      <Stack direction={"row"} gap={4} style={{ marginTop: 40 }}>
        <div style={{ flex: 2 }}>
          <p className="subhead">THIS WEEK’S JOURNAL STATS</p>
          <p>since {startWeek.toDateString()}</p>
          <Grow in={true} >
            <Stack gap={1}>
              <Stack gap={2} direction="row" sx={{ marginTop: 2 }} justifyContent="space-between">
                <StatsCard
                  title={"PRODUCTIVITY SCORE"}
                  value={stats?.prod ?? '-'}
                  subvalue={'/10'}
                  subtext={`This week’s goal: ${prodGoal}/10`}
                  style={{ flex: 1 }}
                />
                <StatsCard
                  title={"stress level"}
                  value={stats?.stress ?? '-'}
                  subvalue={'/10'}
                  subtext={`This week’s goal: ${stressGoal}/10`}
                  style={{ flex: 1 }}
                />
              </Stack>
              <Stack gap={2} direction="row" sx={{ marginTop: 2 }} justifyContent="space-between">
                <StatsCard
                  title={"to-do completion rate"}
                  value={stats?.todo ?? '-'}
                  subvalue={'%'}
                  subtext={`Try to achieve 80%`}
                  style={{ flex: 1 }}
                />
                <StatsCard
                  title={"journaling frequency"}
                  value={stats?.freq ?? '-'}
                  subvalue={"/7 days"}
                  subtext={`Let's keep the streak`}
                  style={{ flex: 1 }}
                />
              </Stack>
            </Stack>
          </Grow>
        </div>
        <Grow in={true} style={{ flex: 3 }}>
          <div >
            <p className="subhead">PAST JOURNALS</p>
            <JournalGraph />
          </div>
        </Grow>

      </Stack>
    </div>
  );
};

export default Journal;
