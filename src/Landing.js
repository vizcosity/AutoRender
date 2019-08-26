import React from 'react';
import {
  Grommet,
  Box,
  Heading,
  Button
} from 'grommet';
import { Add, List } from 'grommet-icons';
import { Link } from 'react-router-dom';

// Stylingn.
import './App.css';



const AppBar = (props) => <Box
  tag='header'
  direction='row'
  align='center'
  justify='between'
  background='brand'
  pad={{left: 'medium', right: 'small', vertical: 'large'}}
  style={{ zIndex: '1' }}
{...props}
/>


const Buttons = () =>
<Box
  margin={{vertical: 'small'}}
  direction='row'
  justify='center'
  margin={{left: 'auto', right: 'auto', vertical: 'medium'}}
  style={{padding: '50px', borderRadius: '20px'}}
>
  <Button to="/newRenderJob" margin='10px' color='dark-1' primary hoverIndicator={true} icon={<Add />} label="New Render Job" as={Link}></Button>
  <Button to="/manageJobs" margin='10px'color='dark-2' hoverIndicator={true} icon={<List />} label="Manage Jobs" as={Link}></Button>
</Box>

const Landing = () =>
<Box
  flex
  justify='center'
  align='center'
  fill='vertical'
>
  <Heading level='1' margin='0' color='gray'>AutoRender</Heading>
  <Buttons />
</Box>

export default Landing;
