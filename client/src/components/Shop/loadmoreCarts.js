import React from "react";
import { CardBlockShop } from "../utils/card_block_shop";
import { PromiseProvider } from "mongoose";

//at first load, the "size" could be 6 (at max limit)
//but the user clicks "Load More" then the size might be less than 6 (limit)
//Maybe at not next page but at the end...
//Because in each request, total number of articles fetched must be <= limit

export const LoadmoreCarts = (props) => {
  return (
    <div>
      <div>
        <CardBlockShop grid={props.grid} listOfCards={props.products} />
      </div>

      {props.size > 0 && props.size >= props.limit ? (
        <div className="load_more_container">
          <span onClick={() => props.loadMore()}>Load more</span>
        </div>
      ) : null}
    </div>
  );
};
