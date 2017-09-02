import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DiceRoller from './diceroller/DiceRoller';
import RollList from './diceroller/RollList';

const appStyle = {
  display: 'flex'
};
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rollResults: []
    };
  }

  onRollResult = rollResult => this.setState({rollResults: [...this.state.rollResults, rollResult]});

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <span style={appStyle}>
            <DiceRoller onRollResult={this.onRollResult} />
            <RollList rollResults={this.state.rollResults} />
          </span>
        </MuiThemeProvider>
      </div>
      
    );
  }
}

export default App;
