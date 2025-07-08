/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/react-in-jsx-scope *//* eslint-disable linebreak-style */
import { Route, Switch } from 'react-router';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Guard from './guard'
import Chat from '../pages/chat';

const Router = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Switch>
    <Route path="/" exact>
      <Login/>
    </Route>
    <Route path="/chat" exact render={(props) => {
      const query = new URLSearchParams(props.location.search);
      const isRoomChat = query.get('roomId') && query.get('username');
      
      if(isRoomChat) {
        return <Chat {...props}/>;
      } else {
        return <Guard path="/chat" exact component={Chat} {...props}/>;
      }
    }}/>
    <Route path="/signup" exact render={(props) => <Signup {...props}/>}/>
    }
  </Switch>
);

export default Router;
