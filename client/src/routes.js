import React from "react";
import { Switch, Route } from "react-router-dom";

import Layout from "./hoc/layout";
import Auth from "./hoc/auth";

import Home from "./components/Home";
import { RegisterLogin } from "./components/Register_Login";
import Register from "./components/Register_Login/register";

import { UserDashboard } from "./components/User";

//for private routes Auth(ComponentName, true)
//for in-between routes Auth(ComponentName, false)
//fro public routes Auth(ComponentName, null)

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route
          path="/user/dashboard"
          exact
          component={Auth(UserDashboard, true)}
        />

        <Route path="/register" exact component={Auth(Register, false)} />
        <Route
          path="/register_login"
          exact
          component={Auth(RegisterLogin, false)}
        />
        <Route path="/" exact component={Auth(Home, null)} />
      </Switch>
    </Layout>
  );
};

export default Routes;
