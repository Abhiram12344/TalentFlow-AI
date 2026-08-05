import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

export default function AICareerChat({ apiBase }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your AI Career Coach Agent. Ask me anything about career roadmaps, interview prep, or technical skill transitions!" }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setSending(true);

    try {
      const res = await fetch(`${apiBase}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages
        })
      });
      const data = await res.json();
      const replyText = data.data?.reply || data.reply || "Focusing on core CS fundamentals alongside TakeUForward DSA practice will accelerate your technical career progress!";
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Keep practicing daily! Consistently completing 1 problem from our TakeUForward-inspired DSA sheet build strong technical muscle memory."
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
          <MessageSquare size={20} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Career Coach Assistant</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conversational career mentoring powered by the Career Coach Agent.</p>
        </div>
      </div>

      {/* Chat Log Window */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-glass)', padding: '1.25rem', height: '380px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.75rem', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.sender === 'ai' && (
              <div style={{ background: 'var(--primary-accent)', padding: '0.4rem', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
            )}
            
            <div style={{ 
              maxWidth: '80%', 
              background: m.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.06)', 
              color: '#ffffff',
              padding: '0.85rem 1.1rem',
              borderRadius: '14px',
              fontSize: '0.9rem',
              lineHeight: 1.4
            }}>
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#fff" />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Loader2 size={16} className="spin" /> Career Coach Agent thinking...
          </div>
        )}
      </div>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your AI Career Coach a question..."
        />
        <button className="btn-primary" onClick={handleSendMessage} disabled={sending} style={{ whiteSpace: 'nowrap' }}>
          Send <Send size={16} />
        </button>
      </div>
    </div>
  );
}
