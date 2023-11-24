import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'semantic-ui-css/semantic.min.css'

import Home from "./Home/home.component"; 
import Chat from "./Home/chatapp"; 

import HomeGroup from "./Group/homeGroup.component"; 

function App() {
  document.title = 'Bitvia - Create, Connect, Collaborate';
  return (<Router>
    <div className="App">
      <div className="auth-wrapper">
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/home' component={Home} />
            <Route exact path='/master' component={Home} />
            <Route exact path='/chat' component={Chat} />
            <Route exact path='/group' component={HomeGroup} />
          </Switch>
      </div>
    </div></Router>
  );
}

export default App;
