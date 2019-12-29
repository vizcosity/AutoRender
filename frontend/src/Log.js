/**
 * Log Component for react.
 */

import React, { Component } from 'react';
import { Paragraph, Heading } from 'grommet';
import { getLogs } from './AutoRenderAPI';

const LogContainer = ({logs}) => <div className="log-container">
  {
    logs.map(log =>
      <Paragraph
      style={{maxWidth: 'unset'}}
      color="dark-2"
      size="small">{log}
      </Paragraph>)
  }
</div>

export default class Log extends Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      logs: "Loading..."
    }

    this.fetchAndDisplayLogs = this.fetchAndDisplayLogs.bind(this);

    this.fetchAndDisplayLogs();
    // Set a recurring job to fetch the logs and display them.
    setInterval(this.fetchAndDisplayLogs, 2000);

  }

  fetchAndDisplayLogs(){
    getLogs().then(logs => {
      this.setState({...this.state, logs: logs.replace(/info: /g, '')})
    });
  }

  render(){
    return (
      <div className="log-and-text-container">
      <Heading color='dark-3'>Logs</Heading>
      <LogContainer
        logs={this.state.logs.split('\n').reverse()}
      />
      </div>
    );
  }
}
