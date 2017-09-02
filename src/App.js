import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DiceRoller from './diceroller/DiceRoller';

class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <DiceRoller />
        </MuiThemeProvider>
      </div>
      
    );
  }
}

export default App;
