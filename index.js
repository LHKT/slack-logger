const moment = require("moment");
const Slack = require('node-slack');

class SlackLogger {
  static logger = null;
  static env = "default";
  static isSendSlack = true;

  static init(hookUrl, env = "default", isSendSlack = true) {
    SlackLogger.logger = new Slack(hookUrl);
    SlackLogger.env = env;
    SlackLogger.isSendSlack = isSendSlack;
  }

  static getCaller(msg) {
    let e = new Error();
    if (!e.stack)
      try {
        // IE requires the Error to actually be thrown or else the
        // Error's 'stack' property is undefined.
        throw e;
      } catch (e) {
        if (!e.stack) {
          //return 0; // IE < 10, likely
        }
      }
    let stack = e.stack.toString().split(/\r\n|\n/);
    if (msg === '') {
      msg = '""';
    }
    return stack[4].trim();
  }

  static handleMsg(msg) {
    if (msg === null){
      msg = 'null';
    }
    if (typeof msg === "undefined"){
      msg = 'undefined';
    }
    if (msg instanceof Object){
      try{
        msg = JSON.stringify(msg);
      } catch (e) {
        console.log(`(${SlackLogger.env})[ERROR]\n[at handleMsg (/slack-logger/index.js:40)]\n${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS')}: ${JSON.stringify(e.message)}`);
      }
    }
    return msg;
  }

  static logi(...args) {
    SlackLogger.log(args, 'INFO');
  }

  static logd(...args) {
    SlackLogger.log(args, 'DEBUG');
  }

  static loge(...args) {
    SlackLogger.log(args, 'ERROR');
  }

  static log(args, type) {
    if (!SlackLogger.logger) return console.log(`(${SlackLogger.env})[ERROR]\n[at log (/slack-logger/index.js:59)]\n${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS')}: Slack logger called before initialization`);
    try{
      // Handle type of incoming msg
      let msg = '';
      for (let i = 0; i < args.length; i++){
        if (i !== 0) msg += ' ';
        msg += SlackLogger.handleMsg(args[i])
      }

      // Get caller function and line
      let sourceLine = SlackLogger.getCaller();

      // Format logging
      let text = `(${SlackLogger.env})[${type}]\n[${sourceLine}]\n${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS')}: ${msg}`;

      // Console log to local output
      console.log(text);
      if (!SlackLogger.isSendSlack) return;

      // Send to Slack
      SlackLogger.logger.send({text});

    } catch (e) {
      console.log(`(${SlackLogger.env})[ERROR]\n[at log (/slack-logger/index.js:81)]\n${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS')}: ${JSON.stringify(e.message)}`);
    }
  }
}

module.exports = SlackLogger;