import { useState, useMemo, useRef, useEffect } from "react";
import { speak } from "../../api";

// Curated high-fidelity dialogue scripts for foundational JCERT primary topics
const PRIMER_TOPICS = {
  water: {
    id: "water",
    title: "पानी का मोल और जल चक्र (Water & Life)",
    concept: "Water conservation, clean drinking water, and nature's cycle",
    icon: "water_drop",
    vocab: [
      { hindi: "पानी / जल", sat: "ᱫᱟᱜ (Daag)", hoc: "दाः (Daa')", unr: "दाः (Daa')", kru: "अम्म (Amm)", sck: "पानी (Paani)" },
      { hindi: "कुआं / डाड़ी", sat: "ᱠᱩᱸᱭᱤ (Kuyi)", hoc: "कुंई (Kui)", unr: "कुंआ (Kua)", kru: "कुंआ (Kua)", sck: "कुँवा (Kūwa)" },
      { hindi: "साफ / स्वच्छ", sat: "ᱥᱟᱯᱷᱟ (Sapha)", hoc: "सफा (Safa)", unr: "सफा (Safa)", kru: "सफा (Safa)", sck: "सफा-सुघर (Safa)" },
    ],
    scripts: {
      sat: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों! आज हम जानेंगे कि जल हमारे जीवन के लिए क्यों जरूरी है।" },
        { speaker: "student", name: "सोमा (भाषा-मित्र · ᱥᱟᱱᱛᱟᱲᱤ)", lang: "sat", text: "ᱦᱚᱭ ᱜᱩᱨᱩᱡᱤ! ᱟᱵᱚ ᱥᱟᱱᱟᱢ ᱠᱚ ᱞᱟᱹᱜᱤᱫ 'ᱫᱟᱜ' (Daag) ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲᱟ, ᱫᱟᱜ ᱵᱟᱝᱠᱷᱟᱱ ᱡᱤᱣᱤ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱᱟ।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बिल्कुल सही सोमा! कुएं और चापाकल का पानी हमें हमेशा ढक कर रखना चाहिए।" },
        { speaker: "student", name: "सोमा (भाषा-मित्र · ᱥᱟᱱᱛᱟᱲᱤ)", lang: "sat", text: "ᱦᱮᱸ ᱢᱟᱥᱴᱚᱨ ᱜᱚᱢᱠᱮ, ᱥᱟᱯᱷᱟ ᱫᱟᱜ ᱧᱩ ᱞᱮᱠᱷᱟᱱ ᱦᱚᱲᱢᱚ ᱵᱮᱥ ᱛᱟᱦᱮᱸᱱᱟ ᱟᱨ ᱨᱩᱣᱟᱹ-ᱦᱟᱹᱥᱩ ᱵᱟᱝ ᱦᱩᱭᱩᱜᱼᱟ।" },
      ],
      hoc: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों! पीने का पानी हमेशा साफ और स्वच्छ होना चाहिए।" },
        { speaker: "student", name: "बिरसा (भाषा-मित्र · हो)", lang: "hoc", text: "हें गुरूजी! अलेयाः हातु रे 'दाः' (Daa') कुंई एते अगुयेयाले, दाः सफा गेया।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बहुत अच्छे बिरसा। गंदे पानी से पेट की बीमारियां हो जाती हैं।" },
        { speaker: "student", name: "बिरसा (भाषा-मित्र · हो)", lang: "hoc", text: "मारंग होनको को मेतालेया: दाः नूड़े रेयाः सफा बाटी रे दोएपे!" },
      ],
      unr: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों! आज हम प्रकृति के सबसे अनमोल उपहार 'जल' के बारे में बात करेंगे।" },
        { speaker: "student", name: "सुगिया (भाषा-मित्र · मुंडारी)", lang: "unr", text: "हे गुरूजी! मुंडारी रे 'दाः' (Daa') जीवोन रेयाः मूल तना, सिंगी दाः बानोःरे होनको रासा बाको तना।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "हाँ सुगिया, जब बारिश होती है तो खेत लहलहा उठते हैं।" },
        { speaker: "student", name: "सुगिया (भाषा-मित्र · मुंडारी)", lang: "unr", text: "हें गुरूजी, दाः गामकेदा तनादो बाबा खेत रे रासाते होनको पइटी तनाको!" },
      ],
      kru: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों, कुएं का पानी हमारे स्वास्थ्य के लिए बहुत आवश्यक है।" },
        { speaker: "student", name: "मंगरा (भाषा-मित्र · कुड़ुख़)", lang: "kru", text: "हं गुरूजी! कुड़ुख़ ही 'अम्म' (Amm) साफ उंना चाही, अम्म ही बिना जीव रक्षा मल्ला।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "मंगरा, हमें कुएं के पास गंदगी नहीं फैलानी चाहिए।" },
        { speaker: "student", name: "मंगरा (भाषा-मित्र · कुड़ुख़)", lang: "kru", text: "निन्ना कथ्था बेस रई गुरूजी, कुंआ कसन सफा उयना नाम्बा ही धरम तली।" },
      ],
      sck: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों, पानी की हर एक बूँद को हमें बचाना चाहिए।" },
        { speaker: "student", name: "बुधनी (भाषा-मित्र · सादरी)", lang: "sck", text: "हाँ मास्टर साहेब! हमरे कर गांव में कुँवा कर 'पानी' सब छौवा मन पीयेना, पानी बर्बाद नी करेक चाही।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "शाबाश बुधनी! नल खुला नहीं छोड़ना चाहिए।" },
        { speaker: "student", name: "बुधनी (भाषा-मित्र · सादरी)", lang: "sck", text: "हँ, पानी हे तबे जीवन हे, डाड़ी और पोखरा के सफा राखेब।" },
      ],
    },
  },
  forest: {
    id: "forest",
    title: "हमारा जंगल और सखुआ (Forests & Nature)",
    concept: "Flora, Sarhul festival, and environmental harmony",
    icon: "forest",
    vocab: [
      { hindi: "पेड़ / वृक्ष", sat: "ᱫᱟᱨᱮ (Dare)", hoc: "दारु (Daru)", unr: "दारु (Daru)", kru: "मन (Mann)", sck: "गाछ / पेड़ (Gaachh)" },
      { hindi: "जंगल / वन", sat: "ᱵᱤᱨ (Bir)", hoc: "बिर (Bir)", unr: "बिर (Bir)", kru: "झंख (Jhankh)", sck: "बोन / जंगल (Bon)" },
      { hindi: "फूल", sat: "ᱵᱟᱦᱟ (Baha)", hoc: "बाः (Baa')", unr: "बाः (Baa')", kru: "पुंप (Pump)", sck: "फूल (Phool)" },
    ],
    scripts: {
      sat: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों! झारखंड का अर्थ ही है 'झाड़ियों और वनों की भूमि'।" },
        { speaker: "student", name: "सोमा (भाषा-मित्र · ᱥᱟᱱᱛᱟᱲᱤ)", lang: "sat", text: "ᱦᱚᱭ ᱜᱩᱨᱩᱡᱤ! ᱟᱞᱮᱭᱟᱜ 'ᱵᱤᱨ' (Bir) ᱨᱮ ᱥᱟᱠᱷᱩᱣᱟ ᱫᱟᱨᱮ (Dare) ᱢᱮᱱᱟᱜᱼᱟ, ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ ᱨᱮ ᱵᱟᱦᱟ ᱠᱚ ᱛᱩᱢᱟᱹᱞᱟ᱾" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "पेड़ हमें ताजी हवा, फल और औषधियाँ देते हैं।" },
        { speaker: "student", name: "सोमा (भाषा-मित्र · ᱥᱟᱱᱛᱟᱲᱤ)", lang: "sat", text: "ᱟᱞᱮ ᱫᱚ ᱫᱟᱨᱮ ᱵᱟᱞᱮ ᱢᱟᱜᱼᱟ, ᱫᱟᱨᱮ ᱜᱮ ᱟᱵᱚᱣᱟᱜ ᱡᱤᱣᱤ ᱠᱟᱱᱟ᱾" },
      ],
      hoc: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "सखुआ के पेड़ हमारे पर्यावरण के सबसे बड़े रक्षक हैं।" },
        { speaker: "student", name: "बिरसा (भाषा-मित्र · हो)", lang: "hoc", text: "हें गुरूजी! बाः परोब रे सरजोम 'दारु' (Daru) रेयाः बाः बोंगा रे जोम-सेनेयाको।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "हाँ! प्रकृति और मनुष्य का यह रिश्ता हमें मिलकर बचाना है।" },
        { speaker: "student", name: "बिरसा (भाषा-मित्र · हो)", lang: "hoc", text: "अलेयाः बिर-बुरु सफा दोएते मारंग होनको को सिखाव लेया।" },
      ],
      unr: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों, पेड़-पौधों से हमें छाया और शुद्ध हवा मिलती है।" },
        { speaker: "student", name: "सुगिया (भाषा-मित्र · मुंडारी)", lang: "unr", text: "हे गुरूजी! 'दारु' (Daru) को बानोःरे जीव-जंतु ओकोते सेनोःआ? सखुआ दारु अलेयाः साथी तना।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बिल्कुल सही! हमें नए पौधे भी लगाने चाहिए।" },
        { speaker: "student", name: "सुगिया (भाषा-मित्र · मुंडारी)", lang: "unr", text: "हें गुरूजी, इस्कुल रे हुनको सोबेन नवा दारु रोपे तनाको!" },
      ],
      kru: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "जंगल हमारे जीवन और संस्कृति का अभिन्न हिस्सा हैं।" },
        { speaker: "student", name: "मंगरा (भाषा-मित्र · कुड़ुख़)", lang: "kru", text: "हं गुरूजी! 'झंख' (Jhankh) अरा 'मन' (Mann) कुड़ुख़ गने जुड़ी रई, सरना माँय मनेम पूजा मनि।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "इसलिए हम सभी को वनों की रक्षा करनी चाहिए।" },
        { speaker: "student", name: "मंगरा (भाषा-मित्र · कुड़ुख़)", lang: "kru", text: "मन मंजर पुंप खेखल ही सिंगार तली, मन कटना पाप तली।" },
      ],
      sck: [
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "बच्चों, महुआ और सखुआ के पेड़ झारखंड की पहचान हैं।" },
        { speaker: "student", name: "बुधनी (भाषा-मित्र · सादरी)", lang: "sck", text: "एकदम सच मास्टर साहेब! बोन में जब सखुआ फुलाएला, तब सब छौवा मन खुशी से झूम उठेना।" },
        { speaker: "teacher", name: "शिक्षक (मास्टर साहब)", lang: "hi", text: "पेड़ लगाना और उनकी रक्षा करना हमारा कर्तव्य है।" },
        { speaker: "student", name: "बुधनी (भाषा-मित्र · सादरी)", lang: "sck", text: "हाँ, हमरो स्कूल में एक-एक ठो पेड़ सब कोई रोपब।" },
      ],
    },
  },
};

