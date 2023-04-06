import React, { useEffect, useState } from "react";

import "../style.scss";
import { Popper, Box, Button } from "@mui/material";
import AvaAspire from "../../../../assets/ava_aspire.png";
import AvaBee from "../../../../assets/ava_bee.png";
import AvaOwl from "../../../../assets/ava_owl.png";
import AvaHustle from "../../../../assets/ava_hustle.png";
import AvaBalance from "../../../../assets/ava_balance.png";
import AvaMindful from "../../../../assets/ava_mindful.png";
import AvaGoal from "../../../../assets/ava_goal.png";
import AvaSolo from "../../../../assets/ava_solo.png";
import { OnboardDataType, CoderType } from "../../../../store/types";
import { useSelector } from "react-redux";

interface PersonaConst {
  key: CoderType,
  ava: any,
  name: string,
  desc: string
}
export const personas: PersonaConst[] = [
  {
    key: 'aspire',
    ava: AvaAspire,
    name: 'The Aspiring Developer',
    desc: 'This persona is just starting out in their development career and is looking for ways to improve their skills, work-life balance, and overall wellbeing.'
  },
  {
    key: 'bee',
    ava: AvaBee,
    name: 'The Busy Bee',
    desc: 'This persona is always juggling multiple projects and deadlines, and is looking for ways to prioritize their workload and manage stress levels.'
  },
  {
    key: 'owl',
    ava: AvaOwl,
    name: 'The Night Owl',
    desc: 'This persona often works late into the night, and is looking for ways to improve their sleep and energy levels to perform at their best.'
  },
  {
    key: 'hustle',
    ava: AvaHustle,
    name: 'The Hustle Overworker',
    desc: 'This persona tends to take on too much work and burn out easily, and is looking for ways to improve their work-life balance and prevent burnout.'
  },
  {
    key: 'balance',
    ava: AvaBalance,
    name: 'The Work-Life Balancer',
    desc: 'This persona values having a good balance between work and personal life, and is looking for ways to maintain this balance while still being productive and successful in their career.'
  },
  {
    key: 'mindful',
    ava: AvaMindful,
    name: 'The Mindful Coder',
    desc: 'This persona is focused on improving their mental health and wellbeing, and is looking for ways to incorporate mindfulness and self-care into their daily routine.'
  },
  {
    key: 'goal',
    ava: AvaGoal,
    name: 'The Goal-Oriented Dev',
    desc: 'This persona is focused on achieving specific goals, such as completing a certain project or mastering a specific skill, and is looking for ways to stay motivated and productive while reaching their goals.'
  },
  {
    key: 'solo',
    ava: AvaSolo,
    name: 'The Solopreneur',
    desc: 'This persona is a freelancer or entrepreneur who is looking for ways to manage their workload and improve their productivity while working independently.'
  },

]

const Persona = (props: { handleNext: (currInput: OnboardDataType) => void }) => {
  const onboardData = useSelector((state: any) => state?.profile?.data)

  const [selectedType, setSelectedType] = useState<CoderType | ''>(onboardData?.coderType);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [desc, setDesc] = useState<string>('');

  useEffect(() => {
    setSelectedType(onboardData?.coderType)
    console.log('onboardData?.coderType', onboardData?.coderType, '-', selectedType)
  }, [onboardData?.coderType])
  const handleHover = (event: React.MouseEvent<HTMLElement>, desc?: string) => {
    setAnchorEl(event?.currentTarget);
    setDesc(desc ?? '');
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div className="Steps">
      <h3>What is your persona?</h3>

      <div className="Steps__list">
        {personas.map((per) => (
          <div key={per.key} className="Persona">
            <div
              onClick={() => { setSelectedType(selectedType === per.key ? '' : per.key) }}
              onMouseEnter={(e) => handleHover(e, per.desc)}
              onMouseLeave={() => setAnchorEl(null)}
              className={`Persona__ava ${selectedType === per.key && 'Persona__ava__selected'}`}
            >
              <img src={per.ava} width={160} className="Persona__ava__img" />
            </div>
            <h4>{per.name}</h4>
          </div>
        ))}
      </div>

      <Button variant="outlined" disabled={!Boolean(selectedType)} onClick={() => props.handleNext({ coderType: selectedType })}>
        Next
      </Button>


      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box
          sx={{ border: 1, p: 1, bgcolor: 'background.paper', maxWidth: 300 }}
          className="Persona__desc"
        >
          {desc}
        </Box>
      </Popper>
    </div>
  );
};

export default Persona;
