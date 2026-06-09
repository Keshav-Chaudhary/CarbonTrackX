"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  MessageSquareOff,
  RotateCcw,
  Route,
  Salad,
  Target,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { Markdown } from "./Markdown";
import { useAssistantChat } from "./useAssistantChat";
import { Button, Dialog } from "@/components/ui";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  { icon: TrendingDown, text: "Analyze my primary emission drivers." },
  { icon: Route, text: "Suggest high-impact footprint reductions." },
  { icon: Target, text: "Evaluate my long-term sustainability trajectory." },
  { icon: Salad, text: "Calculate the impact of a dietary shift." },
];

/**
 * Conversational assistant. Refined dark chat surface — no gradient text, no
 * glow. Replies stream token-by-token and render through a safe inline
 * markdown renderer. Fully keyboard operable; the transcript is an aria-live
 * log and each turn is labelled for screen readers.
 */
export function AssistantChat() {
  const getActivities = useCarbonStore.getState;
  const { messages, status, enabled, error, send, reset } = useAssistantChat(
    () => getActivities().activities,
  );
  const [showClearWarning, setShowClearWarning] = useState(false);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streaming = status === "streaming";

  // Keep newest content in view as it streams.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function submit(text: string) {
    if (!text.trim() || streaming) return;
    setInput("");
    await send(text);
    inputRef.current?.focus();
  }

  if (enabled === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 custom-fade-in">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[60px] rounded-full scale-150 animate-pulse-hover pointer-events-none" />
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[var(--r-xl)] border border-[var(--border-strong)] bg-surface-2 shadow-xl">
            <MessageSquareOff className="size-10 text-[var(--accent)]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-fg mb-4">
          AI Assistant offline
        </h1>
        <p className="max-w-md text-lg text-fg-subtle mb-10 leading-relaxed">
          The AI capabilities haven't been configured for this deployment yet. Don't worry though—your dashboard and insights will continue to work perfectly using local data.
        </p>
        
        <div className="inline-flex h-14 items-center justify-center gap-3 rounded-[var(--r-xl)] bg-surface-3 border border-[var(--border-strong)] px-8 text-base font-bold text-fg-muted shadow-sm opacity-60 cursor-not-allowed">
          <MessageSquareOff className="size-5" />
          Currently Unavailable
        </div>
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  const renderComposer = (isHero: boolean) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(input);
      }}
      className={cn(
        "flex items-end gap-2 transition-all",
        isHero
          ? "relative w-full items-center bg-surface border border-[var(--border-strong)] rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-[var(--accent-subtle)] p-2"
          : "rounded-[var(--r-lg)] border border-[var(--border-strong)] bg-surface-2 p-2 shadow-sm focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-subtle)]"
      )}
    >
      <label htmlFor={isHero ? "hero-input" : "assistant-input"} className="sr-only">
        Message the assistant
      </label>
      <textarea
        id={isHero ? "hero-input" : "assistant-input"}
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit(input);
          }
        }}
        rows={1}
        placeholder="Message CarbonTrackX..."
        disabled={enabled === null}
        className={cn(
          "scroll-thin flex-1 resize-none bg-transparent text-fg placeholder:text-fg-subtle focus:!outline-none focus-visible:!outline-none focus-visible:ring-0",
          isHero ? "min-h-[56px] py-4 px-4 text-base" : "max-h-40 px-2 py-1.5 text-sm"
        )}
      />
      {!isHero && hasMessages && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={reset}
          aria-label="Start a new conversation"
          className="hidden" // Hiding here since it's moved to the header
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </Button>
      )}
      <Button
        type="submit"
        size={isHero ? "default" : "sm"}
        disabled={streaming || enabled === null || input.trim() === ""}
        aria-label="Send message"
        className={cn(
          "transition-colors",
          isHero ? "absolute right-3 bottom-3 size-10 rounded-xl bg-[var(--accent)] text-[#ffffff] hover:bg-[var(--accent-strong)] p-0" : "size-9 p-0"
        )}
      >
        <ArrowUp aria-hidden="true" className={isHero ? "size-5" : "size-4"} />
      </Button>
    </form>
  );

  return (
    <div className="flex h-full flex-col bg-surface-1 custom-fade-in">
      {/* Interactive Control Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-surface px-4 py-3 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-muted)] shadow-sm">
            <Sparkles className="size-4.5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-fg">
              Intelligence Center
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex size-2">
                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", enabled ? "bg-[var(--success)]" : "bg-[var(--critical)]")}></span>
                <span className={cn("relative inline-flex size-2 rounded-full", enabled ? "bg-[var(--success)]" : "bg-[var(--critical)]")}></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                {enabled ? "System Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {hasMessages && (
             <Button variant="ghost" size="sm" onClick={() => setShowClearWarning(true)} className="h-8 gap-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-[var(--accent-subtle)]">
               <RotateCcw className="size-3.5" />
               <span className="hidden sm:inline">Clear Context</span>
             </Button>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the assistant"
        className="scroll-thin flex-1 overflow-y-auto"
      >
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent-subtle)] blur-[100px] rounded-full scale-[1.5] animate-pulse pointer-events-none opacity-20" />
            
            <div className="w-full max-w-2xl flex flex-col items-center stagger">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-fg text-center">
                CarbonTrackX Intelligence
              </h2>
              <p className="mx-auto mt-4 mb-10 max-w-lg text-base text-center text-fg-muted">
                Ask me anything about your footprint. I can analyze your telemetry, project your emissions, and suggest personalized reductions.
              </p>

              <div className="w-full">
                {renderComposer(true)}
                <p className="mt-4 text-xs text-center text-fg-subtle">
                  CarbonTrackX Intelligence can make mistakes. Verify important calculations.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(({ icon: Icon, text }) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => submit(text)}
                    disabled={enabled === null || streaming}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-surface border border-[var(--border)] rounded-full text-fg-muted hover:text-fg hover:border-[var(--accent-strong)] hover:bg-[var(--accent-subtle)] transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <Icon aria-hidden="true" className="size-3.5 text-[var(--accent)]" />
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "rounded-[var(--r-xl)] rounded-br-sm border border-[var(--border-strong)] bg-surface-2 text-fg"
                      : "rounded-[var(--r-xl)] rounded-bl-sm border border-[var(--border)] bg-surface text-fg",
                  )}
                >
                  <span className="sr-only">
                    {m.role === "user" ? "You said: " : "Assistant said: "}
                  </span>
                  {m.role === "assistant" ? (
                    m.content ? (
                      <Markdown content={m.content.replace(/\[LOG_ACTIVITY:[\s\S]*?(?:\]|$)/g, "").trim()} />
                    ) : (
                      <span className="inline-flex gap-1" aria-label="Thinking">
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                        <span className="thinking-dot" />
                      </span>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="px-4 pb-2 text-center text-sm text-[var(--critical)]">
          {error}
        </p>
      )}

      {/* Conditional Bottom Composer */}
      {hasMessages && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="mx-auto max-w-3xl animate-in slide-in-from-bottom-2 fade-in duration-300">
            {renderComposer(false)}
            <p className="mt-2 text-center text-xs text-fg-subtle">
              CarbonTrackX Intelligence can make mistakes. Verify important calculations.
            </p>
          </div>
        </div>
      )}

      {/* Clear Warning Dialog */}
      <Dialog 
        open={showClearWarning} 
        onClose={() => setShowClearWarning(false)}
        title="Clear Intelligence Context?"
        description="This will instantly wipe your active conversation from the AI's memory. This action cannot be undone."
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowClearWarning(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              reset();
              setShowClearWarning(false);
            }}
            className="bg-[var(--critical)] text-[#ffffff] hover:opacity-90 border-transparent shadow-sm"
          >
            Clear Context
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
