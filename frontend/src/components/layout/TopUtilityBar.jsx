import { useState, useEffect } from "react";
import logoSrc from "../../assets/logo.png";
import { getApiBase } from "../../services/api";

export default function TopUtilityBar({ activeLang, onToggleLang }) {
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking | online | offline
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(() => getApiBase());
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function checkBackend() {
      try {
        const res = await fetch(`${getApiBase()}/languages`, { method: "GET" });
        if (mounted) {
          setBackendStatus(res.ok ? "online" : "offline");
        }
      } catch {
        if (mounted) setBackendStatus("offline");
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeLevel === -1) {
      root.style.fontSize = "14px";
    } else if (fontSizeLevel === 1) {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
  }, [fontSizeLevel]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast-mode");
    } else {
      document.body.classList.remove("high-contrast-mode");
    }
  }, [highContrast]);

  return (
    <div className="top-gov-utility-bar" role="region" aria-label="Portal Utility Bar">
      <div className="utility-bar-inner">
        <div className="utility-left">
          <div
            className="utility-logo-badge"
            style={{
              position: "relative",
              width: "24px",
              height: "24px",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#421d00",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logoSrc}
              alt="Boli Emblem"
              className="utility-logo-img"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-54.86%, -47.5%)",
                width: "140%",
                height: "auto",
                display: "block",
                pointerEvents: "none",
              }}
            />
          </div>
          <div className="utility-title-stack">
            <span className="utility-gov-title">
              <strong>Boli बोली</strong>
              <span className="utility-title-sep">·</span>
              <span className="utility-title-desc">Multilingual Primary Learning</span>
            </span>
            <span className="utility-badge-sih">SIH Prototype · SIH26042</span>
          </div>
        </div>

        <div className="utility-right">
          {/* Accessibility Font Size Scaling */}
          <div className="accessibility-scaler" aria-label="Text Size Controls">
            <span className="scaler-label">Font:</span>
            <button
              type="button"
              className={`scale-btn ${fontSizeLevel === -1 ? "active" : ""}`}
              onClick={() => setFontSizeLevel(-1)}
              title="Decrease text size"
              aria-label="Decrease text size (A-)"
            >
              A-
            </button>
            <button
              type="button"
              className={`scale-btn ${fontSizeLevel === 0 ? "active" : ""}`}
              onClick={() => setFontSizeLevel(0)}
              title="Reset default text size"
              aria-label="Default text size (A)"
            >
              A
            </button>
            <button
              type="button"
              className={`scale-btn ${fontSizeLevel === 1 ? "active" : ""}`}
              onClick={() => setFontSizeLevel(1)}
              title="Increase text size"
              aria-label="Increase text size (A+)"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            type="button"
            className={`utility-contrast-btn ${highContrast ? "is-active" : ""}`}
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High Contrast Mode"
            aria-pressed={highContrast}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              contrast
            </span>
            <span>{highContrast ? "Normal" : "High Contrast"}</span>
          </button>


          {/* Backend Connection Status Badge & Modal Trigger */}
          <button
            type="button"
            className="scale-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => {
              setCustomUrl(getApiBase());
              setTestResult(null);
              setShowBackendModal(true);
            }}
            title="Configure Backend API Connection"
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  backendStatus === "online"
                    ? "#22c55e"
                    : backendStatus === "checking"
                    ? "#eab308"
                    : "#ef4444",
                boxShadow:
                  backendStatus === "online"
                    ? "0 0 6px #22c55e"
                    : "none",
                display: "inline-block",
              }}
            />
            <span>
              {backendStatus === "online"
                ? "Backend: Online"
                : backendStatus === "checking"
                ? "Connecting..."
                : "Backend: Offline"}
            </span>
          </button>

          <a href="#help-faq" className="utility-help-link">
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Help</span>
          </a>
        </div>
      </div>

      {showBackendModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
          onClick={() => setShowBackendModal(false)}
        >
          <div
            style={{
              background: "#1e1e1e",
              color: "#f3f4f6",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#fff" }}>
              Backend Connection Settings
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#9ca3af", lineHeight: 1.5 }}>
              Configure your backend API base URL. If the frontend is running on Vercel (HTTPS), use an HTTPS tunnel URL (e.g. from localtunnel or localhost.run) to reach your local backend.
            </p>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "6px", color: "#d1d5db" }}>
                API Base URL:
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://... or http://127.0.0.1:8001"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #4b5563",
                  background: "#111827",
                  color: "#fff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {testResult && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginBottom: "14px",
                  fontSize: "13px",
                  background: testResult.success ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: testResult.success ? "#4ade80" : "#f87171",
                  border: `1px solid ${testResult.success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                {testResult.message}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                type="button"
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "1px solid #4b5563",
                  background: "transparent",
                  color: "#d1d5db",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
                onClick={async () => {
                  setTestResult({ success: null, message: "Testing connection..." });
                  try {
                    const res = await fetch(`${customUrl.trim().replace(/\/+$/, "")}/languages`);
                    if (res.ok) {
                      setTestResult({ success: true, message: "✓ Connected successfully!" });
                      setBackendStatus("online");
                    } else {
                      setTestResult({ success: false, message: `Server responded with ${res.status}` });
                    }
                  } catch (err) {
                    setTestResult({ success: false, message: `Connection failed: ${err.message}` });
                  }
                }}
              >
                Test Connection
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
                onClick={() => {
                  const cleaned = customUrl.trim().replace(/\/+$/, "");
                  if (cleaned) {
                    localStorage.setItem("BOLI_API_BASE", cleaned);
                  } else {
                    localStorage.removeItem("BOLI_API_BASE");
                  }
                  window.location.reload();
                }}
              >
                Save & Reload
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "1px solid #4b5563",
                  background: "#374151",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
                onClick={() => setShowBackendModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
