import React from "react";
import { GenericButton } from "../utils/buttons";

export const RegisterLogin = () => {
  return (
    <div className="page_wrapper">
      <div className="container">
        <div className="register_login_container">
          <div className="left">
            <h1>New Customers</h1>
            <p>
              Incididunt nostrud sit esse aliqua anim adipisicing do anim Lorem
              eu. Ipsum veniam elit anim non dolor ea. Dolor ex excepteur
              reprehenderit deserunt sunt nisi occaecat commodo consequat quis.
              Dolor non laboris nostrud ullamco dolore cupidatat eu proident
              Lorem dolor. Reprehenderit do laboris nostrud culpa labore id
              commodo esse nisi do reprehenderit id et.
            </p>
            <GenericButton
              type="default"
              title="Create new account"
              linkTo="/register"
              addStyles={{
                margin: "10px 0 0 0",
              }}
            />
          </div>
          <div className="right">
            <h2>Registered Customers</h2>
            <p>If you have an account please login.</p>
            LOGIN
          </div>
        </div>
      </div>
    </div>
  );
};
