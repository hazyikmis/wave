import React from "react";
import Card from "./card";

export const CardBlock = (props) => {
  const renderCards = () =>
    props.listOfCards
      ? props.listOfCards.map((card, i) => <Card key={i} {...card} />)
      : null;

  return (
    <div className="card_block">
      <div className="container">
        {props.title ? <div className="title">{props.title}</div> : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {renderCards(props.listOfCards)}
        </div>
      </div>
    </div>
  );
};
