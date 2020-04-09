"proxy": {
  "/api/": {
    "target": "http://localhost:3002"
  }
}


<Route path="/user/dashboard" exact component={UserDashboard} />

<Route path="/register" exact component={Register} />
<Route path="/register_login" exact component={RegisterLogin} />
<Route path="/" exact component={Home} />