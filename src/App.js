import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DiceRoller from './diceroller/DiceRoller';
import RollList from './diceroller/RollList';
import UserList from './userlist/UserList';
import { connectAndListen, publishRollResult, hereNow, changeUserName } from './pubnub';
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
        const removeDupes = list => _.chain(list).sortBy(['created']).uniqBy(item => item.uuid).value();
        if(presence.action === 'join')
        {
          const list = removeDupes([...this.state.users, {
            uuid: presence.uuid, 
            id: presence.uuid, 
            state: presence.state,
            created: Date.now()
          }]);
          this.setState({users: list});
        }
        else if(presence.action === 'leave' || presence.action === 'timeout')
        {
          const index = _.findIndex(this.state.users, item => item.id === presence.uuid);
          const newUsers = [
            ...this.state.users.slice(0, index), 
            ...this.state.users.slice(index + 1)
          ];
          const list = removeDupes(newUsers);
          this.setState({users: list});
        }
        else if(presence.action === 'state-change')
        {
          const index = _.findIndex(this.state.users, item => item.id === presence.uuid);
          const newUsers = [
            ...this.state.users.slice(0, index),
            {uuid: presence.uuid, id: presence.uuid, state: presence.state, created: Date.now()},
            ...this.state.users.slice(index + 1)
          ];
          // const list = removeDupes(newUsers);
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

  changeName = newName => {
    changeUserName(newName);
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <span style={appStyle}>
            <DiceRoller onRollResult={this.onRollResult} />
            <RollList rollResults={this.state.rollResults} />
            <UserList users={this.state.users} onChangeName={this.changeName} />
          </span>
        </MuiThemeProvider>
      </div>
      
    );
  }
}

export default App;
