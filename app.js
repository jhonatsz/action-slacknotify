const { WebClient } = require('@slack/web-api');
const core = require('@actions/core');
const github = require('@actions/github');

// Variables Configuration

// Get Inputs
const channelId = core.getInput('channelId');
const notifStatus = core.getInput('notifStatus');

const label = core.getInput('label');
const pipelineUrl = core.getInput('pipelineUrl');

const details = core.getInput('details');

// Set Outputs
//const time = (new Date()).toTimeString();
//core.setOutput("time", time);

// Initialize a WebClient instance with your token
const token = core.getInput('slackToken');
const client = new WebClient(token);

// Attempt to send a message when the pipeline starts...
async function notifyStart() {
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await client.chat.postMessage({
      channel: channelId,
      text: " ",
      attachments: [
        {
          "color": "#36a64f",
          "blocks": [
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `🚀 ${label} (<${pipelineUrl}|See Pipeline Details>) 🚀`
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "🟠 Started"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": " "
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "DETAILS:"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `${details}`
              }
            }
          ]
        }
      ]
    });

    core.setOutput("ts", result.ts);
    //console.log(result.ts);
    console.log(result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Attempt to send a message when the pipeline finished..
async function notifyFinish(status) {
  const ts = core.getInput('ts');
  console.log(ts);
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await client.chat.update({
      channel: channelId,
      ts: ts,
      text: " ",
      attachments: [
        {
          "color": "#36a64f",
          "blocks": [
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `🚀 ${label} (<${pipelineUrl}|See Pipeline Details>) 🚀`
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "🟢 Completed"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": " "
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "DETAILS:"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `${details}`
              }
            }
          ]
        }
      ]
    });

    console.log(result);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Send the notification
switch(notifStatus) {
  case 'pipelineStart':
    console.log('Deployment Started...')
    notifyStart();
    break;

  case 'pipelineSuccess':
    console.log('Deployment Finished Successfully...')
    notifyFinish('success');
    break;

  case 'pipelineFailed':
    console.log('Deployment Finished but Failed...');
    notifyFinish('failed');
    break;

  default:
    console.log('no case selected');
}

