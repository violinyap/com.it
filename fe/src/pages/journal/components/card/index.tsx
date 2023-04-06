import { Stack } from "@mui/system";
import React from "react";
import Tags from "../../../../components/tags";
import './style.scss';

interface JournalCardProps {
  seq: number;
  title: string;
  pic?: any;
  scorename?: string;
  score?: number;
  quote?: string;
  isEntered: boolean;
}

const JournalCard: React.FC<JournalCardProps> = ({ seq, score, scorename, title, quote, pic, isEntered }) => {
  return (
    <Stack className="JournalCard" gap={1} >
      <h3 className="lpar">JOURNAL #{seq}</h3>
      <h2 className="neon">{title}</h2>
      <div className="JournalCard__box">
        <img className="JournalCard__box-img" src={pic} />
      </div>
      {score && score >= 0 ? (
        <>
          <p>{scorename}: <span className="neon">{score}</span></p>
          <p>{quote}</p>
        </>
      ) : (
        <p>{quote?.length ? quote : <Tags color="#FF6B6B" value={'Take the test'} />}</p>
      )}
    </Stack>
  )
}

export default JournalCard;