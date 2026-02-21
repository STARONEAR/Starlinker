'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, TextField, Typography, Avatar } from '@mui/material';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    'Book internet service',
    'Install CCTV',
    'Browse products',
    'Track my order',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setShowWelcome(false);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s',
            zIndex: 1000,
          }}
        >
          <MessageCircle size={28} />
        </IconButton>
      )}

      {/* Chat Window */}
      {open && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'rgba(11,15,20,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>AI</Avatar>
              <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {showWelcome && (
              <Box>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Hi! I'm your AI assistant. How can I help you today?
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {quickActions.map((action) => (
                      <Box
                        key={action}
                        onClick={() => sendMessage(action)}
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.3)',
                          borderRadius: 2,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          '&:hover': {
                            bgcolor: 'rgba(59,130,246,0.2)',
                          },
                        }}
                      >
                        {action}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: msg.role === 'user' ? 'primary.main' : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Paper sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)' }}>
                  <Typography variant="body2" color="text.secondary">Typing...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={loading}
              />
              <IconButton 
                color="primary" 
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <Send size={20} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
}
