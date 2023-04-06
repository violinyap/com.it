import React, { useEffect, useState } from "react";

import "./style.scss";

import { Button, MobileStepper, useTheme, Step, StepLabel, Stepper, StepButton, Stack } from "@mui/material";

import Persona, { personas } from "./steps/persona";
import Profile from "./steps/profile";
import Work from "./steps/work";
import { getAllRepo } from "../../store/reducer/repoReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { saveOnboardData, updateInput } from "../../store/reducer/profileReducer";
import { OnboardDataType } from "../../store/types";
import Repository from "./steps/repos";

const Onboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const onboardData = useSelector((state: any) => state?.profile?.data)

  const handleNext = (newInput: OnboardDataType) => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    dispatch(updateInput(newInput))
    if (activeStep === steps.length - 1) {
      handleComplete()
    }
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    console.log('handle comp')
    dispatch(saveOnboardData());
  };

  const steps = [
    {
      key: 'coderType',
      label: 'Your Coder Type'
    },
    {
      key: 'profile',
      label: 'Your Profile'
    },
    {
      key: 'work',
      label: 'Your Work Style'
    },
    {
      key: 'dashboard',
      label: 'Your Repositories'
    },
  ]

  useEffect(() => {
    dispatch(getAllRepo());
  }, []);

  return activeStep === steps.length ? (
    <div className="Onboard">
      <Stack direction={"column"} gap={4} alignItems={"center"} justifyContent={"center"} className="Onboard__complete">
        <img src={personas.find((per) => per.key === onboardData?.coderType)?.ava} className="Onboard__complete__img" />
        <h2> Your profile is ready, <br /> check it out!</h2>
        <a href="/dash"><Button variant="outlined">Go to dashboard</Button></a>
      </Stack>
    </div>
  ) : (
    <div className="Onboard">
      <h2 className="Onboard__title">Customise Your Journey</h2>
      <div className="Onboard__stepper">
        <Stepper nonLinear activeStep={activeStep}
          sx={{ width: 800, flexGrow: 1, margin: 2 }}
        >
          {steps.map((step, index) => (
            <Step key={step.key} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </div>

      {activeStep === 0 && (<Persona handleNext={handleNext} />)}
      {activeStep === 1 && (<Profile handleNext={handleNext} />)}
      {activeStep === 2 && (<Work handleNext={handleNext} />)}
      {activeStep === 3 && (<Repository handleNext={handleNext} />)}
    </div>
  )

};

export default Onboard;
