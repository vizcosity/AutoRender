import React, { Component } from 'react';
import { Box, Heading, Anchor } from 'grommet';

export default class Footer extends Component {

  render(){
    return (
      <Box
          style={{
            padding: '25px',
            marginTop: 'auto'
          }}
          margin={{ top: 'auto' }}
          color='dark-1'
          background='dark-1'
          fill='horizontal'
          align='center'
          as='footer'
        >
        <Heading center level='3' size='xsmall'>Video rendering automation made with ☕️ & ❤️ by <Anchor href="http://aaronbaw.com/" label="Aaron" /></Heading>
      </Box>
    );
  }
}
