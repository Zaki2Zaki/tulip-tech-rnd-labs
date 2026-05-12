import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface EntryScreenProps {
  onNext: () => void;
  onBranchB?: () => void;
}

// Shared gradient pill text style
const GRADIENT_PILL_TEXT: React.CSSProperties = {
  background: "linear-gradient(90deg, #a78bfa, #c084fc, #e879a0)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const CARD_EYEBROW: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#a78bfa",
  fontFamily: "inherit",
  marginBottom: "6px",
};

const CARD_TITLE: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#fff",
  lineHeight: 1.35,
  fontFamily: "inherit",
  marginBottom: "8px",
};

const CARD_BODY: React.CSSProperties = {
  fontSize: "26px",
  color: "#fff",
  lineHeight: 1.65,
  fontFamily: "inherit",
  marginBottom: "12px",
};

export default function EntryScreen({ onNext, onBranchB }: EntryScreenProps) {
  const [selected, setSelected] = useState<"a" | "c">("c");

  const handleCTA = () => {
    if (selected === "c") {
      onNext();
    } else if (selected === "a") {
      window.location.href = "/#interactive-demo";
    }
  };

  const ctaLabel = selected === "c" ? "Start Briefing" : "Start Building";

  const radioStyle = (isActive: boolean): React.CSSProperties => ({
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    border: "0.5px solid rgba(255,255,255,0.3)",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  });

  const cardStyle = (isActive: boolean): React.CSSProperties => ({
    border: isActive
      ? "0.5px solid rgba(167,139,250,0.55)"
      : "0.5px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "1.25rem 1.375rem",
    background: isActive ? "rgba(167,139,250,0.03)" : "rgba(255,255,255,0.02)",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  });

  return (
    <div style={{ maxWidth: "640px", color: "white", fontSize: "14px", fontFamily: "inherit" }}>
      {/* Eyebrow */}
      <p style={{
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "#a78bfa",
        marginBottom: "12px",
        fontFamily: "inherit",
      }}>
        Strategic Briefing
      </p>

      {/* Headline */}
      <h2 style={{
        fontSize: "26px",
        fontWeight: 700,
        color: "#fff",
        marginBottom: "10px",
        fontFamily: "inherit",
        lineHeight: 1.2,
      }}>
        Where do you want to start?
      </h2>

      {/* Subheading */}
      <p style={{
        fontSize: "14px",
        color: "#fff",
        lineHeight: 1.6,
        marginBottom: "28px",
        fontFamily: "inherit",
      }}>
        Three paths. Each one built for a different role and a different question.
      </p>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>

        {/* ── Card A — Pipeline Lab Workflow Simulation ── */}
        <button onClick={() => setSelected("a")} style={cardStyle(selected === "a")}>
          <span style={radioStyle(selected === "a")}>
            {selected === "a" && <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#a78bfa", display: "block" }} />}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={CARD_EYEBROW}>Pipeline Lab — Workflow Simulation</p>
            <p style={CARD_TITLE}>Your pipeline has friction. Here is how to remove it.</p>
            <p style={CARD_BODY}>
              Select the friction points slowing your pipeline — version control conflicts, tool integration failures, manual review bottlenecks, and more. We map the AI tools and integration sequence that eliminates them across your production stages.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {/* Live tag */}
              <span style={{
                fontSize: "14px",
                fontWeight: 500,
                padding: "5px 14px",
                borderRadius: "99px",
                border: "0.5px solid rgba(29,158,117,0.35)",
                background: "rgba(29,158,117,0.07)",
                color: "#5DCAA5",
                fontFamily: "inherit",
              }}>
                Live
              </span>
              {["Pipeline TD", "Technical Artist", "VFX Supervisor", "Solutions Engineer"].map((role) => (
                <span key={role} style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: "99px",
                  border: "0.5px solid rgba(167,139,250,0.35)",
                  background: "rgba(167,139,250,0.07)",
                  fontFamily: "inherit",
                  display: "inline-block",
                }}>
                  <span style={GRADIENT_PILL_TEXT}>{role}</span>
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* ── Card B — Pipeline Diagnosis ── */}
        <button onClick={() => { setSelected("b"); setShowEmailCapture(false); setNotified(false); }} style={cardStyle(selected === "b")}>
          <span style={radioStyle(selected === "b")}>
            {selected === "b" && <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#a78bfa", display: "block" }} />}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={CARD_EYEBROW}>Pipeline Diagnosis — Bottleneck Finder</p>
            <p style={CARD_TITLE}>Find where your studio is losing time.</p>
            <p style={CARD_BODY}>
              A structured diagnosis of your production pipeline. Seven questions about your schedule, handoffs, and revision cycles — mapped to the specific stages where AI integration delivers the fastest time recovery.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {/* Live tag */}
              <span style={{
                fontSize: "14px",
                fontWeight: 500,
                padding: "5px 14px",
                borderRadius: "99px",
                border: "0.5px solid rgba(29,158,117,0.35)",
                background: "rgba(29,158,117,0.07)",
                color: "#5DCAA5",
                fontFamily: "inherit",
              }}>
                Live
              </span>
              {["Producer", "Art or Creative Director", "Development Director", "Studio Manager"].map((role) => (
                <span key={role} style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: "99px",
                  border: "0.5px solid rgba(167,139,250,0.35)",
                  background: "rgba(167,139,250,0.07)",
                  fontFamily: "inherit",
                  display: "inline-block",
                }}>
                  <span style={GRADIENT_PILL_TEXT}>{role}</span>
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* ── Card C — Strategic Briefing ── */}
        <button onClick={() => { setSelected("c"); setShowEmailCapture(false); }} style={cardStyle(selected === "c")}>
          <span style={radioStyle(selected === "c")}>
            {selected === "c" && <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#a78bfa", display: "block" }} />}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={CARD_EYEBROW}>Strategic Briefing — Executive Summary</p>
            <p style={CARD_TITLE}>See the business case before the conversation.</p>
            {/* Gradient line */}
            <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "8px", fontFamily: "inherit", ...GRADIENT_PILL_TEXT }}>
              Five questions about your studio.
            </p>
            <p style={CARD_BODY}>
              A risk scan and ROI model built from published data across studios your size — your efficiency gap, the annual cost of inaction, and what recovery looks like at your scale.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {["VP", "CTO", "Studio Head", "Chief Strategy Officer", "General Manager"].map((role) => (
                <span key={role} style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: "99px",
                  border: "0.5px solid rgba(167,139,250,0.35)",
                  background: "rgba(167,139,250,0.07)",
                  fontFamily: "inherit",
                  display: "inline-block",
                }}>
                  <span style={GRADIENT_PILL_TEXT}>{role}</span>
                </span>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* CTA button */}
      <button
        onClick={handleCTA}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "16px",
          padding: "1rem 2.75rem",
          borderRadius: "99px",
          border: "0.5px solid rgba(255,255,255,0.25)",
          background: "transparent",
          color: "#fff",
          fontSize: "26px",
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "opacity 0.15s",
        }}
      >
        {ctaLabel} <ArrowRight style={{ width: "26px", height: "26px" }} />
      </button>

      {/* Inline email capture (Card B) */}
      {selected === "b" && showEmailCapture && (
        <div style={{ marginTop: "16px", maxWidth: "360px" }}>
          {notified ? (
            <p style={{ fontSize: "13px", color: "#fff", fontFamily: "inherit" }}>
              Got it. We will be in touch.
            </p>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="email"
                placeholder="Your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitEmail()}
                autoFocus
                style={{
                  flex: 1,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmitEmail}
                disabled={!email.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "99px",
                  border: "0.5px solid rgba(255,255,255,0.25)",
                  background: "transparent",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  cursor: email.trim() ? "pointer" : "not-allowed",
                  opacity: email.trim() ? 1 : 0.4,
                }}
              >
                Notify me <ArrowRight style={{ width: "12px", height: "12px" }} />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
