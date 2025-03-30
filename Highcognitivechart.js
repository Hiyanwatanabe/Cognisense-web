// src/pages/highCognitiveChart.js
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

let cognitiveChart = null; // Store the chart globally

function initCognitiveChart() {
  const canvas = document.getElementById('cognitiveChart');
  if (!canvas) return;

  // Clean up existing chart if one already exists
  if (cognitiveChart) {
    cognitiveChart.destroy();
  }

  cognitiveChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Delta (10%)', 'Theta (15%)', 'Alpha (20%)', 'Beta (30%)', 'Gamma (25%)'],
      datasets: [{
        data: [10, 15, 20, 30, 25],
        backgroundColor: ['blue', 'purple', 'green', 'orange', 'red']
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'white',
            font: { size: 14 }
          }
        },
        datalabels: {
          color: 'white',
          font: { size: 14 },
          formatter: (value) => `${value}%`
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

export default initCognitiveChart;
