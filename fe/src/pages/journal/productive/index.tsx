import { Button, CircularProgress, MobileStepper, Stack } from "@mui/material";
import React, { useState } from "react";
import JournalQuestions from "../components/questions";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import "./style.scss";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import ProdAva from '../../../assets/ava_mindful.png';
import JournalCard from "../components/card";
import { useTheme } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { saveJournalData } from "../../../store/reducer/journalReducer";


const prodQs = [
  {
    qs: 'What were some of the biggest distractions that hindered your productivity?',
    type: 'multi',
    options: ['Unexpected meetings', 'Unplanned tasks', 'Technical issues', 'Others'],
    point: -2,
  },
  {
    qs: 'What could have been done differently to increase your productivity today?',
    type: 'multi',
    options: ['Better time management', 'Better prioritization', 'Better tools', 'Others'],
    point: -2,
  },
  {
    qs: 'What were some of the biggest obstacles you faced while working on tasks today?',
    type: 'multi',
    options: ['Lack of resources', 'Lack of clarity on requirements', 'Lack of support from team members', 'Others'],
    point: -2
  },
  {
    qs: 'Did you feel that the work assigned to you was aligned with your strengths and interests?',
    type: 'yesno',
    point: 2
  },
  {
    qs: 'Were you able to effectively communicate any blockers or challenges you faced?',
    type: 'yesno',
    point: 2
  },
  {
    qs: 'On a scale of 1 to 10, how satisfied are you with the amount of feedback you received from your manager/team?',
    type: 'scale',
    scaleText: {
      low: 'Unsatisfied',
      high: 'Very satisfied'
    },
    point: 2
  },
  {
    qs: 'How would you rate the overall work environment today?',
    type: 'scale',
    scaleText: {
      low: 'Poor',
      high: 'Excellent'
    },
    point: 2,
  },
  {
    qs: 'How well did you collaborate with your team today?',
    type: 'scale',
    scaleText: {
      low: 'Poor',
      high: 'Excellent'
    },
    point: 2,
  },
  {
    qs: 'On a scale of 1 to 10, how productive would you say you were today?',
    type: 'scale',
    scaleText: {
      low: 'Not productive at all',
      high: 'Extremely productive'
    },
    point: 2,
  }
]


const entries = [{
  key: 'stress',
  title: 'Daily Stress Check',
  scorename: '',
  score: undefined,
  quote: 'Alls good',
  path: 'journal/stress',
  // pic: AvaHustle,/
}, {
  key: 'todo',
  title: 'Todo Tracker',
  quote: 'Always keep track',
  path: 'journal/todo',
  // pic: AvaGoal
}]

const ProdJournal = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<{
    [k: number]: any;
  }>({});
  const [loadResult, setLoadResult] = useState(false);
  const [score, setScore] = React.useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const calcResult = () => {
    let points = 0;
    let sums = 0;
    setLoadResult(true);
    prodQs.forEach((qn, idx) => {
      const ans = answers[idx] ?? [];
      switch (qn.type) {
        case 'scale':
          points += (ans ?? 0 * qn.point) / 10;
          sums += qn.point;
          break;
        case 'yesno':
          if (qn.point > 0) {
            points += (ans === 'yes') ? qn.point : 0;
            sums += qn.point;
          } else {
            points += (ans === 'no') ? qn.point : 0;
            sums += qn.point * -1;
          }
          break;
        case 'multi':
          if (qn.point > 0) {
            points += (ans.length * qn.point) / (qn.options?.length ?? 4);
            sums += qn.point;
          } else {
            points += (qn.point * -1) + ans.length * (qn.point / (qn.options?.length ?? 4));
            sums += qn.point * -1;
          }
          break;
        default:
          return;
      }
    })

    const convertedpoint = points / sums * 10;

    dispatch(saveJournalData({
      type: 'productivity',
      score: convertedpoint.toFixed(1),
      answers,
    }))
    setScore(convertedpoint);
    setLoadResult(false);
  };

  const handleNext = () => {
    if (activeStep === prodQs.length - 1) {
      calcResult();
    } else {
      if (!answers[activeStep]) {
        const newAns = { ...answers };
        newAns[activeStep] = prodQs[activeStep].type === 'multi' ? [] : 0;
        setAnswers(newAns);
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="Journals">
      <Stack direction={'row'}>
        <a href="/journal"><ArrowBackIosIcon /></a>
        <div>
          <p className="lpar">JOURNAL ENTRY</p>
          <h2 className="neon">Daily Productivity Test</h2>
        </div>
      </Stack>

      {activeStep === prodQs.length ? (
        <Stack>
          <Stack gap={2} justifyContent="center" alignItems={"center"} minHeight={400} padding={10}>
            {loadResult ? (
              <>
                <CircularProgress />
                <p>Calculating your score...</p>
              </>
            ) : (
              <>
                <img src={ProdAva} height={200} />
                <h2>Your productive score is {score.toFixed(1)}!</h2>
                <p>You are taking just a good amount for your productivity.</p>
                <Button variant="outlined" href="/journal">see other journal</Button>
              </>
            )}
          </Stack>

        </Stack>
      ) : (
        <Stack direction={'column'} alignItems='center'>
          <JournalQuestions
            seq={activeStep}
            questions={prodQs[activeStep]}
            val={answers[activeStep]}
            saveAnswer={(values: any) => {
              const newAns = { ...answers };
              newAns[activeStep] = values;
              setAnswers(newAns);
            }} />

          <MobileStepper
            variant="dots"
            steps={prodQs.length}
            position="static"
            activeStep={activeStep}
            sx={{ minWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={prodQs[activeStep].type === 'yesno' && !answers[activeStep]}>
                {activeStep === prodQs.length - 1 ? "Done" : "Next"}
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />

        </Stack>
      )}

    </div>
  );
};

export default ProdJournal;
