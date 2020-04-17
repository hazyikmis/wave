import React from "react";
import moment from "moment";

export const UserHistoryBlock = (props) => {
  const renderBlocks = () =>
    props.products
      ? props.products.map((product, i) => (
          <tr key={i}>
            <td>{product.porder}</td>
            <td>{moment(product.dateOfPurchase).format("LLL")}</td>
            <td>
              {product.brand} {product.name}
            </td>
            <td>$ {product.price}</td>
            <td>{product.quantity}</td>
          </tr>
        ))
      : null;

  return (
    <div className="history_blocks">
      <table>
        <thead>
          <tr>
            <th>Purchase order</th>
            <th>Date of purchase</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>{renderBlocks()}</tbody>
      </table>
    </div>
  );
};
