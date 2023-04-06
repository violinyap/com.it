import React from "react";
import "./style.scss"

const StatsCard = (props: { title: string, value: string | number | JSX.Element, subvalue?: string | number | JSX.Element, subtext?: string, style: any }) => {
  const { title, value, subtext, style, subvalue } = props;

  return (
    <div className="stats" style={style}>
      <p className="stats-title">{title}</p>
      <h2 className="stats-value">{value}
        {subvalue && <span className="stats-subvalue">{subvalue}</span>}
      </h2>
      <p className="stats-subtext">{subtext}</p>
    </div>
  );
};

export default StatsCard;
