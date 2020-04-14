import React, { Component } from "react";

import PaypalExpressBtn from "react-paypal-express-checkout";
//https://developer.paypal.com/
//Paypal Client ID: AZX0ASzVZnNeUkn6yjwFgC5SpSP6PZq25WiD96zuK6yBRRv3TSnJYfJR1HE0nkXQ2iT3lDpPvAjEKZT1
//Secret: EILxmzPUdvkgNH9xUQySMjDmp7IbFfDHy4QLQGaOpmFs2poxfYaQGXC_ZeACnlhVXWWZCiFUGztYAmKf

export default class Paypal extends Component {
  render() {
    const onSuccess = (payment) => {
      //console.log(JSON.stringify(payment));
      this.props.onSuccess(payment);
    };

    const onCancel = (payment) => {
      //console.log(JSON.stringify(payment));
      this.props.transactionCanceled(payment);
    };

    const onError = (payment) => {
      //console.log(JSON.stringify(payment));
      this.props.transactionError(payment);
    };

    const env = "sandbox";
    const currency = "USD";
    const total = this.props.toPay;

    const client = {
      sandbox:
        "AZX0ASzVZnNeUkn6yjwFgC5SpSP6PZq25WiD96zuK6yBRRv3TSnJYfJR1HE0nkXQ2iT3lDpPvAjEKZT1",
      production: "YOUR-PRODUCTION-APP-ID",
    };

    return (
      <div>
        <PaypalExpressBtn
          env={env}
          client={client}
          currency={currency}
          total={total}
          onError={onError}
          onSuccess={onSuccess}
          onCancel={onCancel}
          style={{
            size: "large",
            color: "blue",
            shape: "rect",
            label: "checkout",
          }}
        />
      </div>
    );
  }
}

//returning object of a successful payment
//you can store paymentID &  paymentToken into the database if you wish
// {
//   paid: true,
//   cancelled: false,
//   payerID: "TR569Y42HEDKN",
//   paymentID: "PAYID-L2KTADQ4X866274YD100161L",
//   paymentToken: "EC-7XH92977L5234132K",
//   returnUrl:
//     "https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L2KTADQ4X866274YD100161L&token=EC-7XH92977L5234132K&PayerID=TR569Y42HEDKN",
//   address: {
//     recipient_name: "John Doe",
//     line1: "Rue du Cornet 6",
//     city: "Verviers",
//     state: "BE_zip = 4800",
//     postal_code: "4800",
//     country_code: "BE",
//   },
//   email: "sb-o3vv91441593@personal.example.com",
// }
