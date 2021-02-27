import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Line } from 'react-chartjs-2'
import firebase from "firebase/app";
import "firebase/firestore";
import _ from 'lodash'

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
    text: 'Chart.js Line Chart'
  },
  scales: {
    yAxes: [{
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',
    }],
  }
};

export default function Home() {
  var [data, setData] = useState({
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
          const strategies = _.groupBy(data, x => x.strategyName);
  
          const dataSets = Object.keys(strategies).map(stategy => ({
            label: stategy,
            fill: false,
            data: strategies[stategy].map(x => x.percentageMade),
            yAxisID: 'y-axis-1',
          }))
  
          setData({
            labels: labels,
            datasets: dataSets
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
  }, [db, setData, _]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Trader Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ minWidth: '700px' }}>
          <Line data={data} options={options} />
        </div>
      </main>
    </div>
  )
}
