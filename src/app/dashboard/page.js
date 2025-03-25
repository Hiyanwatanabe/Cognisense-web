'use client';

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function EEGControlPage() {
  const [isEEGRunning, setIsEEGRunning] = useState(false);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const eegIntervalRef = useRef(null);

  useEffect(() => {
    // Create chart instance once, on mount
    const ctx = chartRef.current.getContext('2d');
    const instance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Delta',
            data: [],
            borderColor: 'rgba(0, 255, 255, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Theta',
            data: [],
            borderColor: 'rgba(0, 200, 0, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Alpha',
            data: [],
            borderColor: 'rgba(255, 255, 0, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Beta',
            data: [],
            borderColor: 'rgba(255, 128, 0, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Gamma',
            data: [],
            borderColor: 'rgba(255, 0, 255, 1)',
            borderWidth: 2,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amplitude'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        }
      }
    });
    setChartInstance(instance);

    // Cleanup: destroy chart on unmount
    return () => {
      instance.destroy();
    };
  }, []);

  // Start simulating EEG data
  function startEEG() {
    if (isEEGRunning) return;
    setIsEEGRunning(true);

    eegIntervalRef.current = setInterval(() => {
      if (!chartInstance) return;
      const now = new Date().toLocaleTimeString();

      // Add label
      chartInstance.data.labels.push(now);
      // Add random data for each dataset
      chartInstance.data.datasets.forEach(ds => {
        ds.data.push(Math.random().toFixed(2));
      });

      // Keep last 20 data points
      if (chartInstance.data.labels.length > 20) {
        chartInstance.data.labels.shift();
        chartInstance.data.datasets.forEach(ds => ds.data.shift());
      }

      chartInstance.update();
    }, 2000);
  }

  // Stop simulating
  function stopEEG() {
    setIsEEGRunning(false);
    clearInterval(eegIntervalRef.current);
  }

  // Example distractions
  function sendDistraction(type) {
    alert(`Distraction triggered: ${type}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cognisense Control + EEG Chart
      </h1>

      {/* EEG Controls */}
      <div className="bg-white/10 p-6 rounded shadow max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-4">EEG Controls</h2>
        <div className="flex space-x-4">
          <button
            onClick={startEEG}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Start EEG
          </button>
          <button
            onClick={stopEEG}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Stop EEG
          </button>
        </div>
      </div>

      {/* Distractions */}
      <div className="bg-white/10 p-6 rounded shadow max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold mb-4">Distractions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => sendDistraction('FLASH')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            FLASH
          </button>
          <button
            onClick={() => sendDistraction('SOUND')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            SOUND
          </button>
          <button
            onClick={() => sendDistraction('SHAKE')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            SHAKE
          </button>
          <button
            onClick={() => sendDistraction('HIDE_TEXT')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            HIDE_TEXT
          </button>
          <button
            onClick={() => sendDistraction('INVERT_COLORS')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            INVERT_COLORS
          </button>
          <button
            onClick={() => sendDistraction('RANDOM_POPUP')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            RANDOM_POPUP
          </button>
          <button
            onClick={() => sendDistraction('INPUT_LAG')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            INPUT_LAG
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/10 p-6 rounded shadow max-w-3xl mx-auto">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
