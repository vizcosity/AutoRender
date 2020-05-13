import React, { Component } from 'react';
import {
  getJobs,
  downloadJobResult,
  cancelOrDeleteJob
} from './AutoRenderAPI';
import { Fade } from 'react-reveal';
import {
  Download,
  Halt,
  Trash
} from 'grommet-icons';
import {
  Grommet,
  Box,
  Button,
  DataTable,
  Meter,
  Text,
  CheckBox,
  Anchor,
  Heading
} from "grommet";
import { ScaleLoader } from 'react-spinners';

const statusColourMap = {
  completed: 'status-ok',
  rendering: 'status-warning',
  failed: 'status-error',
  pending: 'status-unknown'
};

const columns = [
  // {
  //   property: "date",
  //   header: "Date",
  //   render: datum =>
  //   datum.date && new Date(datum.date).toLocaleDateString("en-US"),
  //   align: "end",
  // },
  {
    property: "key",
    header: "#",
    render: item => <Text>{item.key}</Text>
  }, {
    property: "artistName",
    header: "Artist",
    render: item => <Text weight="bold">{item.artistName}</Text>
  },
  {
    property: "songName",
    header: "Song"
  },
  {
    property: "status",
    header: "Status",
    render: item => {
      return <Text color={statusColourMap[item.status]}>{item.status}</Text>
    }
  },
  {
    property: "progress",
    header: "Progress",
    render: item => {
      return <Text color={'status-unknown'}>{`${item.progress}%`}</Text>
    }
  },
  {
    property: "download",
    header: "Download",
    align: "center",
    render: item =>
      <Button
        style={{
          padding: '5px',
          borderRadius: '5px'
        }}
        hoverIndicator={true}
        as="a"
        href={item.status === 'completed' ? `/api/v1/jobResult?id=${item.id}` : null}
        disabled={item.status !== 'completed'}
      >
        <Download />
      </Button>
  },
  {
    property: "clean",
    header: "Clean",
    align: "center",
    render: item =>
      <Button
        style={{
          padding: '5px',
          borderRadius: '5px'
        }}
        hoverIndicator={true}
        as="a"
        onClick={() => window.confirm("This will cancel the job. Are you sure?") ? cancelOrDeleteJob(item.id) : ""}
        // href={item.status === 'completed' ? `/api/v1/jobResult?id=${item.id}` : null}
      >
        {
          item.status === 'rendering' ? <Halt />
          : <Trash />
        }
      </Button>
  }
]

class JobsTable extends Component {

  render() {
    return (
        <Box align="center" pad="large">
          <DataTable
            columns={this.props.columns}
            data={this.props.data}
          />
        </Box>
    );
  }
}

export default class ManageJobs extends Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      jobs: null
    };

    getJobs({truncateBuffers: true}).then(result => this.setState({
      ...this.state,
      jobs: result.jobs
    }));

  }

  render(){
    console.log(this.state.jobs);
    return (
      <Box pad='large' align='center'>
      <Box margin={{vertical: 'large'}}>
        <Heading margin='none' color='dark-1' level="1" size="small">
          What's cooking, b0ss?
        </Heading>
        <Heading color='dark-2' margin='none' level="2" size="xsmall">
          View all the jobs below. Cooked, pending, or spoilt.
        </Heading>
      </Box>
        {
          this.state.jobs ? <Fade><JobsTable
            data={this.state.jobs.map((item, i) => Object({
              ...item,
              ...item.details,
              key: i
            }))}
            columns={columns}
          /></Fade> : <Text>Loading...</Text>
        }

      </Box>
    );
  }
}
