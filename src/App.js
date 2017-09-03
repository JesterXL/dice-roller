import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DiceRoller from './diceroller/DiceRoller';
import RollList from './diceroller/RollList';
import UserList from './userlist/UserList';
import { connectAndListen, publishRollResult, hereNow } from './pubnub';
import _ from 'lodash';
const {pubnub, subject} = connectAndListen();

const appStyle = {
  display: 'flex'
};
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rollResults: [],
        users: []
    };

    setTimeout(hereNow, 5 * 1000);
    
    subject
    .filter(item => item.type === 'message')
    .pluck('data')
    .subscribe(
      message => this.setState({rollResults: [...this.state.rollResults, message.message]})
    );

    subject
    .filter(item => item.type === 'presence')
    .pluck('data')
    .subscribe(
      presence => {
        if(presence.action === 'join')
        {
          this.setState({users: [...this.state.users, {uuid: presence.uuid, id: presence.uuid, state: presence.state}]});
        }
        else if(presence.action === 'leave' || presence.action === 'timeout')
        {
          const index = _.findIndex(this.state.users, item => item.id === presence.uuid);
          const newUsers = [
            ...this.state.users.slice(0, index), 
            ...this.state.users.slice(index + 1)
          ];
          this.setState({users: newUsers});
        }
      }
    );

    subject
    .filter(item => item.type === 'herenow')
    .pluck('data')
    .subscribe(
      users => this.setState({users: users})
    );
  }

  onRollResult = rollResult => {
    this.setState({rollResults: [...this.state.rollResults, rollResult]});
    publishRollResult(rollResult);
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <span style={appStyle}>
            <DiceRoller onRollResult={this.onRollResult} />
            <RollList rollResults={this.state.rollResults} />
            <UserList users={this.state.users} />
          </span>
        </MuiThemeProvider>
      </div>
      
    );
  }
}

export default App;
