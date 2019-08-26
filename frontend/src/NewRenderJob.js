import React, { Component } from 'react';
import {
  Box,
  Heading,
  Form,
  FormField,
  Button,
  Anchor,
  Text
} from 'grommet';
import { Fade } from 'react-reveal';
import { Add } from 'grommet-icons';
import { ScaleLoader } from 'react-spinners';
import { enqueueJob } from './AutoRenderAPI';
import { Validate } from 'grommet-icons';

const FormHeader = () => <Box
  style={{
    maxWidth:'500px'
  }}
  margin={{vertical: 'medium'}}
  fill='horizontal'
  justify='center'
>
  <Heading style={{
    display: 'flex',
    alignItems: 'center'
  }} color='dark-2' level='3'><Add style={{marginRight: '10px', opacity: '0.6'}} />Add a new Render Job</Heading>
  <Heading color='dark-3' margin='none' level='4'>Make sure everything is correct or else you'll waste a few hours yo</Heading>
</Box>

export default class NewRenderJob extends Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      submitting: false,
      postSubmission: null
    }

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onSubmitHandler(e){

    this.setState({
      ...this.state,
      submitting: true,
    }, () => {
      var formValues = {
        ...e.value
      };

      console.log(e.target);


      // Grab all of the files and attatch them to the formValues object.
      for (var i = 0; i < e.target.length; i++){
      var input = e.target[i];
        if (input.files){
          console.log(input, input.files);
          formValues[input.name] = input.files[0]
        }
      }

      enqueueJob({
        ...formValues,
        truncateBuffers:  true
      })
      .then(result => {
      if (result.success)
          this.setState({
            ...this.state,
            postSubmission: result.job.id
          });
      });

    });
  }

  render(){
    return (
      <Box flex margin={{vertical: 'medium'}} align='center' justify='center'>
      <FormHeader />
        <Box
          fill='horizontal'
          margin={{vertical: 'large'}}
          style={{maxWidth: '500px'}}
        >
        {
          !this.state.submitting ?
            <Form onSubmit={this.onSubmitHandler}>
              <Heading level='3'>Song Details</Heading>

              <FormField required name="artistName" label="Artist Name" placeholder="Porter Robinson"/>
              <FormField required name="songName" label="Song Name" placeholder="Sad Machine"/>
              <FormField required name="genre" label="Genre" placeholder="Electronic" value="Electronic"/>
              <FormField required name="visualizerColour" label="Visualizer Colour" help="Must be a valid hex value e.g. #FFEA32" htmlFor="test" />

              <Heading level='3'>Files</Heading>

              <FormField required name="backgroundFile" label="Background Image" type="file" />
              <FormField  name="songFile" label="Song File" type="file" />
              <FormField  name="artworkFile" label="Artwork Image" type="file" />


              <Button type="submit" primary color='dark-1' label="Submit" />
            </Form> :
              <Fade>
                <Box align='center' direction='column'>
                  {
                    !this.state.postSubmission ?
                    <React.Fragment>
                      <ScaleLoader
                        size='large'
                        color="#555555"
                      />
                      <Text color='dark-2'>Queuing up...</Text>
                    </React.Fragment> :
                    <React.Fragment>
                      <Validate color='status-ok'/>
                      <Text
                        margin={{vertical: 'small'}}
                        color='status-ok'
                      >Queued {this.state.postSubmission}</Text>
                      <Button
                        margin={{vertical : 'large' }}
                        label="View Jobs"
                        color='dark-1'
                        as='a'
                        href='/manageJobs'
                        primary
                      />
                    </React.Fragment>
                  }

              </Box>
              </Fade>

        }

        </Box>
      </Box>
    );
  }
}
