import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Lightbulb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { cn } from '@/utils/cn';
import { aiResponses, aiSuggestions } from '@/utils/mockData';
import type { ChatMessage } from '@/types';

function getResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('brute')) return aiResponses.brute;
  if (p.includes('secure') || p.includes('harden')) return aiResponses.secure;
  if (p.includes('incident') || p.includes('2041')) return aiResponses.incident;
  if (p.includes('mitre')) return aiResponses.mitre;
  return aiResponses.default;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello Alex. I'm your AI security assistant. I've been monitoring the environment — today's threat score is 72/100 (elevated). How can I help you?",
      time: '09:00',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: getResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTyping(false);
      setMessages((m) => [...m, aiMsg]);
    }, 1600);
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent-emerald ring-2 ring-bg-base" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Security Assistant</h2>
          <p className="text-xs text-slate-500">Powered by Sentinel AI · GPT-Sec v4</p>
        </div>
      </div>

      {/* Chat */}
      <GlassCard hover={false} className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                    m.role === 'assistant'
                      ? 'bg-gradient-to-br from-accent-purple to-accent-blue'
                      : 'bg-white/[0.06]'
                  )}
                >
                  {m.role === 'assistant' ? (
                    <Bot className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    m.role === 'assistant'
                      ? 'bg-white/[0.03] text-slate-200'
                      : 'bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 text-white ring-1 ring-accent-cyan/20'
                  )}
                >
                  <p>{m.content}</p>
                  <p className={cn('mt-1.5 text-[10px]', m.role === 'assistant' ? 'text-slate-500' : 'text-accent-cyan/70')}>
                    {m.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.03] px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-accent-cyan"
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="border-t border-white/[0.05] px-5 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              <Lightbulb className="h-3.5 w-3.5" /> Suggested prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-accent-cyan/30 hover:bg-accent-cyan/5 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/[0.05] p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 focus-within:border-accent-cyan/40"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about threats, vulnerabilities, or remediation…"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan text-white shadow-glow disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
          <p className="mt-1.5 px-2 text-center text-[10px] text-slate-600">
            Sentinel AI can make mistakes. Verify critical security actions.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
