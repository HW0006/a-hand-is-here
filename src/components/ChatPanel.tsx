import { FormEvent, useRef, useEffect } from "react";
import type { ChatMsg, Step } from "../types";
import CapybaraAvatar from "./CapybaraAvatar";

interface ChatPanelProps {
  messages: ChatMsg[];
  typing: boolean;
  step: Step;
  incomeDraft: string;
  setIncomeDraft: (value: string) => void;
  submitted: boolean;
  onSubmitName: (value: string) => void;
  onSubmitHousehold: (size: number) => void;
  onSubmitIncome: (raw: string) => void;
  onSubmitInsurance: (value: string) => void;
  onSubmitApplication: () => void;
  onRestart: () => void;
}

function TypingBubble() {
  return (
    <div className="row bot">
      <div className="avatar">
        <CapybaraAvatar />
      </div>
      <div className="bubble">
        <div className="typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: ChatMsg }) {
  return (
    <div className={"row " + m.sender}>
      <div className="avatar">{m.sender === "bot" ? <CapybaraAvatar /> : "You"}</div>
      <div className="bubble">{m.node}</div>
    </div>
  );
}

export default function ChatPanel({
  messages,
  typing,
  step,
  incomeDraft,
  setIncomeDraft,
  submitted,
  onSubmitName,
  onSubmitHousehold,
  onSubmitIncome,
  onSubmitInsurance,
  onSubmitApplication,
  onRestart,
}: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    });
  }, [messages, typing]);

  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("nameInput") as HTMLInputElement;
    onSubmitName(input.value);
    input.value = "";
  };

  const handleIncomeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitIncome(incomeDraft);
  };

  return (
    <div className="panel">
      <div className="chat-head">
        <div>
          <h2>Financial assistance assistant</h2>
          <div className="sub">Plain-language screening, no account needed</div>
        </div>
        <button className="restart" onClick={onRestart}>
          Restart demo
        </button>
      </div>

      <div className="thread" ref={threadRef} aria-live="polite">
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {typing && <TypingBubble />}
      </div>

      <div className="composer">
        {step === "name" && !typing && (
          <form className="text-row" onSubmit={handleNameSubmit}>
            <input id="name-input" name="nameInput" autoFocus placeholder="Type your first name" />
            <button className="send" type="submit">
              Send
            </button>
          </form>
        )}

        {step === "household" && !typing && (
          <div className="choice-row">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} className="choice" onClick={() => onSubmitHousehold(n)}>
                {n === 8 ? "8+" : n}
              </button>
            ))}
          </div>
        )}

        {step === "income" && !typing && (
          <>
            <form className="text-row" onSubmit={handleIncomeSubmit}>
              <input
                id="income-input"
                inputMode="numeric"
                autoFocus
                placeholder="e.g. 32000"
                value={incomeDraft}
                onChange={(e) => setIncomeDraft(e.target.value)}
              />
              <button className="send" type="submit" disabled={!incomeDraft.trim()}>
                Send
              </button>
            </form>
            <div className="hint">Gross income, before taxes — rough estimates are fine.</div>
          </>
        )}

        {step === "insurance" && !typing && (
          <div className="choice-row">
            {["Uninsured", "Can't afford my deductible", "Medicaid pending", "Insured, in-network"].map(
              (opt) => (
                <button key={opt} className="choice" onClick={() => onSubmitInsurance(opt)}>
                  {opt}
                </button>
              )
            )}
          </div>
        )}

        {step === "computing" && <div className="hint">Checking eligibility…</div>}

        {step === "result" && !typing && (
          <div className="done-row">
            {!submitted ? (
              <button className="primary-cta" onClick={onSubmitApplication}>
                Submit application to billing office
              </button>
            ) : (
              <div className="toast">
                ✓ Sent to Mercy General's financial assistance office. A counselor will follow up within 5
                business days.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
