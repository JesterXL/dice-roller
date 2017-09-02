import React, { Component } from 'react';
import d4 from './images/d4-icon.png';
import d6 from './images/d6-icon.png';
import d8 from './images/d8-icon.png';
import d10 from './images/d10-icon.png';
import d12 from './images/d12-icon.png';
import d20 from './images/d20-icon.png';
import d100 from './images/d100-icon.png';
import Slider from 'material-ui/Slider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import _ from 'lodash';

const imageStyle = {
    cursor: 'pointer',
    width: '32px',
    maxWidth: '32px'
};
const cardStyle = {
    width: '320px',
    maxWidth: '320px'
};
const diceListStyle = {
    listStyleType: 'none'
}
class DiceRoller extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            howMany: 1,
            whatType: 20,
            rollResult: {
                howMany: 1,
                whatType: 20,
                total: 0
            }
        };
    }

    setHowMany = (event, value) => {
        this.setState({howMany: value});
    }

    rollD4 = event => this.setState({whatType: 4});
    rollD6 = event => this.setState({whatType: 6});
    rollD8 = event => this.setState({whatType: 8});
    rollD10 = event => this.setState({whatType: 10});
    rollD12 = event => this.setState({whatType: 12});
    rollD20 = event => this.setState({whatType: 20});
    rollD100 = event => this.setState({whatType: 100});

    randomRoll = type => Math.floor(Math.random() * type) + 1;
    rollDice = (howMany, whatType) => _.chain(Array(howMany))
        .map(item => this.randomRoll(whatType))
        .map(result => ({howMany, whatType, result}))
        .reduce( (acc, item) => Object.assign({}, item, {
            results: [...acc.results, item.result],
            total: acc.total + item.result
         }), {results: [], howMany, whatType, total: 0})
        .value();
    
    roll = event => {
        const rollResult = this.rollDice(this.state.howMany, this.state.whatType);
        if(this.props.onRollResult)
        {
            this.props.onRollResult(rollResult);   
        }
        this.setState({rollResult: rollResult});
    }

    render() {
        return (
        <Card style={cardStyle}>
        <CardHeader
          title="Dice Roller"
          subtitle="Select how many and what type"
        />
        <CardText>
            <b>How Many: {this.state.howMany}</b>
            <Slider
                min={1}
                max={10}
                step={1}
                value={this.state.howMany}
                onChange={this.setHowMany}
                />
    
            <b>What Type: d{this.state.whatType}</b>
            <ul style={diceListStyle}>
                <li>d4: <img src={d4} style={imageStyle} onClick={this.rollD4} /></li>
                <li>d6: <img src={d6} style={imageStyle} onClick={this.rollD6} /></li>
                <li>d8: <img src={d8} style={imageStyle} onClick={this.rollD8} /></li>
                <li>d10: <img src={d10} style={imageStyle} onClick={this.rollD10} /></li>
                <li>d12: <img src={d12} style={imageStyle} onClick={this.rollD12} /></li>
                <li>d20: <img src={d20} style={imageStyle} onClick={this.rollD20} /></li>
                <li>d100: <img src={d100} style={imageStyle} onClick={this.rollD100} /></li>
            </ul>
            {/* <b>Roll Results:</b>
            <p>How Many: {this.state.rollResult.howMany}</p>
            <p>What Type: {this.state.rollResult.whatType}</p>
            <p>Total: {this.state.rollResult.total}</p> */}
        </CardText>
        <CardActions>
          <RaisedButton label="Roll" primary={true} onClick={this.roll} />
        </CardActions>
      </Card>
        );
    }
}

export default DiceRoller;