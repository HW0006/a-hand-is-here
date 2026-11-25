import { useEffect, useRef, useState, type ReactNode } from "react";
import ChatPanel from "./components/ChatPanel";
import FormPanel from "./components/FormPanel";
import StatsFooter from "./components/StatsFooter";
import CapybaraAvatar from "./components/CapybaraAvatar";
import { pctOfFPL, tierFor } from "./data/fpl";
import { money } from "./data/fpl";
import type { ChatMsg, Step } from "./types";

const uid = () => Math.random().toString(36).slice(2, 9);

const GREETING = (
  <>
    <p>
      Hi, I'm here to help you check whether you qualify for free or reduced-cost care at Mercy General
      Hospital — no paperwork jargon, just a few quick questions.
    </p>
    <p>First, what's your first name?</p>
  </>
);

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [name, setName] = useState("");
  const [household, setHousehold] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);
  const [insurance, setInsurance] = useState<string>("");
  const [incomeDraft, setIncomeDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pulseField, setPulseField] = useState<string>("");

  const mounted = useRef(false);

  const say = (node: ReactNode, delay = 650) =>
    new Promise<void>((resolve) => {
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: uid(), sender: "bot", node }]);
        resolve();
      }, delay);
    });

  const sayUser = (node: ReactNode) => {
    setMessages((m) => [...m, { id: uid(), sender: "user", node }]);
  };

  const pulse = (field: string) => {
    setPulseField(field);
    window.setTimeout(() => setPulseField(""), 900);
  };

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    (async () => {
      await say(GREETING, 500);
      setStep("name");
    })();
  }, []);

  const submitName = async (value: string) => {
    if (!value.trim()) return;
    sayUser(value);
    setName(value.trim());
    pulse("name");
    setStep("household");
    await say(<p>Good to meet you, {value.trim()}. How many people — including yourself — live in your household?</p>);
  };

  const submitHousehold = async (size: number) => {
    sayUser(size === 8 ? "8 or more" : String(size));
    setHousehold(size);
    pulse("household");
    setStep("income");
    await say(<p>Thanks. Now, what's your total annual household income before taxes? A close estimate is fine.</p>);
  };

  const submitIncome = async (raw: string) => {
    const cleaned = Number(raw.replace(/[^0-9.]/g, ""));
    if (!cleaned || cleaned <= 0) return;
    sayUser(money(cleaned));
    setIncome(cleaned);
    pulse("income");
    setIncomeDraft("");
    setStep("insurance");
    await say(<p>Got it. Last question — what's your current insurance situation?</p>);
  };

  const submitInsurance = async (value: string) => {
    sayUser(value);
    setInsurance(value);
    pulse("insurance");
    setStep("computing");
    await say(<p>Let me check that against this hospital's financial assistance policy…</p>, 500);

    const size = household ?? 1;
    const inc = income ?? 0;
    const pct = pctOfFPL(inc, size);
    const tier = tierFor(pct);
    pulse("determination");
    setStep("result");

    await say(
      <>
        <p>
          Based on a household of {size} and {money(inc)} in annual income, you're at{" "}
          <b>{pct}% of the Federal Poverty Level</b>.
        </p>
        <p>
          <b>{tier.label}.</b> {tier.detail}
        </p>
        <p>I've filled in your application on the right. You can review it and submit it to the billing office from here.</p>
      </>,
      750
    );
  };

  const handleSubmitApplication = () => setSubmitted(true);

  const restart = () => {
    setStep("intro");
    setMessages([]);
    setName("");
    setHousehold(null);
    setIncome(null);
    setInsurance("");
    setIncomeDraft("");
    setSubmitted(false);
    setPulseField("");
    window.setTimeout(() => {
      (async () => {
        await say(GREETING, 400);
        setStep("name");
      })();
    }, 50);
  };

  const pct = household && income ? pctOfFPL(income, household) : null;
  const tier = pct !== null ? tierFor(pct) : null;

  const fieldsFilled = [name, household, income, insurance].filter(Boolean).length;
  const progress = step === "result" ? 100 : Math.min(95, (fieldsFilled / 4) * 90);

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <CapybaraAvatar size={26} />
          </div>
          <div>
            <h1>Charity Care Navigator</h1>
            <p>Mercy General Hospital · Financial Assistance Program</p>
          </div>
        </div>
        <span className="badge">AI concept demo</span>
      </div>

      <div className="grid">
        <ChatPanel
          messages={messages}
          typing={typing}
          step={step}
          incomeDraft={incomeDraft}
          setIncomeDraft={setIncomeDraft}
          submitted={submitted}
          onSubmitName={submitName}
          onSubmitHousehold={submitHousehold}
          onSubmitIncome={submitIncome}
          onSubmitInsurance={submitInsurance}
          onSubmitApplication={handleSubmitApplication}
          onRestart={restart}
        />
        <FormPanel
          name={name}
          household={household}
          income={income}
          insurance={insurance}
          pulseField={pulseField}
          pct={pct}
          tier={tier}
          progress={progress}
        />
      </div>

      <StatsFooter />

      <div className="disclaimer">
        Concept demo with a fictional hospital and a sample charity-care policy — built to illustrate how an
        LLM-powered assistant could screen patients and pre-fill financial assistance paperwork. Not real
        guidance; actual eligibility rules and required documentation vary by hospital.
      </div>
    </div>
  );
}
