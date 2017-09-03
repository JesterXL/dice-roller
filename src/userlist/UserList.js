import React from 'react';
import _ from 'lodash';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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

    changeName = () => {
        if(this.props.onChangeName)
        {
            this.props.onChangeName(this.state.newName);   
        }
    }

    onNewNameChange = event => {
        this.setState({
            newName: event.target.value
        })
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
            <CardActions>
                <TextField hintText="Your Name" onChange={this.onNewNameChange} />
                <RaisedButton label="Change Name" onClick={this.changeName} />
            </CardActions>
        </Card>
      )
    }

    getUserName = user =>
        _.get(user, 'state.name') ? _.get(user, 'state.name')
        : user.uuid.substr(0, 5) + '...';

    renderUsers() {
        if(_.isNil(this.props.users) || this.props.users.length < 1)
        {
            return (<div>No users connected at this time.</div>);   
        }
        const items = _.map(this.props.users, item => {
            return <li key={item.uuid}>
                <b>{this.getUserName(item)}</b>
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