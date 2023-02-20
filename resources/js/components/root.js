import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Liff from './index';

function Root() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Liff} />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('app')
);
