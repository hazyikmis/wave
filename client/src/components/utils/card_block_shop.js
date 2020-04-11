import React from "react";
import Card from "./card";

export const CardBlockShop = (props) => {
  const renderCards = () =>
    props.listOfCards
      ? props.listOfCards.map((card, i) => (
          <div>
            <Card key={card._id} {...card} grid={props.grid} />
          </div>
        ))
      : null;

  return (
    <div className="card_block_shop">
      <div>
        <div>
          {props.listOfCards ? (
            props.listOfCards.length === 0 ? (
              <div className="no_result">Sorry, no results!</div>
            ) : null
          ) : null}
          {renderCards(props.listOfCards)}
        </div>
      </div>
    </div>
  );
};
