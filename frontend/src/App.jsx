import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [logs, setLogs] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!logs.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { logs });
      setResults(response.data);
    } catch (err) {
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>🔥 Realtime Log Analyzer</h1>
      <textarea 
        rows="10" 
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        placeholder="Paste your logs here..."
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
      />
      <button 
        onClick={handleAnalyze}
        disabled={loading}
        style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Analyzing...' : 'Analyze Now'}
      </button>

      {results && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
          <h3>Results:</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <p>🔴 Errors: {results.severity.ERROR}</p>
            <p>🟠 Warnings: {results.severity.WARN}</p>
            <p>🔵 Info: {results.severity.INFO}</p>
          </div>
          <p>📅 Timestamps Found: {results.timestampsFound}</p>
          <h4>Keywords:</h4>
          <ul>
            {Object.entries(results.keywords).map(([kw, count]) => (
              <li key={kw}>{kw}: {count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;