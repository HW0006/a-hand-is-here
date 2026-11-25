import type { Tier } from "../types";
import { fplForHousehold, money } from "../data/fpl";

interface FormPanelProps {
  name: string;
  household: number | null;
  income: number | null;
  insurance: string;
  pulseField: string;
  pct: number | null;
  tier: Tier | null;
  progress: number;
}

function FormField({ label, value, pulse }: { label: string; value: string; pulse: boolean }) {
  return (
    <div className="form-group">
      <div className="form-label">{label}</div>
      <div className={"form-value" + (value ? "" : " empty") + (pulse ? " pop" : "")}>
        {value || "Waiting for answer…"}
      </div>
    </div>
  );
}

const SAMPLE_BILL = 3200;

export default function FormPanel({
  name,
  household,
  income,
  insurance,
  pulseField,
  pct,
  tier,
  progress,
}: FormPanelProps) {
  const owed = tier ? Math.round(SAMPLE_BILL * (1 - tier.discount / 100)) : null;

  return (
    <div className="panel">
      <div className="form-head">
        <h2>Financial Assistance Application</h2>
        <div className="sub">Auto-filled live from the conversation</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: progress + "%" }}></div>
        </div>
      </div>

      <div className="form-body">
        <FormField label="Applicant" value={name} pulse={pulseField === "name"} />

        <div className="form-grid-2">
          <FormField
            label="Household size"
            value={household ? (household === 8 ? "8 or more" : String(household)) : ""}
            pulse={pulseField === "household"}
          />
          <FormField label="Annual income" value={income ? money(income) : ""} pulse={pulseField === "income"} />
        </div>

        <FormField label="Insurance status" value={insurance} pulse={pulseField === "insurance"} />

        <div className="divider"></div>

        {pct !== null && tier !== null ? (
          <>
            <div className="form-grid-2">
              <FormField label="% of Federal Poverty Level" value={pct + "%"} pulse={pulseField === "determination"} />
              <FormField
                label="Poverty guideline used"
                value={
                  money(fplForHousehold(household || 1)) +
                  " (household of " +
                  (household === 8 ? "8+" : household) +
                  ")"
                }
                pulse={false}
              />
            </div>

            <div className={"determination " + tier.key}>
              <div className="d-label">Eligibility determination</div>
              <div className="d-title">{tier.label}</div>
              <div className="d-detail">{tier.detail}</div>
              <div className="estimate-row">
                <span>On a sample {money(SAMPLE_BILL)} bill, patient owes</span>
                <b>{money(owed || 0)}</b>
              </div>
            </div>
          </>
        ) : (
          <div className="fpl-footnote">
            Eligibility is calculated against the 2024 HHS Federal Poverty Guidelines for the 48 contiguous
            states and D.C. (Alaska and Hawaii use higher thresholds), compared against this hospital's
            sample charity-care sliding-fee schedule.
          </div>
        )}
      </div>
    </div>
  );
}
