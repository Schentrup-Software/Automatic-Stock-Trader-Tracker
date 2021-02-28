import { useState, useEffect } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2'
import firebase from "firebase/app";
import "firebase/firestore";
import _ from 'lodash'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

var config = {
  apiKey: "AIzaSyCd7-gIX5Pe4pCusNBHERIF6_p_uPV_42c",
  authDomain: "automatic-stock-trader-tracker.firebaseapp.com",
  projectId: "automatic-stock-trader-tracker",
  storageBucket: "automatic-stock-trader-tracker.appspot.com",
  messagingSenderId: "514111106421",
  appId: "1:514111106421:web:77f1d340eea4e85fa7b73c"
};
const app = !firebase.apps.length
    ? firebase.initializeApp(config)
    : firebase.app()
const db = app.firestore()

const lowerBound = new Date();
lowerBound.setDate(lowerBound.getDate() - 365);

var options = {
  responsive: true,
  hoverMode: 'index',
  stacked: false,
  title: {
    display: true,
    text: 'Strategy performance over time'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Time'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Value'
      }
    }]
  }
};

var backgroundColors = ['rgb(112, 214, 255)', 'rgb(255, 112, 166)', 'rgb(255, 151, 112)', 'rgb(255, 214, 112)', 'rgb(233, 255, 112)']
var borderColors = ['rgb(112, 214, 255, 0.2)', 'rgb(255, 112, 166, 0.2)', 'rgb(255, 151, 112, 0.2)', 'rgb(255, 214, 112, 0.2)', 'rgb(233, 255, 112, 0.2)']

function App() {
  var [data, setData] = useState<any>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    db.collection("tracking")
      .where('Date', '>=', lowerBound)
      .get()
      .then((querySnapshot) => {
          const data = querySnapshot.docs.map(x => x.data());
          const labels =  _.uniq(data.map(x => (new Date(x.Date.seconds * 1000)).toLocaleDateString("en-US")));
          const strategies = _.groupBy(data, (x: { strategyName: any; }) => x.strategyName);

          const dataSets = Object.keys(strategies).map((stategy, i) => ({
            label: stategy,
            fill: false,
            backgroundColor: backgroundColors[i],
            borderColor: borderColors[i],
            data: strategies[stategy].map((x) => (x as any).percentageMade)
          }))

          setData({
            labels: labels,
            datasets: dataSets
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
  }, [setData]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Trader Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className="app" maxWidth="sm">
        <Card>
          <CardContent>
            <div className="chart-container">
              <Line data={data} options={options} />
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;


