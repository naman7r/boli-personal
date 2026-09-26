"""The curated phrase bank — the honest substitute for translation into
Ho, Mundari, Kurukh and Sadri.

This module is the source of truth for the table documented in
DATA_DICTIONARY.md §2. It exists because these four languages have no
open parallel corpus and no translation model, from us or anyone else
(PRD.md §4). A fixed Hindi phrase maps to a known target string that
stays inside the TTS checkpoint's character set; nothing here is
generated, and nothing here is translation.

**Every entry is unverified by a native speaker.** `verified` stays
False until an actual speaker confirms an entry, and STATE.md records
whether that has happened. Do not flip it to True to make a screen look
better (RULES.md §2).

Adding entries is encouraged — more classroom topics make a better demo.
Each new one needs a Hindi source, a hand-constructed or speaker-given
target string in the script that checkpoint expects (models/tts.py
SCRIPTS), and `verified: False`.
"""

import re

PHRASES = [
    # 1. पानी हमारा जीवन है (Water is our life)
    {
        "id": 1,
        "lang": "hoc",
        "hindi_source": "पानी हमारा जीवन है",
        "target_text": "ଦା ଆଲେ ଜୀଉ ତାନା",  # Odia script
        "verified": False,
    },
    {
        "id": 2,
        "lang": "unr",
        "hindi_source": "पानी हमारा जीवन है",
        "target_text": "ଦା ଆଲେ ଜିଉ ତାନା",  # Odia script
        "verified": False,
    },
    {
        "id": 3,
        "lang": "kru",
        "hindi_source": "पानी हमारा जीवन है",
        "target_text": "अम्म हमक जीवन रअदा",
        "verified": False,
    },
    {
        "id": 4,
        "lang": "sck",
        "hindi_source": "पानी हमारा जीवन है",
        "target_text": "पानी हमन के जीवन हे",
        "verified": False,
    },
    # 2. नमस्ते (Classroom greeting)
    {
        "id": 5,
        "lang": "hoc",
        "hindi_source": "नमस्ते",
        "target_text": "ଜୋହାର",
        "verified": False,
    },
    {
        "id": 6,
        "lang": "unr",
        "hindi_source": "नमस्ते",
        "target_text": "ଜୋହାର",
        "verified": False,
    },
    {
        "id": 7,
        "lang": "kru",
        "hindi_source": "नमस्ते",
        "target_text": "जोहार",
        "verified": False,
    },
    {
        "id": 8,
        "lang": "sck",
        "hindi_source": "नमस्ते",
        "target_text": "जोहार",
        "verified": False,
    },
    # 3. किताब खोलो (Open book)
    {
        "id": 9,
        "lang": "hoc",
        "hindi_source": "किताब खोलो",
        "target_text": "ପୁଥି ଉଗାଡ଼ା",
        "verified": False,
    },
    {
        "id": 10,
        "lang": "unr",
        "hindi_source": "किताब खोलो",
        "target_text": "ପୁଥି ଉଗାଡ଼ା",
        "verified": False,
    },
    {
        "id": 11,
        "lang": "kru",
        "hindi_source": "किताब खोलो",
        "target_text": "किताब उग्गड़ा",
        "verified": False,
    },
    {
        "id": 12,
        "lang": "sck",
        "hindi_source": "किताब खोलो",
        "target_text": "किताब खोला",
        "verified": False,
    },
    # 4. यहाँ बैठो (Sit here)
    {
        "id": 13,
        "lang": "hoc",
        "hindi_source": "यहाँ बैठो",
        "target_text": "ନେରେ ଦୁବୁ ମେ",
        "verified": False,
    },
    {
        "id": 14,
        "lang": "unr",
        "hindi_source": "यहाँ बैठो",
        "target_text": "ନେରେ ଦୁବୁ ମେ",
        "verified": False,
    },
    {
        "id": 15,
        "lang": "kru",
        "hindi_source": "यहाँ बैठो",
        "target_text": "इस्सने उक्का",
        "verified": False,
    },
    {
        "id": 16,
        "lang": "sck",
        "hindi_source": "यहाँ बैठो",
        "target_text": "इहाँ बैठा",
        "verified": False,
    },
    # 5. स्कूल चलो (Let's go to school)
    {
        "id": 17,
        "lang": "hoc",
        "hindi_source": "स्कूल चलो",
        "target_text": "ଇସ୍କୁଲ ସେନୋଃ ମେ",
        "verified": False,
    },
    {
        "id": 18,
        "lang": "unr",
        "hindi_source": "स्कूल चलो",
        "target_text": "ଇସ୍କୁଲ ସେନୋଃ ମେ",
        "verified": False,
    },
    {
        "id": 19,
        "lang": "kru",
        "hindi_source": "स्कूल चलो",
        "target_text": "स्कूल कला",
        "verified": False,
    },
    {
        "id": 20,
        "lang": "sck",
        "hindi_source": "स्कूल चलो",
        "target_text": "स्कूल चला",
        "verified": False,
    },
    # 6. सब बच्चे शांत बैठो (All children sit quietly)
    {
        "id": 21,
        "lang": "hoc",
        "hindi_source": "सब बच्चे शांत बैठो",
        "target_text": "ସୋବେନ ହୋନକୋ ଚୁପଚାପ ଦୁବ ପେ",
        "aliases": ["सोबेन होनको चुपचाप दुब पे", "शांत बैठो", "सब बच्चे शांत बैठो"],
        "verified": False,
    },
    {
        "id": 22,
        "lang": "unr",
        "hindi_source": "सब बच्चे शांत बैठो",
        "target_text": "ସୋବେନ ହୁନକୋ ଥିର ଦୁବ ପେ",
        "aliases": ["सोबेन हुनको थिर दुब पे", "शांत बैठो", "सब बच्चे शांत बैठो"],
        "verified": False,
    },
    {
        "id": 23,
        "lang": "kru",
        "hindi_source": "सब बच्चे शांत बैठो",
        "target_text": "हुर्मर खद्दर चूपके उक्का",
        "aliases": ["शांत बैठो", "सब बच्चे शांत बैठो"],
        "verified": False,
    },
    {
        "id": 24,
        "lang": "sck",
        "hindi_source": "सब बच्चे शांत बैठो",
        "target_text": "सब छौवा मन शांत बइसू",
        "aliases": ["शांत बैठो", "सब बच्चे शांत बैठो"],
        "verified": False,
    },
    # 7. कतार (लाइन) बनाओ (Form a line)
    {
        "id": 25,
        "lang": "hoc",
        "hindi_source": "कतार (लाइन) बनाओ",
        "target_text": "ସୋବେନ କୋ ଲାଇନ ବାଇ ପେ",
        "aliases": ["सोबेन को लाइन बाई पे", "कतार बनाओ", "लाइन बनाओ", "कतार (लाइन) बनाओ"],
        "verified": False,
    },
    {
        "id": 26,
        "lang": "unr",
        "hindi_source": "कतार (लाइन) बनाओ",
        "target_text": "ସୋବେନ କୋ କତାର ବାଇ ପେ",
        "aliases": ["सोबेन को कतार बाई पे", "कतार बनाओ", "लाइन बनाओ", "कतार (लाइन) बनाओ"],
        "verified": False,
    },
    {
        "id": 27,
        "lang": "kru",
        "hindi_source": "कतार (लाइन) बनाओ",
        "target_text": "पंती कम्मना",
        "aliases": ["कतार बनाओ", "लाइन बनाओ", "कतार (लाइन) बनाओ"],
        "verified": False,
    },
    {
        "id": 28,
        "lang": "sck",
        "hindi_source": "कतार (लाइन) बनाओ",
        "target_text": "सब कोई कतार बनाऊ",
        "aliases": ["कतार बनाओ", "लाइन बनाओ", "कतार (लाइन) बनाओ"],
        "verified": False,
    },
    # 8. मेरी बात ध्यान से सुनो (Listen carefully)
    {
        "id": 29,
        "lang": "hoc",
        "hindi_source": "मेरी बात ध्यान से सुनो",
        "target_text": "ଅଞାଃ କଜୀ ଧ୍ୟାନ ତେ ଆୟୁମ ପେ",
        "aliases": ["अञाः कजी ध्यान ते आयुम पे", "ध्यान से सुनो", "मेरी बात ध्यान से सुनो"],
        "verified": False,
    },
    {
        "id": 30,
        "lang": "unr",
        "hindi_source": "मेरी बात ध्यान से सुनो",
        "target_text": "ଅଞାଃ କଜୀ ଧ୍ୟାନ ତେ ଆୟୁମ ପେ",
        "aliases": ["अञाः कजी ध्यान ते आयुम पे", "ध्यान से सुनो", "मेरी बात ध्यान से सुनो"],
        "verified": False,
    },
    {
        "id": 31,
        "lang": "kru",
        "hindi_source": "मेरी बात ध्यान से सुनो",
        "target_text": "एंगहै कथ्था ध्यान ती मेना",
        "aliases": ["ध्यान से सुनो", "मेरी बात ध्यान से सुनो"],
        "verified": False,
    },
    {
        "id": 32,
        "lang": "sck",
        "hindi_source": "मेरी बात ध्यान से सुनो",
        "target_text": "मोर बात ध्यान से सुनू",
        "aliases": ["ध्यान से सुनो", "मेरी बात ध्यान से सुनो"],
        "verified": False,
    },
    # 9. हाथ ऊपर करो (Raise hands)
    {
        "id": 33,
        "lang": "hoc",
        "hindi_source": "हाथ ऊपर करो",
        "target_text": "ତୀ ଚେତାନ ରାକାବ ପେ",
        "aliases": ["ती चेटान राकाब पे", "हाथ ऊपर करो"],
        "verified": False,
    },
    {
        "id": 34,
        "lang": "unr",
        "hindi_source": "हाथ ऊपर करो",
        "target_text": "ତୀ ଚେତାନ ରାକାବ ପେ",
        "aliases": ["ती चेटान राकाब पे", "हाथ ऊपर करो"],
        "verified": False,
    },
    {
        "id": 35,
        "lang": "kru",
        "hindi_source": "हाथ ऊपर करो",
        "target_text": "खेक्खा मय्या नन्ना",
        "aliases": ["हाथ ऊपर करो"],
        "verified": False,
    },
    {
        "id": 36,
        "lang": "sck",
        "hindi_source": "हाथ ऊपर करो",
        "target_text": "हाथ ऊपर करू",
        "aliases": ["हाथ ऊपर करो"],
        "verified": False,
    },
    # 10. बहुत बढ़िया! शाबाश! (Very good! Well done!)
    {
        "id": 37,
        "lang": "hoc",
        "hindi_source": "बहुत बढ़िया! शाबाश!",
        "target_text": "ଏତୋଂ ବିସି ବୁଗି ସାବାସ",
        "aliases": ["एतों बिशी बुगी शाबाश", "एतों बिशी बुगी! शाबाश!", "बहुत बढ़िया", "शाबाश", "बहुत बढ़िया! शाबाश!"],
        "verified": False,
    },
    {
        "id": 38,
        "lang": "unr",
        "hindi_source": "बहुत बढ़िया! शाबाश!",
        "target_text": "ଅଡ଼ି ବୁଗି ସାବାସ",
        "aliases": ["अड़ि बुगी शाबाश", "अड़ि बुगी! शाबाश!", "बहुत बढ़िया", "शाबाश", "बहुत बढ़िया! शाबाश!"],
        "verified": False,
    },
    {
        "id": 39,
        "lang": "kru",
        "hindi_source": "बहुत बढ़िया! शाबाश!",
        "target_text": "कोड़हा दव शाबाश",
        "aliases": ["कोड़हा दव! शाबाश!", "बहुत बढ़िया", "शाबाश", "बहुत बढ़िया! शाबाश!"],
        "verified": False,
    },
    {
        "id": 40,
        "lang": "sck",
        "hindi_source": "बहुत बढ़िया! शाबाश!",
        "target_text": "बहुत बेस शाबाश",
        "aliases": ["बहुत बेस! शाबाश!", "बहुत बढ़िया", "शाबाश", "बहुत बढ़िया! शाबाश!"],
        "verified": False,
    },
    # 11. सब बच्चे ताली बजाओ! (All children clap!)
    {
        "id": 41,
        "lang": "hoc",
        "hindi_source": "सब बच्चे ताली बजाओ!",
        "target_text": "ସୋବେନ ହୋନକୋ ତାଲି ଠୋକେ ପେ",
        "aliases": ["सोबेन होनको ताली ठोके पे!", "सोबेन होनको ताली ठोके पे", "ताली बजाओ", "सब बच्चे ताली बजाओ!"],
        "verified": False,
    },
    {
        "id": 42,
        "lang": "unr",
        "hindi_source": "सब बच्चे ताली बजाओ!",
        "target_text": "ସୋବେନ ହୁନକୋ ତାଲି ସାଡ଼େ ପେ",
        "aliases": ["सोबेन हुनको ताली साड़े पे!", "सोबेन हुनको ताली साड़े पे", "ताली बजाओ", "सब बच्चे ताली बजाओ!"],
        "verified": False,
    },
    {
        "id": 43,
        "lang": "kru",
        "hindi_source": "सब बच्चे ताली बजाओ!",
        "target_text": "हुर्मर खद्दर ताली ठोका",
        "aliases": ["हुर्मर खद्दर ताली ठोका!", "ताली बजाओ", "सब बच्चे ताली बजाओ!"],
        "verified": False,
    },
    {
        "id": 44,
        "lang": "sck",
        "hindi_source": "सब बच्चे ताली बजाओ!",
        "target_text": "सब छौवा मन ताली बजाऊ",
        "aliases": ["सब छौवा मन ताली बजाऊ!", "ताली बजाओ", "सब बच्चे ताली बजाओ!"],
        "verified": False,
    },
    # 12. आप बहुत अच्छे बच्चे हो (You are very good children)
    {
        "id": 45,
        "lang": "hoc",
        "hindi_source": "आप बहुत अच्छे बच्चे हो",
        "target_text": "ଅପେ ଏତୋଂ ବୁଗି ହୋନକୋ ପେ",
        "aliases": ["अपे एतों बुगी होनको पे", "आप बहुत अच्छे बच्चे हो"],
        "verified": False,
    },
    {
        "id": 46,
        "lang": "unr",
        "hindi_source": "आप बहुत अच्छे बच्चे हो",
        "target_text": "ଅପେ ଅଡ଼ି ବୁଗି ହୁନକୋ ପେ",
        "aliases": ["अपे अड़ि बुगी हुनको पे", "आप बहुत अच्छे बच्चे हो"],
        "verified": False,
    },
    {
        "id": 47,
        "lang": "kru",
        "hindi_source": "आप बहुत अच्छे बच्चे हो",
        "target_text": "नीम कोड़हा दव खद्दर रहअत",
        "aliases": ["नीम कोड़हा दव खद्दर रहअत", "आप बहुत अच्छे बच्चे हो"],
        "verified": False,
    },
    {
        "id": 48,
        "lang": "sck",
        "hindi_source": "आप बहुत अच्छे बच्चे हो",
        "target_text": "रउरे मन बहुत बेस छौवा हेकी",
        "aliases": ["रउरे मन बहुत बेस छौवा हेकी", "आप बहुत अच्छे बच्चे हो"],
        "verified": False,
    },
    # 13. पानी पियो (Drink water)
    {
        "id": 49,
        "lang": "hoc",
        "hindi_source": "पानी पियो",
        "target_text": "ଦାଃ ନୂ ମେ",
        "aliases": ["दाः नू मे", "पानी पियो"],
        "verified": False,
    },
    {
        "id": 50,
        "lang": "unr",
        "hindi_source": "पानी पियो",
        "target_text": "ଦାଃ ନୁ ମେ",
        "aliases": ["दाः नु मे", "पानी पियो"],
        "verified": False,
    },
    {
        "id": 51,
        "lang": "kru",
        "hindi_source": "पानी पियो",
        "target_text": "अम्म ओन्ना",
        "aliases": ["अम्म ओन्ना", "पानी पियो"],
        "verified": False,
    },
    {
        "id": 52,
        "lang": "sck",
        "hindi_source": "पानी पियो",
        "target_text": "पानी पीऊ",
        "aliases": ["पानी पीऊ", "पानी पियो"],
        "verified": False,
    },
    # 14. कॉपी में लिखो (Write in copy)
    {
        "id": 53,
        "lang": "hoc",
        "hindi_source": "कॉपी में लिखो",
        "target_text": "ଅଲ ମେ",
        "aliases": ["अल मे", "कॉपी में लिखो", "लिखो"],
        "verified": False,
    },
    {
        "id": 54,
        "lang": "unr",
        "hindi_source": "कॉपी में लिखो",
        "target_text": "ଅଲ ମେ",
        "aliases": ["अल मे", "कॉपी में लिखो", "लिखो"],
        "verified": False,
    },
    {
        "id": 55,
        "lang": "kru",
        "hindi_source": "कॉपी में लिखो",
        "target_text": "इड़ा",
        "aliases": ["इड़ा", "कॉपी में लिखो", "लिखो"],
        "verified": False,
    },
    {
        "id": 56,
        "lang": "sck",
        "hindi_source": "कॉपी में लिखो",
        "target_text": "कॉपी में लिखा",
        "aliases": ["कॉपी में लिखा", "लिखो"],
        "verified": False,
    },
    # 15. मेरे पीछे बोलो (Repeat after me)
    {
        "id": 57,
        "lang": "hoc",
        "hindi_source": "मेरे पीछे बोलो",
        "target_text": "ଅଞାଃ ତୟୋମ ତେ କଜୀ ପେ",
        "aliases": ["अञाः तयोम ते कजी पे", "मेरे पीछे बोलो"],
        "verified": False,
    },
    {
        "id": 58,
        "lang": "unr",
        "hindi_source": "मेरे पीछे बोलो",
        "target_text": "ଅଞାଃ ତୟୋମ ତେ କଜୀ ପେ",
        "aliases": ["अञाः तयोम ते कजी पे", "मेरे पीछे बोलो"],
        "verified": False,
    },
    {
        "id": 59,
        "lang": "kru",
        "hindi_source": "मेरे पीछे बोलो",
        "target_text": "एंघै खोखा बाना",
        "aliases": ["एंघै खोखा बाना", "मेरे पीछे बोलो"],
        "verified": False,
    },
    {
        "id": 60,
        "lang": "sck",
        "hindi_source": "मेरे पीछे बोलो",
        "target_text": "मोर पाछे बोला",
        "aliases": ["मोर पाछे बोला", "मेरे पीछे बोलो"],
        "verified": False,
    },
]

# The languages this bank covers — i.e. the ones with no translation model.
LANGS = sorted({p["lang"] for p in PHRASES})


def options(lang: str) -> list[dict]:
    """Every phrase available in `lang`, for the UI to offer as choices."""
    return [p for p in PHRASES if p["lang"] == lang]


def _clean(s: str) -> str:
    s = re.sub(r"[.!?,।:;\-_\"'()]+", " ", s)
    return " ".join(s.strip().split()).lower()


def lookup(lang: str, text: str) -> dict | None:
    """Find the entry `text` refers to, by Hindi source, target text, or alias.

    Lenient about punctuation and whitespace, strict about matching a known phrase.
    """
    cleaned = _clean(text)

    if not cleaned:
        return None

    opts = options(lang)
    for p in opts:
        candidates = [_clean(p["hindi_source"]), _clean(p["target_text"])]
        for alias in p.get("aliases", []):
            candidates.append(_clean(alias))
        if cleaned in candidates:
            return p

    return None


def _normalise(text: str) -> str:
    """Collapse whitespace and drop sentence-final punctuation."""
    return " ".join(text.split()).rstrip("।॥?!. ")


