// src/pages/HighCognitiveLoad.js
import React, { useEffect } from 'react';
import './HighCogntive.css';
import initCognitiveChart from './Highcognitivechart';

const HighCognitiveLoad = () => {
  useEffect(() => {
    initCognitiveChart();
  }, []);
  const toggleChat = () => {
    const chat = document.getElementById('chat-container');
    if (chat) {
      chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
    }
  };
  
  const sendMessage = () => {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    if (input && input.value.trim() !== '') {
      const msg = document.createElement('div');
      msg.textContent = `You: ${input.value}`;
      messages.appendChild(msg);
      input.value = '';
      messages.scrollTop = messages.scrollHeight;
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };  
  return (
    <div className="container">
      <h1>High Cognitive Load</h1>
      <p>
        Based on your EEG results, your cognitive load is <strong>high</strong>. This means your brain is under significant mental demand.
      </p>

      <div className="score-box">
        Your Test Score: <strong>65%</strong>
      </div>

      <h2>EEG Power Levels (Ranges)</h2>
      <ul>
        <li><strong>Delta Power:</strong> 0.5 - 1.5</li>
        <li><strong>Theta Power:</strong> 1.0 - 2.0</li>
        <li><strong>Alpha Power:</strong> 2.5 - 3.5</li>
        <li><strong>Beta Power:</strong> 6.0 - 7.5</li>
        <li><strong>Gamma Power:</strong> 7.5 - 9.0</li>
      </ul>

      <div className="chart-container">
        <canvas id="cognitiveChart"></canvas>
      </div>

      <div id="chatbot-icon" onClick={() => toggleChat()}>💬 FocusAI</div>

      <div id="chat-container">
        <div id="chat-header">
          <span>FocusAI - Your Cognitive Assistant</span>
          <button onClick={() => toggleChat()}>✖</button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input-container">
          <input type="text" id="chat-input" placeholder="Ask about anything your cognitive load..." onKeyPress={handleKeyPress} />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default HighCognitiveLoad;
