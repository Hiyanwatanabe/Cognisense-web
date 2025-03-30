// src/pages/DashboardPage.js
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

const DashboardPage = ({ currentUser }) => {
  const [scores, setScores] = useState({ labels: [], data: [] });
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (!currentUser) {
        alert("Please login to view the dashboard.");
        return;
      }
      const scoresRef = collection(db, "scores");
      const q = query(scoresRef, where("user", "==", currentUser), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const timeLabels = [];
      const scoresData = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Convert Firestore timestamp to a date string
        const dateStr = new Date(data.timestamp.seconds * 1000).toLocaleString();
        timeLabels.push(dateStr);
        scoresData.push(data.score);
      });
      // Reverse arrays so that older scores are on the left
      setScores({ labels: timeLabels.reverse(), data: scoresData.reverse() });
    };

    fetchScores();
  }, [currentUser]);

  useEffect(() => {
    if (scores.labels.length > 0 && chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }
      const newChart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: scores.labels,
          datasets: [{
            label: 'Scores Over Time',
            data: scores.data,
            backgroundColor: 'rgba(240, 165, 0, 0.3)',
            borderColor: 'rgba(240, 165, 0, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
      setChartInstance(newChart);
    }
  }, [scores]);

  return (
    <div className="dashboard-page container">
      <h2>Cognitive Load Dashboard</h2>
      <div id="cognitive-load-summary">
        <h3>Last Session's Cognitive Load: <span id="cognitive-load-result">Loading...</span></h3>
      </div>
      <h3>EEG Frequency Bands</h3>
      <canvas id="eegChart"></canvas>
      <h3>Task Performance</h3>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody id="scoreTable">
          {/* Render breakdown here if you choose */}
        </tbody>
      </table>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DashboardPage;
