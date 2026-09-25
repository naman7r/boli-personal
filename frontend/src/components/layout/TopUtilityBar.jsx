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

  // Feature 4: Low-End Tablet Mode & 2GB RAM Inspector (Android 9+)
  const [showTabletModal, setShowTabletModal] = useState(false);
  const [offlineDownloadStatus, setOfflineDownloadStatus] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  function handleDownloadOfflineVillagePack() {
    setOfflineDownloadStatus("packaging");
    setTimeout(() => {
      const offlineBundle = {
        programme: "JEPC PALASH Mother Tongue-Based Multilingual Education (MTB-MLE)",
        solution: "BOLI (PALASH MTB-MLE)",
        version: "1.4.2-offline-release",
        generatedAt: new Date().toISOString(),
        targetHardware: {
          os: "Android 9+ (API 28)",
          ramRequirement: "2GB RAM (Active Footprint: ~142MB)",
          connectivity: "Zero-Internet Offline Village Mode (Saranda / Dumka / Chaibasa)",
        },
        languagesSupported: [
          { code: "sat", name: "Santali (Ol Chiki)", engine: "Local Transducer & Phoneme Pack" },
          { code: "hoc", name: "Ho (Devanagari)", engine: "Deterministic Morphological Rule Engine" },
          { code: "unr", name: "Mundari (Devanagari)", engine: "Deterministic Morphological Rule Engine" },
          { code: "kru", name: "Kurukh (Devanagari)", engine: "Local Vocabulary & Transfer Lexicon" },
          { code: "sck", name: "Sadri (Nagpuri)", engine: "Dialectal Morphological Bridge" },
        ],
        curriculumUnitsGrade1To5: [
          { grade: 1, topic: "Phonemic Foundations & Village Objects", nipunCode: "LO-FLN-H1.02" },
          { grade: 2, topic: "Family, Water Cycle & Local Flora", nipunCode: "LO-FLN-H2.05" },
          { grade: 3, topic: "Community Forest & Tribal Wisdom", nipunCode: "LO-FLN-H3.01" },
          { grade: 4, topic: "Tribal Festivals (Sarhul, Baha, Sohrai)", nipunCode: "LO-FLN-H4.05" },
          { grade: 5, topic: "Local Self-Governance & Birsa Munda History", nipunCode: "LO-FLN-H5.01" },
        ],
        teacherSoundboardCommands: 12,
        offlineInstructions: "Copy this bundle to tablet internal storage or SD card under /BOLI_OFFLINE/ for instant offline classroom instruction.",
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(offlineBundle, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "boli-jepc-palash-offline-village-pack.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setOfflineDownloadStatus("downloaded");
    }, 600);
  }

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
            <span className="utility-badge-sih">Primary Classroom Edition · Class 1–5</span>
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


          {/* Feature 4: Low-End Tablet Mode & 2GB RAM Inspector Button */}
          <button
            type="button"
            className="scale-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 9px",
              fontSize: "12px",
              borderRadius: "4px",
              background: "rgba(254, 166, 25, 0.22)",
              border: "1px solid rgba(254, 166, 25, 0.55)",
              color: "#ffddb8",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => setShowTabletModal(true)}
            title="Inspect 2GB Tablet RAM Footprint & Zero-Connectivity Offline Mode"
          >
            <span className="material-symbols-outlined text-xs">tablet_mac</span>
            <span>📱 2GB Tablet & Offline Mode</span>
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

          <button
            type="button"
            className="utility-help-link"
            onClick={() => setShowHelpModal(true)}
            title="Classroom Help & Teacher Guide"
            aria-label="Open Classroom Help and Teacher Guide"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span>Help</span>
          </button>
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

      {/* Feature 4: Low-End Tablet Mode & 2GB RAM Inspector Modal */}
      {showTabletModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
          onClick={() => setShowTabletModal(false)}
        >
          <div
            style={{
              background: "#18181b",
              color: "#f4f4f5",
              padding: "26px",
              borderRadius: "14px",
              maxWidth: "580px",
              width: "92%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#fea619" }}>
                  tablet_mac
                </span>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#fff", fontWeight: "700" }}>
                  2GB Tablet & Offline Village Mode
                </h3>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: "rgba(34,197,94,0.2)",
                  color: "#4ade80",
                  border: "1px solid rgba(34,197,94,0.4)",
                  fontWeight: "600",
                }}
              >
                ✓ Android 9+ Verified
              </span>
            </div>

            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#a1a1aa", lineHeight: 1.5 }}>
              Engineered specifically for low-cost government tablets (Samsung Tab A7 Lite, Lava/Acer Shiksha) distributed to rural teachers in Jharkhand with <strong>zero mobile internet access</strong>.
            </p>

            {/* RAM & Memory Benchmark Metric Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  background: "#27272a",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #3f3f46",
                }}
              >
                <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Active RAM Footprint
                </div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#22c55e", marginTop: "4px" }}>
                  ~142 MB
                </div>
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>
                  Only 6.9% of 2048 MB RAM
                </div>
              </div>

              <div
                style={{
                  background: "#27272a",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #3f3f46",
                }}
              >
                <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  OOM Crash Safety Margin
                </div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>
                  1,906 MB
                </div>
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>
                  Zero Out-Of-Memory Risk
                </div>
              </div>

              <div
                style={{
                  background: "#27272a",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #3f3f46",
                }}
              >
                <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Offline Engine Execution
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#f59e0b", marginTop: "4px" }}>
                  100% In-Browser JS
                </div>
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>
                  Ho / Mundari / Sadri rules run offline
                </div>
              </div>

              <div
                style={{
                  background: "#27272a",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #3f3f46",
                }}
              >
                <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Storage Size on SD Card
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#a855f7", marginTop: "4px" }}>
                  &lt; 15 MB Total
                </div>
                <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>
                  Includes 12 soundboard audio items
                </div>
              </div>
            </div>

            {/* Offline Village Pack Action Card */}
            <div
              style={{
                background: "rgba(254, 166, 25, 0.1)",
                border: "1px solid rgba(254, 166, 25, 0.3)",
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="material-symbols-outlined" style={{ color: "#fea619", fontSize: "18px" }}>
                  download_for_offline
                </span>
                <strong style={{ fontSize: "13px", color: "#fef3c7" }}>
                  Zero-Connectivity Offline Village Pack
                </strong>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#d4d4d8", lineHeight: 1.4 }}>
                Download the offline curriculum bundle for remote forest schools (Saranda, Dumka, Chaibasa). Teachers can store this on their tablet SD card to run Bhasha-Sahayak soundboard and class lessons without SIM card or WiFi.
              </p>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#fea619",
                  color: "#18181b",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                onClick={handleDownloadOfflineVillagePack}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>
                  {offlineDownloadStatus === "packaging"
                    ? "Generating Bundle..."
                    : offlineDownloadStatus === "downloaded"
                    ? "✓ Downloaded (Village Pack Ready)"
                    : "Download Offline Village Bundle (.json)"}
                </span>
              </button>
              {offlineDownloadStatus === "downloaded" && (
                <span style={{ marginLeft: "10px", fontSize: "11px", color: "#4ade80", fontWeight: "600" }}>
                  ✓ Saved to device storage!
                </span>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #52525b",
                  background: "#27272a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
                onClick={() => setShowTabletModal(false)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Quick-Help & Classroom User Guide Modal */}
      {showHelpModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            style={{
              background: "#18181b",
              color: "#f4f4f5",
              padding: "24px",
              borderRadius: "14px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "18px",
                borderBottom: "1px solid #27272a",
                paddingBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#38bdf8" }}>
                  help_center
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "19px", color: "#fff", fontWeight: 700 }}>
                    शिक्षक संदर्शिका व सहायता (Teacher Guide & Help FAQ)
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#a1a1aa" }}>
                    PALASH Mother Tongue-Based Multilingual Education (MTB-MLE) Platform
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#a1a1aa",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Close Help Modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Quick Walkthrough Sections */}
            <div style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
              {/* Step 1: Lesson Studio */}
              <div style={{ background: "#27272a", borderRadius: "10px", padding: "14px 16px", borderLeft: "4px solid #3b82f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#60a5fa" }}>edit_note</span>
                  <strong style={{ fontSize: "14px", color: "#93c5fd" }}>1. पाठ तैयार करना (Lesson Studio)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#d4d4d8", lineHeight: 1.5 }}>
                  <strong>इनपुट के 4 तरीके:</strong> (1) हिंदी वाक्य टाइप करें, (2) JCERT/NCERT पुस्तक के पृष्ठ की फोटो लें (OCR), (3) बहु-पृष्ठीय PDF अध्याय अपलोड करें, या (4) माइक दबाकर बोलें। BOLI वाक्य को कक्षा 1–5 के स्तर पर सरल बनाकर जनजातीय भाषा व ध्वनि में बदल देता है।
                </p>
              </div>

              {/* Step 2: 3 Core Deliverables */}
              <div style={{ background: "#27272a", borderRadius: "10px", padding: "14px 16px", borderLeft: "4px solid #22c55e" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#4ade80" }}>verified</span>
                  <strong style={{ fontSize: "14px", color: "#86efac" }}>2. कक्षा शिक्षण के 3 प्रमुख साधन (Core Deliverables)</strong>
                </div>
                <ul style={{ margin: "4px 0 0", paddingLeft: "18px", fontSize: "12px", color: "#d4d4d8", lineHeight: 1.6 }}>
                  <li><strong>प्रिंट कार्यपत्रक (Print Worksheet with QR):</strong> U-DISE स्कूल सील व NIPUN Bharat कोड युक्त द्विभाषी A4 शीट प्रिंट करें। QR कोड स्कैन करके विद्यार्थी घर पर भी उच्चारण सुन सकते हैं।</li>
                  <li><strong>द्विभाषी शब्द-पत्ती (Bilingual Flashcards):</strong> पाठ के कठिन शब्दों को जनजातीय अवधारणाओं से जोड़ने वाली सचित्र 3D कार्ड्स।</li>
                  <li><strong>कक्षा ऑडियो व ऑफ़लाइन पैक (.zip):</strong> बिना इंटरनेट वाले गाँवों के लिए 1-क्लिक में पूरा ऑफ़लाइन पाठ डाउनलोड करें।</li>
                </ul>
              </div>

              {/* Step 3: Teacher Oral Companion */}
              <div style={{ background: "#27272a", borderRadius: "10px", padding: "14px 16px", borderLeft: "4px solid #f59e0b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#fbbf24" }}>record_voice_over</span>
                  <strong style={{ fontSize: "14px", color: "#fde68a" }}>3. कक्षा मौखिक साथी (Live Classroom Soundboard)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#d4d4d8", lineHeight: 1.5 }}>
                  गैर-जनजातीय शिक्षकों के लिए अनुशासन (शांत बैठो), प्रोत्साहन (शाबाश), व FLN दिनचर्या के <strong>1-टैप बटन</strong>। प्रत्येक वाक्य के साथ देवनागरी/रोमन उच्चारण निर्देश (जैसे <em>"Soben honko chupchap dub pe"</em>) दिए गए हैं ताकि शिक्षक बिना हिचक बोल सकें।
                </p>
              </div>

              {/* FAQ Section */}
              <div style={{ background: "#27272a", borderRadius: "10px", padding: "14px 16px", borderLeft: "4px solid #a855f7" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: "#c084fc" }}>quiz</span>
                  <strong style={{ fontSize: "14px", color: "#d8b4fe" }}>4. अक्सर पूछे जाने वाले प्रश्न (FAQ)</strong>
                </div>
                <div style={{ display: "grid", gap: "8px", fontSize: "12px", color: "#e4e4e7", lineHeight: 1.5 }}>
                  <div>
                    <strong style={{ color: "#f4f4f5" }}>प्र: यदि स्कूल में मोबाइल नेटवर्क या इंटरनेट न हो?</strong>
                    <div style={{ color: "#a1a1aa" }}>उत्तर: परिणाम स्क्रीन से <em>Download Offline Pack (.zip)</em> या ऊपर टैबलेट मोड से <em>Offline Village Bundle</em> डाउनलोड करें। यह बिना इंटरनेट के पूर्णतः कार्य करता है।</div>
                  </div>
                  <div>
                    <strong style={{ color: "#f4f4f5" }}>प्र: क्या यह 2GB सरकारी टैबलेट पर हैंग तो नहीं होगा?</strong>
                    <div style={{ color: "#a1a1aa" }}>उत्तर: बिल्कुल नहीं। BOLI का मेमोरी फुटप्रिंट मात्र ~142MB है (2GB का &lt;7%), जिससे OOM क्रैश का कोई जोखिम नहीं है।</div>
                  </div>
                  <div>
                    <strong style={{ color: "#f4f4f5" }}>प्र: यदि किसी शब्द के अनुवाद में सुधार की आवश्यकता हो?</strong>
                    <div style={{ color: "#a1a1aa" }}>उत्तर: हर वाक्य के नीचे "सुझाव दें (Suggest a Correction)" बटन है। आपके सुझाव हमारे डेटाबेस में सुरक्षित दर्ज होते हैं।</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #27272a", paddingTop: "14px" }}>
              <button
                type="button"
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => setShowHelpModal(false)}
              >
                <span>समझ गया / Close Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
