

# slack-logger
A simple logger that replace console.log and send the log to Slack channel with Webhook

## Usage
```  
// Import the logger const SlackLogger = require('@lhkt/slack-logger');  
  
// Initialise the logger with your webhook URL  
SlackLogger.init("Your_Webhook_URL");   
// Use as an ordinary logger  
SlackLogger.logi("Info Testing Log");  
SlackLogger.logd("Debug Testing Log");  
SlackLogger.loge("Error Testing Log"); 

// Example output: 
(local)[INFO]
[at \xxx\xxx\index.js:xx:xx]
2021-05-01 12:34:56.789: Info Testing Log
```  

### SlackLogger.init(hookUrl, env = "default", isSendSlack = true)

| Parameter | Type | Compulsory? | Default | Description |
|--|--|--|--|--|
| hookUrl | string | Y |  | Slack Webhook URL |
| env  | string | N | "default" | Environment tag at the beginning of every log |
| isSendSlack | boolean| N | true | Determine if logs should send to Slack. If false, the logger will only run console.log() locally. |


## Get Your Webhook URL

1. Create a new Slack App on https://api.slack.com/apps/
2. Go to the page of your new Slack App
3. Click "Basic Information" > "Add features and functionality" > "Incoming Webhooks"
4. Switch on "Activate Incoming Webhooks"
5. Click the "Add New Webhook to Workspace" at the bottom
6. Follow the instruction to select the channel and get your webhook URL