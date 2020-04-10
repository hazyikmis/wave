import React from "react";

export const PageTop = (props) => {
  return (
    <div className="page_top">
      <div className="container">{props.title}</div>
    </div>
  );
};
