import { RefObject } from "react";
import { ChatComposer } from "./ChatComposer";
import { SuggestionChips } from "./SuggestionChips";
import { ChatMessageList } from "./ChatMessageList";
import type { ChatMessage } from "@/lib/ai/prompt";

interface ChatBodyProps {
  hasMessages: boolean;
  messages: ChatMessage[];
  enabled: boolean | null;
  streaming: boolean;
  input: string;
  setInput: (s: string) => void;
  submit: (text: string) => Promise<void>;
  reset: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export function ChatBody({
  hasMessages,
  messages,
  enabled,
  streaming,
  input,
  setInput,
  submit,
  reset,
  inputRef,
}: ChatBodyProps) {
  if (!hasMessages) {
    return (
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
            <ChatComposer
              isHero={true}
              inputRef={inputRef}
              input={input}
              setInput={setInput}
              submit={submit}
              enabled={enabled}
              streaming={streaming}
              hasMessages={hasMessages}
              reset={reset}
            />
            <p className="mt-4 text-xs text-center text-fg-subtle">
              CarbonTrackX Intelligence can make mistakes. Verify important calculations.
            </p>
          </div>

          <SuggestionChips
            submit={submit}
            enabled={enabled}
            streaming={streaming}
          />
        </div>
      </div>
    );
  }

  return <ChatMessageList messages={messages} />;
}