const LANGUAGE_META = {
  sat: { label: "Santali (ᱚᱞ ᱪᱤᱠᱤ)", speakerBadge: "ᱥᱟᱱᱛᱟᱲᱤ Guide" },
  hoc: { label: "Ho (हो / 𑢹𑣉𑣉)", speakerBadge: "Ho Guide" },
  unr: { label: "Mundari (मुंडारी)", speakerBadge: "Mundari Guide" },
  kru: { label: "Kurukh (कुड़ुख़)", speakerBadge: "Kurukh Guide" },
  sck: { label: "Sadri (नागपुरी)", speakerBadge: "Sadri Guide" },
};

export default function AudioPrimer({ lessonText, currentGrade = 2 }) {
  const [activeTopicKey, setActiveTopicKey] = useState("water");
  const [selectedLang, setSelectedLang] = useState("sat");
  const [activeLineIndex, setActiveLineIndex] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playingSingleIndex, setPlayingSingleIndex] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);

  const topic = PRIMER_TOPICS[activeTopicKey] || PRIMER_TOPICS.water;
  const script = useMemo(() => {
    return topic.scripts[selectedLang] || topic.scripts.sat;
  }, [topic, selectedLang]);

  // Clean up audio on unmount or change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, [activeTopicKey, selectedLang]);

  async function playLine(index, line) {
    setActiveLineIndex(index);
    setPlayingSingleIndex(index);
    setAudioError(null);

    return new Promise(async (resolve) => {
      try {
        if (line.lang === "hi") {
          // Speak Hindi line using browser TTS
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(line.text);
          utterance.lang = "hi-IN";
          utterance.rate = playbackSpeed;
          utterance.onend = () => {
            setPlayingSingleIndex(null);
            resolve();
          };
          utterance.onerror = () => {
            setPlayingSingleIndex(null);
            resolve();
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // Speak tribal dialect using BOLI backend synthesis
          const res = await speak(line.text, line.lang);
          if (res.kind === "audio" && res.blob) {
            const url = URL.createObjectURL(res.blob);
            if (audioRef.current) audioRef.current.pause();
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.playbackRate = playbackSpeed;
            audio.onended = () => {
              setPlayingSingleIndex(null);
              resolve();
            };
            audio.onerror = () => {
              setPlayingSingleIndex(null);
              resolve();
            };
            await audio.play();
          } else {
            // Fallback
            const utterance = new SpeechSynthesisUtterance(line.text);
            utterance.lang = "hi-IN";
            utterance.rate = playbackSpeed;
            utterance.onend = () => {
              setPlayingSingleIndex(null);
              resolve();
            };
            window.speechSynthesis.speak(utterance);
          }
        }
      } catch (err) {
        setAudioError(err.message || "Speech synthesis error");
        setPlayingSingleIndex(null);
        resolve();
      }
    });
  }

  async function handlePlayAll() {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis.cancel();
      setActiveLineIndex(null);
      setPlayingSingleIndex(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < script.length; i++) {
      if (!isPlayingAll && i > 0 && !audioRef.current) break;
      await playLine(i, script[i]);
      // Small natural pause between turns
      await new Promise((r) => setTimeout(r, 400));
    }
    setIsPlayingAll(false);
    setActiveLineIndex(null);
  }

  return (
    <section className="audio-primer-container panel sun-card-shadow" aria-labelledby="primer-heading">
      {/* Header and Controls */}
      <div className="primer-header-row">
        <div className="primer-title-block">
          <div className="section-eyebrow">
            <span className="eyebrow-tag">NOTEBOOK-LM AUDIO OVERVIEW</span>
            <span>कक्षा संवाद एवं श्रव्य पाठ</span>
          </div>
          <h1 id="primer-heading" className="screen-title">
            Classroom Audio Primer & Podcast
          </h1>
          <p className="screen-subtitle">
            Interactive dual-speaker educational dialogue connecting standard curriculum concepts with local indigenous metaphors.
          </p>
        </div>

        {/* Dialect Selector */}
        <div className="primer-dialect-selector">
          <label htmlFor="primer-lang-select" className="primer-lang-label">
            <span className="material-symbols-outlined text-sm">record_voice_over</span>
            <span>Bhasha-Mitra Dialect:</span>
          </label>
          <select
            id="primer-lang-select"
            className="primer-select-input"
            value={selectedLang}
            onChange={(e) => {
              setSelectedLang(e.target.value);
              setActiveLineIndex(null);
              setIsPlayingAll(false);
            }}
          >
            {Object.entries(LANGUAGE_META).map(([code, meta]) => (
              <option key={code} value={code}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics Tabs */}
      <div className="primer-topics-bar">
        {Object.values(PRIMER_TOPICS).map((t) => (
          <button
            key={t.id}
            type="button"
            className={`primer-topic-tab ${activeTopicKey === t.id ? "is-active" : ""}`}
            onClick={() => {
              setActiveTopicKey(t.id);
              setActiveLineIndex(null);
              setIsPlayingAll(false);
            }}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            <span>{t.title}</span>
          </button>
        ))}

        {lessonText && (
          <div className="primer-active-note">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>Active Lesson Studio context available</span>
          </div>
        )}
      </div>

      {/* Player Action Bar */}
      <div className="primer-playback-bar">
        <div className="primer-play-main">
          <button
            type="button"
            className={`button button--primary tactile-btn-primary primer-play-btn ${isPlayingAll ? "is-playing" : ""}`}
            onClick={handlePlayAll}
          >
            <span className="material-symbols-outlined text-xl">
              {isPlayingAll ? "pause_circle" : "play_circle"}
            </span>
            <span>{isPlayingAll ? "संवाद रोकें (Pause Discussion)" : "पूरा संवाद सुनें (Play Full Discussion)"}</span>
          </button>

          <div className="primer-speed-pills">
            <span className="speed-label">Speed:</span>
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                type="button"
                className={`speed-pill ${playbackSpeed === s ? "is-selected" : ""}`}
                onClick={() => setPlaybackSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="button button--secondary tactile-btn-secondary primer-print-btn"
          onClick={() => window.print()}
          title="Print Dialogue Transcript for Blackboard Teaching"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          <span>संवाद स्क्रिप्ट प्रिंट करें</span>
        </button>
      </div>

      {audioError && (
        <div className="primer-error-banner">
          <span className="material-symbols-outlined text-sm">warning</span>
          <span>{audioError}</span>
        </div>
      )}

      {/* Main Dialogue Stream */}
      <div className="primer-dialogue-stream">
        {script.map((line, idx) => {
          const isTeacher = line.speaker === "teacher";
          const isActive = activeLineIndex === idx;
          const isPlayingThis = playingSingleIndex === idx;

          return (
            <div
              key={idx}
              className={`dialogue-turn ${isTeacher ? "turn-teacher" : "turn-student"} ${isActive ? "turn-active" : ""}`}
            >
              {/* Speaker Avatar Badge */}
              <div className="speaker-avatar">
                <span className="material-symbols-outlined text-xl">
                  {isTeacher ? "school" : "child_care"}
                </span>
                <span className="avatar-role-tag">{isTeacher ? "शिक्षक" : "भाषा-मित्र"}</span>
              </div>

              {/* Dialogue Bubble */}
              <div className="dialogue-bubble">
                <div className="bubble-header">
                  <strong className="speaker-name">{line.name}</strong>
                  <button
                    type="button"
                    className={`bubble-listen-btn ${isPlayingThis ? "is-speaking" : ""}`}
                    onClick={() => playLine(idx, line)}
                    title="Listen to this line"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isPlayingThis ? "graphic_eq" : "volume_up"}
                    </span>
                    <span>{isPlayingThis ? "बोल रहे हैं…" : "सुनें (Listen)"}</span>
                  </button>
                </div>

                <p className="bubble-text">{line.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vocabulary Bridge Drawer / Bottom Shelf */}
      <div className="primer-vocab-shelf">
        <div className="vocab-shelf-header">
          <span className="material-symbols-outlined text-base">menu_book</span>
          <strong>संवाद शब्दावली सेतु (Core Vocabulary Bridge):</strong>
        </div>
        <div className="vocab-shelf-grid">
          {topic.vocab.map((item, i) => (
            <div key={i} className="vocab-bridge-card">
              <span className="vocab-hindi">{item.hindi}</span>
              <span className="vocab-arrow material-symbols-outlined text-xs">arrow_forward</span>
              <span className="vocab-target">{item[selectedLang] || item.sat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
