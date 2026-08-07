import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';

const Chat = ({ startupId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${startupId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchHistory();
  }, [startupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { startupId, message: userMsg.content });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Chat error:', err);
      // Optional: Add error message to chat UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="mono">Co-Founder Chat</h1>
        <p style={{ color: 'var(--text-muted)' }}>Discuss strategy, ask for advice, or vent.</p>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              No messages yet. Say hello to your AI co-founder!
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={msg._id || idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#2d3748' : '#1a202c',
              border: `1px solid ${msg.role === 'user' ? 'transparent' : 'var(--border-color)'}`,
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '80%'
            }}>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {msg.role === 'user' ? 'YOU' : 'CO-FOUNDER'}
              </div>
              <div className="markdown-body" style={{ fontSize: '0.95rem' }}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--text-muted)' }}>
              Co-founder is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask for advice..." 
              style={{ margin: 0, flex: 1 }}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={18} /> SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
