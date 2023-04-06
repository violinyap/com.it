import _ from "lodash";
import "./style.scss"
import { Stack } from "@mui/material";

const InfoCard = (props: { title: string, value: string | number | JSX.Element, subvalue?: string, subtext?: string }) => {
  const { title, value, subvalue, subtext } = props;


  return (
    <Stack direction={"row"} className="info" gap={1.5} alignItems="center" style={{ flex: 1 }}>
      <h2 className="info-value">{value}
        <small>{subvalue}</small>
      </h2>
      <Stack justifyContent={"space-between"}>
        <p className="info-subtext">{subtext}</p>
        <p className="info-title">{title}</p>
      </Stack>
    </Stack>
  );
};

export default InfoCard;
