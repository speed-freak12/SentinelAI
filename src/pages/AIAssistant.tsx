import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/components/Toast";
import { cn } from "@/utils/cn";

import type { ChatMessage } from "@/types";

interface AssistantResponse {
  success: boolean;
  message: string;
}

const API_URL =
  import.meta.env.VITE_API_URL;

const suggestions = [
  "Analyze the latest threats",
  "How can I harden the environment?",
  "Explain the current security incidents",
  "Show me MITRE ATT&CK recommendations",
];

export function AIAssistant() {
  const toast = useToast();

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello. I'm your Sentinel AI security assistant. Ask me about threats, incidents, vulnerabilities, or remediation.",
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
    ]);

  const [input, setInput] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top:
        scrollRef.current
          .scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const send = async (
    text: string
  ) => {
    const prompt =
      text.trim();

    if (!prompt || typing) {
      return;
    }

    if (!API_URL) {
      toast(
        "VITE_API_URL is not configured.",
        "error"
      );
      return;
    }

    const userMessage: ChatMessage =
    {
      id: String(Date.now()),
      role: "user",
      content: prompt,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setTyping(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/assistant`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message: prompt,
            }),
          }
        );

      let data:
        | AssistantResponse
        | null = null;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from AI server."
        );
      }

      if (
        !response.ok ||
        !data?.success ||
        !data.message
      ) {
        throw new Error(
          data?.message ||
          "AI assistant request failed."
        );
      }

      const assistantMessage:
        ChatMessage = {
        id: String(
          Date.now() + 1
        ),
        role: "assistant",
        content: data.message,
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Assistant Error:",
        error
      );

      toast(
        error instanceof Error
          ? error.message
          : "Unable to contact the AI assistant.",
        "error"
      );
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
          <Sparkles className="h-6 w-6 text-white" />

          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent-emerald ring-2 ring-bg-base" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            AI Security Assistant
          </h2>

          <p className="text-xs text-slate-500">
            Powered by Sentinel AI
          </p>
        </div>
      </div>

      <GlassCard
        hover={false}
        className="flex flex-1 flex-col overflow-hidden p-0"
      >
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-5"
        >
          <AnimatePresence>
            {messages.map(
              (message) => (
                <motion.div
                  key={message.id}
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={cn(
                    "flex gap-3",
                    message.role ===
                    "user" &&
                    "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      message.role ===
                        "assistant"
                        ? "bg-gradient-to-br from-accent-purple to-accent-blue"
                        : "bg-white/[0.06]"
                    )}
                  >
                    {message.role ===
                      "assistant" ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-slate-300" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      message.role ===
                        "assistant"
                        ? "bg-white/[0.03] text-slate-200"
                        : "bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 text-white ring-1 ring-accent-cyan/20"
                    )}
                  >
                    <p className="whitespace-pre-wrap">
                      {
                        message.content
                      }
                    </p>

                    <p
                      className={cn(
                        "mt-1.5 text-[10px]",
                        message.role ===
                          "assistant"
                          ? "text-slate-500"
                          : "text-accent-cyan/70"
                      )}
                    >
                      {
                        message.time
                      }
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="flex gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.03] px-4 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
              </div>
            </motion.div>
          )}
        </div>

        {messages.length <= 2 && (
          <div className="border-t border-white/[0.05] px-5 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              <Lightbulb className="h-3.5 w-3.5" />
              Suggested prompts
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() =>
                      send(
                        suggestion
                      )
                    }
                    disabled={typing}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-accent-cyan/30 hover:bg-accent-cyan/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.05] p-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 focus-within:border-accent-cyan/40"
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              disabled={typing}
              placeholder="Ask about threats, vulnerabilities, or remediation…"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              type="submit"
              disabled={
                !input.trim() ||
                typing
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan text-white shadow-glow disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>

          <p className="mt-1.5 px-2 text-center text-[10px] text-slate-600">
            Sentinel AI can make mistakes.
            Verify critical security actions.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}