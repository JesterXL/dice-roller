import React from 'react';
import _ from 'lodash';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const cardStyle = {
    width: '460px',
    maxWidth: '460px'
};

class RollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rollResults: []
        };
    }

    render() {
        return (
        <Card style={cardStyle}>
            <CardHeader
            title="Dice Roll Results"
            />
            <CardText>
                {this.renderRollResults()}
            </CardText>
        </Card>
      )
    }

    renderRollResults() {
        if(_.isNil(this.props.rollResults) || this.props.rollResults.length < 1)
        {
            return (<div>No rolls to show yet.</div>);   
        }
        const items = _.map(this.props.rollResults, item =>
            <li>Rolled a <b>{item.total}</b> on a {item.howMany}d{item.whatType}</li>
        );
        return (
            <ul>
                {items}
            </ul>
        )
    }
}

export default RollList;