/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/react-in-jsx-scope *//* eslint-disable linebreak-style */
import { Route, Switch } from 'react-router';
import Home from '../pages/home';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Guard from './guard'
import Chat from '../pages/chat';

const Router = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Switch>
    <Route path="/" exact>
      {/* <Home /> */}
      <Login/>
    </Route>
    <Guard path="/chat" exact component={Chat}/>
    <Route path="/signup" exact render={(props) => <Signup {...props}/>}/>
  </Switch>
);

export default Router;
