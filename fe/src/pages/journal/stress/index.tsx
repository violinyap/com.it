import { Button, CircularProgress, MobileStepper, Stack } from "@mui/material";
import React, { useState } from "react";
import JournalQuestions from "../components/questions";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import "./style.scss";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import ProdAva from '../../../assets/ava_mindful.png';
import JournalCard from "../components/card";
import { useTheme } from '@mui/material/styles';


import AvaMindful from "../../../assets/ava_mindful.png";
import AvaHustle from "../../../assets/ava_hustle.png";
import AvaGoal from "../../../assets/ava_goal.png";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { saveJournalData } from "../../../store/reducer/journalReducer";


const stressQs = [
  {
    qs: 'Do you feel that the workload assigned to you was manageable?',
    type: 'yesno',
    point: -2,
  },
  {
    qs: 'Were there any instances of burnout?',
    type: 'yesno',
    point: 2,
  },
  {
    qs: 'What were the main sources of stress for you?',
    type: 'multi',
    options: ['Workload', 'Deadlines', 'Conflicts with team members', 'Others'],
    point: 2,
  },
  {
    qs: 'How well were you able to manage your stress levels?',
    type: 'scale',
    scaleText: {
      low: 'Poor stress management',
      high: 'Excellent stress management'
    },
    point: -2,
  },
  {
    qs: 'Were there any activities or strategies that helped you reduce your stress?',
    type: 'multi',
    options: ['Exercise', 'Meditation', 'Taking breaks', 'Others'],
    point: -2,
  },
  {
    qs: 'Was there any support from your manager or team that helped you manage your stress?',
    type: 'yesno',
    point: -2,
  },
  {
    qs: 'How well did you communicate any stress-related concerns to your manager or team?',
    type: 'scale',
    scaleText: {
      low: 'Poor communication',
      high: 'Excellent communication'
    },
    point: -2,
  },
  {
    qs: 'On a scale of 1 to 10, how would you rate your stress level?',
    type: 'scale',
    scaleText: {
      low: 'Not at all',
      high: 'Extremely stressed'
    },
    point: 2,
  },
]


const StressJournal = () => {
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
    stressQs.forEach((qn, idx) => {
      const ans = answers[idx] ?? [];
      switch (qn.type) {
        case 'scale':
          if (qn.point > 0) {
            points += (ans ?? 0 * qn.point) / 10;
            sums += qn.point;
          } else {
            points += qn.point * -1 + (ans ?? 0 * qn.point) / 10;
            sums += qn.point * -1;
          }

          break;
        case 'yesno':
          if (qn.point > 0) {
            points += (ans === 'yes') ? qn.point : 0;
            sums += qn.point;
          } else {
            points += (ans === 'no') ? qn.point * -1 : 0;
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
      type: 'stress',
      score: convertedpoint.toFixed(1),
      answers,
    }))
    setScore(convertedpoint);
    setLoadResult(false);
  };

  const handleNext = () => {
    if (activeStep === stressQs.length - 1) {
      calcResult();
    } else {
      if (!answers[activeStep]) {
        const newAns = { ...answers };
        newAns[activeStep] = stressQs[activeStep].type === 'multi' ? [] : 0;
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
          <h2 className="neon">Stress Level Monitor</h2>
        </div>
      </Stack>

      {activeStep === stressQs.length ? (
        <Stack>
          <Stack gap={2} justifyContent="center" alignItems={"center"} minHeight={400} padding={10}>
            {loadResult ? (
              <>
                <CircularProgress />
                <p>Calculating your score...</p>
              </>
            ) : (
              <>
                <img src={AvaHustle} height={200} />
                <h2>Your stress level is {score.toFixed(1)}!</h2>
                <p>Calm and slow down gurl.</p>
                <Button variant="outlined" href="/journal">see other journal </Button>

              </>
            )}
          </Stack>
        </Stack>
      ) : (
        <Stack direction={'column'} alignItems='center'>
          <JournalQuestions
            seq={activeStep}
            questions={stressQs[activeStep]}
            val={answers[activeStep]}
            saveAnswer={(values: any) => {
              const newAns = { ...answers };
              newAns[activeStep] = values;
              setAnswers(newAns);
            }} />

          <MobileStepper
            variant="dots"
            steps={stressQs.length}
            position="static"
            activeStep={activeStep}
            sx={{ minWidth: 400, flexGrow: 1 }}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={stressQs[activeStep].type === 'yesno' && !answers[activeStep]}>
                {activeStep === stressQs.length - 1 ? "Done" : "Next"}
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

export default StressJournal;
