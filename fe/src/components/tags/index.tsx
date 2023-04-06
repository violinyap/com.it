import { Stack } from "@mui/material";
import _ from "lodash";
import "./style.scss"

const Tags = (props: { value: string | number | JSX.Element, color?: string }) => {
  const { value, color } = props;


  return (
    <Stack gap={1} direction="row" className="customtags"
      style={{
        backgroundColor: color ?? '#4F33F7'
      }}
    >
      {value}
    </Stack>
  );
};

export default Tags;
