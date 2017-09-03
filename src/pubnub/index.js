import PubNub from 'pubnub';
import { Subject } from 'rxjs';
import uuidv4 from 'uuid/v4';

const me = uuidv4();
const subject = new Subject();

const pubnub = new PubNub({
    uuid: me,
    publishKey : "pub-c-7527a43a-fccf-449a-8c6e-f3d7a59c3e44",
    subscribeKey : "sub-c-e7ad07c0-8dea-11e7-80ad-ba6da068eefb"
});



export const publishRollResult = rollResult =>
{
    pubnub.publish({
        message: {
            type: 'rollResult',
            data: rollResult,
            id: me
        },
        channel: 'dice',
    }, (status, response) => { 
        console.log("pubnub publish response, status:", status);
        console.log("pubnub publish response, response:", response);
    });
};

export const hereNow = () =>
    pubnub.hereNow(
    {
        channels: ["dice"],
        includeUUIDs: true,
        includeState: true
    },
    (status, response) => {
        console.log("hereNow, status:", status);
        console.log("hereNow, response:", response);
        subject.next({type: 'herenow', data: response.channels.dice.occupants});
    });

export const connectAndListen = () =>
{

    pubnub.subscribe({
        channels: ['dice'],
        withPresence: true
    });

    pubnub.addListener({   
        message: m => {
            console.log("message:", m);
            // handle message
            var actualChannel = m.actualChannel;
            var channelName = m.channel; // The channel for which the message belongs
            var msg = m.message; // The Payload
            var publisher = m.publisher;
            var subscribedChannel = m.subscribedChannel;
            var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = m.timetoken; // Publish timetoken  
            if(m.message && m.message.id === me)
            {
                return;
            }
            subject.next({type: 'message', data: m});  
        },
        presence: p => {
            console.log("presence:", p);
            // handle presence
            var action = p.action; // Can be join, leave, state-change or timeout
            var channelName = p.channel; // The channel for which the message belongs
            var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
            var presenceEventTime = p.timestamp; // Presence event timetoken
            var status = p.status; // 200
            var message = p.message; // OK
            var service = p.service; // service
            var uuids = p.uuids;  // UUIDs of users who are connected with the channel with their state
            var occupancy = p.occupancy; // No. of users connected with the channel
            subject.next({type: 'presence', data: p});
        },
        status: function(s) {
            console.log("status:", s);
            // handle status
            var category = s.category; // PNConnectedCategory
            var operation = s.operation; // PNSubscribeOperation
            var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
            var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
            var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
            var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
            var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
        }
    });

    return {pubnub, subject};
};
 