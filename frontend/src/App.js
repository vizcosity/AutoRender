import React from 'react';
import { Grommet, Box } from 'grommet';
import Landing from './Landing';
import NewRenderJob from './NewRenderJob';
import ManageJobs from './ManageJobs';
import Footer from './Footer';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { grommet } from 'grommet/themes';

// Stylingn.
import './App.css';

const theme = {
  global: {
   colors: {
     brand: 'white',
   },
    font: {
      family: 'Open Sans ',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  return (
    <Grommet theme={grommet} plain full>
    <Box
      className="app-container"
      style={{
        minHeight: '100%'
      }}
    >
      <Router>
        <Route exact path="/" component={() => <Landing />} />
        <Route exact path="/newRenderJob" component={() => <NewRenderJob />} />
        <Route exact path="/manageJobs" component={() => <ManageJobs />} />
      </Router>
      <Footer />
    </Box>
    </Grommet>
  );
}

export default App;
