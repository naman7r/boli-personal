import { capabilityBadge, describeCapability, nativeName, LANGUAGE_DETAILS } from "../../capability";

// One selectable language card, with rich regional & pedagogical details.
export default function LanguageChip({ language, selected, onToggle }) {
  const unavailable = language.translation === "none" && language.tts === "none";
  const details = LANGUAGE_DETAILS[language.code] || {};
  const native = details.nativeScript || nativeName(language);
  const isAi = language.translation === "full";

  return (
    <label
      className={`lang-select-card ${isAi ? "is-ai" : "is-bank"} ${
        selected ? "is-selected" : ""
      } ${unavailable ? "is-disabled" : ""}`}
    >
      <input
        type="checkbox"
        className="lang-card-input"
        checked={selected}
        disabled={unavailable}
        onChange={() => onToggle(language.code)}
      />
      <div className="lang-card-content">
        <div className="lang-card-top-bar">
          <div className="lang-card-header-left">
            <div
              className={`lang-card-check-box ${selected ? "is-checked" : ""}`}
              aria-hidden="true"
            >
              {selected && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  check
                </span>
              )}
            </div>
            <div className="lang-title-stack">
              <span className="lang-card-name">{language.name}</span>
              {native && (
                <span className="lang-card-native-tag in-script" lang={language.code}>
                  {native}
                </span>
              )}
            </div>
          </div>

          <span className="lang-tech-badge">
            {capabilityBadge(language)}
          </span>
        </div>

        {details.regions && (
          <div className="lang-card-region-row">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              location_on
            </span>
            <span>{details.regions}</span>
          </div>
        )}

        <div className="lang-card-voice-row">
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
            volume_up
          </span>
          <span>{details.voiceStatus || describeCapability(language)}</span>
        </div>

        {details.engineBadge && (
          <div className="lang-card-engine-row">
            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
              tune
            </span>
            <span>{details.engineBadge}</span>
          </div>
        )}
      </div>
    </label>
  );
}

