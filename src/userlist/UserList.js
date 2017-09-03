import React from 'react';
import _ from 'lodash';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const cardStyle = {
    width: '320px',
    maxWidth: '320px'
};

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    render() {
        return (
        <Card style={cardStyle}>
            <CardHeader
            title="Users"
            />
            <CardText>
                {this.renderUsers()}
            </CardText>
        </Card>
      )
    }

    renderUsers() {
        if(_.isNil(this.props.users) || this.props.users.length < 1)
        {
            return (<div>No users connected at this time.</div>);   
        }
        const items = _.map(this.props.users, item => {
            return <li key={item.uuid}>
                <b>UUID:</b> {item.uuid}
                <p>state: {item.state}</p>
            </li>
        }
        );
        return (
            <ul>
                {items}
            </ul>
        )
    }
}

export default UserList;