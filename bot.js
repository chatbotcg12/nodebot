const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = 'xoxp-625357365425-631665548645-639835141363-2230654fc20a606537cd7008d0d43004';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'examplebot';
const allCommands = ['issue:', 'command2:'];

let users = [];

function executeCommand(command, args) {
    console.log(command, args);
}

function updateUsers(data) {
    users = data.members;
}

function getUsernameFromId(id) {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'unknown member';
}

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if (message.type === 'message' && message.text) {
        const userName = getUsernameFromId(message.user);
        if (userName !== robotName) {
            if (message.text.indexOf(robotName) !== -1) {
                rtm.sendMessage('Hey ' + userName + ', I heard that!', message.channel);
            }
            if (message.text.indexOf(':') !== -1) {
                allCommands.forEach((command) => {
                    if (message.text.indexOf(command) === 0) {
                        const args = message.text.substring(command.length);
                        executeCommand(command, args);
                    }
                });
            }
        }
    }
});

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err);
    } else {
        updateUsers(data);
    }
});

rtm.start();