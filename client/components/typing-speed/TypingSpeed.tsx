import { useEffect } from "react";
import { AtSign, Hash, Clock, Type, Quote, RotateCcw } from "lucide-react";

export default function TypingSpeed() {
  useEffect(() => {
    // inject script only once
    const script = document.createElement("script");
    const scriptText = document.querySelector("#typing-script")?.innerHTML || "";
    script.innerHTML = scriptText;
    document.body.appendChild(script);

    return () => {
      if (typeof (window as any).cleanupTypingSpeed === "function") {
        (window as any).cleanupTypingSpeed();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent">
      <div className="py-8 lg:py-12">
        <div
          className="typing-speed-container text-[#2D4D35]"
          dangerouslySetInnerHTML={{
            __html: `
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

<style>
  .typing-speed-container {
    --bg: transparent;
    --surface: rgba(245, 250, 247, 0.8);
    --surface-soft: rgba(240, 247, 240, 0.9);
    --surface-elevated: rgba(197, 220, 201, 0.3);
    --border: #C5DCC9;
    --border-hover: rgba(16, 169, 104, 0.3);
    --text-dim: #4A6857;
    --text-muted: #74968A;
    --text-sub: #2D4D35;
    --text-main: #1F3A26;
    --accent: #10A968;
    --accent-alt: #1fb981;
    --correct: #10A968;
    --wrong: #ef4444;
    --cursor: #10A968;
    --font-mono: 'Roboto Mono', monospace;
    --font-ui: 'Space Grotesk', sans-serif;
  }

  .typing-speed-container * { box-sizing: border-box; }

  /* MAIN */
  .typing-speed-container main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 80px 20px;
    gap: 36px;
  }

  /* TOOLBAR */
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
    background: var(--surface-soft);
    padding: 14px 18px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  }

  .toolbar-divider {
    width: 1px; height: 22px;
    background: var(--border);
    margin: 0 4px;
  }

  .tb-btn {
    background: rgba(16, 169, 104, 0.12);
    border: 1px solid var(--border);
    color: #2D4D35;
    cursor: pointer;
    font-size: 0.82rem;
    font-family: var(--font-ui);
    padding: 8px 14px;
    border-radius: 12px;
    transition: all 0.2s ease;
    display: flex; align-items: center; gap: 5px;
    white-space: nowrap;
    font-weight: 600;
  }
  .tb-btn:hover {
    color: #10A968;
    background: rgba(16, 169, 104, 0.18);
    border-color: #10A968;
  }
  .tb-btn.active {
    color: #fff;
    background: #10A968;
    border-color: #10A968;
  }

  .tb-icon {
    width: 0.9em;
    height: 0.9em;
    opacity: 0.8;
    flex-shrink: 0;
  }

  .tb-btn svg {
    width: 0.9em;
    height: 0.9em;
    flex-shrink: 0;
    opacity: 0.8;
  }

  .btn-primary svg, .btn-secondary svg {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }

  .restart-btn svg {
    width: 1.1em;
    height: 1.1em;
    flex-shrink: 0;
  }

  /* TIMER DISPLAY */
  .timer-display {
    font-family: var(--font-mono);
    font-size: 2.2rem;
    font-weight: 600;
    color: #10A968;
    min-width: 60px;
    text-align: center;
    transition: color 0.3s;
    padding: 14px 28px;
    border-radius: 18px;
    background: rgba(240, 247, 240, 0.8);
    border: 2px solid #C5DCC9;
  }
  .timer-display.urgent { color: var(--wrong); animation: pulse 0.5s infinite alternate; }
  @keyframes pulse { to { opacity: 0.6; } }

  /* TYPING AREA */
  .typing-container {
    width: 100%;
    max-width: 1000px;
    position: relative;
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 18px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.22);
  }

  .words-wrapper {
    position: relative;
    font-family: var(--font-mono);
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    line-height: 1.9;
    height: calc(1.9em * 3);
    overflow: hidden;
    cursor: text;
    user-select: none;
    border-radius: 24px;
    padding: 24px 22px;
    color: #1F3A26;
  }

  .words-inner {
    position: absolute;
    top: 0; left: 0; right: 0;
    transition: top 0.2s ease;
  }

  .word {
    display: inline-block;
    margin-right: 0.6em;
    position: relative;
  }

  .word.incorrect-word {
    text-decoration: underline;
    text-decoration-color: var(--wrong);
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
  }

  .letter {
    color: #74968A;
    transition: color 0.05s;
    position: relative;
    font-weight: 500;
  }
  .letter.correct { color: #10A968; font-weight: 600; }
  .letter.wrong { color: #dc2626; font-weight: 600; }
  .letter.extra { color: #dc2626; opacity: 0.9; font-weight: 600; }

  /* CARET — sits as underline beneath the current letter */
  .caret {
    position: absolute;
    width: 0.6em;
    height: 3px;
    background: var(--cursor);
    border-radius: 2px;
    bottom: 0;
    transform: translateY(3px);
    animation: blink 1s step-end infinite;
    transition: left 0.06s cubic-bezier(0.22,1,0.36,1), top 0.06s;
    pointer-events: none;
    box-shadow: 0 0 14px rgba(255,255,255,0.25);
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .caret.typing { animation: none; opacity: 1; }

  /* HIDDEN INPUT */
  #typing-input {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0;
    cursor: text;
    font-size: 1px;
    border: none;
    background: transparent;
    outline: none;
    resize: none;
  }

  /* OVERLAY (unfocused) */
  .focus-overlay {
    position: absolute;
    inset: -20px;
    background: rgba(240, 247, 240, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    color: #2D4D35;
    gap: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
    z-index: 10;
    font-weight: 600;
  }
  .focus-overlay.hidden { opacity: 0; pointer-events: none; }

  /* CONTROLS */
  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .restart-btn {
    background: rgba(16, 169, 104, 0.08);
    border: 1px solid var(--border);
    color: var(--text-main);
    cursor: pointer;
    padding: 12px;
    border-radius: 12px;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    display: flex; align-items: center;
  }
  .restart-btn:hover {
    color: var(--accent);
    background: rgba(16, 169, 104, 0.12);
    border-color: var(--border-hover);
  }

  /* RESULTS */
  .results-panel {
    display: none;
    width: 100%;
    max-width: 900px;
    animation: fadeUp 0.4s ease;
  }
  .results-panel.show { display: block; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px 18px;
    text-align: center;
    box-shadow: 0 18px 40px rgba(0,0,0,0.17);
  }

  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #4A6857;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 2.2rem;
    font-weight: 700;
    color: #10A968;
  }

  .stat-unit {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .results-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn-primary {
    background: #10A968;
    color: #ffffff;
    border: none;
    padding: 14px 30px;
    border-radius: 14px;
    font-family: var(--font-ui);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 16px 34px rgba(16, 169, 104, 0.25);
  }
  .btn-primary:hover {
    background: #0d8a52;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: rgba(16, 169, 104, 0.1);
    color: var(--accent);
    border: 1px solid var(--border);
    padding: 14px 30px;
    border-radius: 14px;
    font-family: var(--font-ui);
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .btn-secondary:hover {
    background: rgba(16, 169, 104, 0.15);
    border-color: var(--border-hover);
  }

  /* WPM Chart Bar */
  .wpm-chart {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .chart-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-sub);
    margin-bottom: 14px;
  }
  .chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 60px;
  }
  .chart-bar {
    flex: 1;
    background: #10A968;
    border-radius: 3px 3px 0 0;
    opacity: 0.8;
    min-height: 2px;
    transition: opacity 0.2s;
  }
  .chart-bar:hover { opacity: 1; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .words-wrapper { font-size: 1rem; }
    .toolbar { gap: 4px; padding: 8px 10px; }
    .tb-btn { padding: 5px 8px; font-size: 0.78rem; }
    .timer-display { font-size: 1.5rem; }
    .stat-value { font-size: 1.6rem; }
  }
</style>

<div class="typing-inner">
<main>

  <!-- TOOLBAR -->
  <div class="toolbar" id="toolbar">
    <button class="tb-btn" id="tb-punct" onclick="toggleOption('punctuation')">
      <svg class="tb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><text x="9" y="15" font-size="8" fill="currentColor">@</text></svg> punctuation
    </button>
    <button class="tb-btn" id="tb-numbers" onclick="toggleOption('numbers')">
      <svg class="tb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 9h6v6H9z"></path></svg> numbers
    </button>

    <div class="toolbar-divider"></div>

    <button class="tb-btn active" id="mode-time" onclick="setMode('time')">
      <svg class="tb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> time
    </button>
    <button class="tb-btn" id="mode-words" onclick="setMode('words')">
      <svg class="tb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7h16M4 12h16M4 17h16"></polyline></svg> words
    </button>
    <button class="tb-btn" id="mode-quote" onclick="setMode('quote')">
      <svg class="tb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-4-4-7-4s-4 2.75-4 4c0 5 4 1 4 8s0 7-4 7z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-4-4-7-4s-4 2.75-4 4c0 5 4 1 4 8s0 7-4 7z"></path></svg> quote
    </button>

    <div class="toolbar-divider"></div>

    <button class="tb-btn active" id="dur-15" onclick="setDuration(15)">15</button>
    <button class="tb-btn" id="dur-30" onclick="setDuration(30)">30</button>
    <button class="tb-btn" id="dur-60" onclick="setDuration(60)">60</button>
    <button class="tb-btn" id="dur-120" onclick="setDuration(120)">120</button>
  </div>

  <!-- TIMER -->
  <div class="timer-display" id="timer">15</div>

  <!-- TYPING AREA -->
  <div class="typing-container" id="typing-container">
    <div class="words-wrapper" id="words-wrapper" onclick="focusInput()">
      <div class="words-inner" id="words-inner"></div>
      <div class="caret" id="caret"></div>
      <div class="focus-overlay" id="focus-overlay" onclick="focusInput()">
        🖱 Click here or press any key to start
      </div>
    </div>
    <textarea id="typing-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
  </div>

  <!-- CONTROLS -->
  <div class="controls">
    <button class="restart-btn" id="restart-btn" onclick="restartTest()" title="Restart (Tab + Enter)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2-8.83"></path></svg>
    </button>
  </div>

  <!-- RESULTS -->
  <div class="results-panel" id="results-panel">
    <div class="results-grid">
      <div class="stat-card">
        <div class="stat-label">wpm</div>
        <div class="stat-value" id="res-wpm">0</div>
        <div class="stat-unit">words per min</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">raw</div>
        <div class="stat-value" id="res-raw">0</div>
        <div class="stat-unit">raw wpm</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">accuracy</div>
        <div class="stat-value" id="res-acc">0%</div>
        <div class="stat-unit">correct chars</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">correct</div>
        <div class="stat-value" id="res-correct">0</div>
        <div class="stat-unit">words</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">incorrect</div>
        <div class="stat-value" id="res-incorrect">0</div>
        <div class="stat-unit">words</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">time</div>
        <div class="stat-value" id="res-time">0s</div>
        <div class="stat-unit">duration</div>
      </div>
    </div>

    <div class="wpm-chart">
      <div class="chart-title">WPM over time</div>
      <div class="chart-bars" id="chart-bars"></div>
    </div>

    <div class="results-actions">
      <button class="btn-primary" onclick="restartTest()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em;"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2-8.83"></path></svg>
        Try Again
      </button>
      <button class="btn-secondary" onclick="newTest()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        New Test
      </button>
    </div>
  </div>

</main>
</div>

<script id="typing-script">
(function() {
  // ─── WORD BANKS ───────────────────────────────────────────────
  const wordBanks = {
    common: "the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us".split(" "),
    punct: [".", ",", ";", ":", "!", "?", "-", "'", '"'],
    numbers: ["0","1","2","3","4","5","6","7","8","9"],
    quotes: [
      "the quick brown fox jumps over the lazy dog",
      "to be or not to be that is the question",
      "all that glitters is not gold",
      "in the beginning was the word and the word was with god",
      "it was the best of times it was the worst of times",
      "ask not what your country can do for you ask what you can do for your country",
      "the only thing we have to fear is fear itself",
      "life is what happens when you are busy making other plans"
    ]
  };

  // ─── STATE ────────────────────────────────────────────────────
  let state = {
    mode: 'time',
    duration: 15,
    punctuation: false,
    numbers: false,
    words: [],
    wordEls: [],
    letterEls: [],
    currentWordIdx: 0,
    currentLetterIdx: 0,
    typed: '',
    typedWords: [],
    started: false,
    finished: false,
    timer: null,
    timeLeft: 15,
    totalTime: 15,
    wpmHistory: [],
    correctChars: 0,
    totalChars: 0,
    caretBlinking: true,
    tabHeld: false,
    startTime: 0
  };

  // ─── GENERATE WORDS ───────────────────────────────────────────
  function generateWords(count = 80) {
    if (state.mode === 'quote') {
      const q = wordBanks.quotes[Math.floor(Math.random() * wordBanks.quotes.length)];
      return q.split(' ');
    }
    let pool = [...wordBanks.common];
    let words = [];
    for (let i = 0; i < count; i++) {
      let word = pool[Math.floor(Math.random() * pool.length)];
      if (state.numbers && Math.random() < 0.15) {
        word = wordBanks.numbers[Math.floor(Math.random() * wordBanks.numbers.length)];
      }
      if (state.punctuation && Math.random() < 0.15) {
        const p = wordBanks.punct[Math.floor(Math.random() * wordBanks.punct.length)];
        word = word + p;
      }
      words.push(word);
    }
    return words;
  }

  // ─── RENDER WORDS ─────────────────────────────────────────────
  function renderWords() {
    const inner = document.getElementById('words-inner');
    if (!inner) return;
    inner.innerHTML = '';
    state.wordEls = [];
    state.letterEls = [];

    state.words.forEach((word, wi) => {
      const wordEl = document.createElement('div');
      wordEl.className = 'word';
      wordEl.dataset.index = wi.toString();

      const letters = [];
      for (let li = 0; li < word.length; li++) {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = word[li];
        span.dataset.wi = wi.toString();
        span.dataset.li = li.toString();
        wordEl.appendChild(span);
        letters.push(span);
      }
      state.letterEls.push(letters);
      state.wordEls.push(wordEl);
      inner.appendChild(wordEl);
    });

    updateCaret();
  }

  // ─── CARET ────────────────────────────────────────────────────
  function updateCaret() {
    const caret = document.getElementById('caret');
    if (!caret) return;
    const wordEl = state.wordEls[state.currentWordIdx];
    if (!wordEl) return;

    const letters = state.letterEls[state.currentWordIdx];
    const wordsInner = document.getElementById('words-inner');
    const wordsWrapper = document.getElementById('words-wrapper');
    if (!wordsInner || !wordsWrapper) return;

    const innerOffset = parseInt(wordsInner.style.top || '0');
    const wrapperRect = wordsWrapper.getBoundingClientRect();

    // Determine the letter the caret sits under
    let targetEl;
    if (state.currentLetterIdx < letters.length) {
      targetEl = letters[state.currentLetterIdx];
    } else if (letters.length > 0) {
      targetEl = letters[letters.length - 1];
    } else {
      targetEl = wordEl;
    }

    const refRect = targetEl.getBoundingClientRect();
    const left = refRect.left - wrapperRect.left;
    const top = refRect.bottom - wrapperRect.top - innerOffset + 1;

    caret.style.left = left + 'px';
    caret.style.top = (top - innerOffset) + 'px';
    caret.style.width = refRect.width + 'px';
  }

  // ─── SCROLL WORDS ─────────────────────────────────────────────
  function scrollWords() {
    if (!state.wordEls[state.currentWordIdx]) return;
    const wrapper = document.getElementById('words-wrapper');
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const wordRect = state.wordEls[state.currentWordIdx].getBoundingClientRect();
    const inner = document.getElementById('words-inner');
    if (!inner) return;
    const lineH = parseFloat(getComputedStyle(wrapper).lineHeight);

    const relTop = wordRect.top - wrapperRect.top;
    if (relTop > lineH * 1.5) {
      const current = parseInt(inner.style.top || '0');
      inner.style.top = (current - lineH) + 'px';
    }
  }

  // ─── INPUT HANDLER ────────────────────────────────────────────
  const input = document.getElementById('typing-input');

  function handleInput(e) {
    if (state.finished || !input) return;

    const val = input.value;

    if (!state.started && val.length > 0) {
      startTest();
    }

    // Space = next word
    if (val.endsWith(' ')) {
      const typed = val.trim();
      submitWord(typed);
      input.value = '';
      return;
    }

    state.typed = val;
    renderCurrentWord(val);
    updateCaret();
    scrollWords();

    // words mode: check if last word done by length
    if (state.mode === 'words' && state.currentWordIdx === state.words.length - 1) {
      const word = state.words[state.currentWordIdx];
      if (val === word) {
        submitWord(val);
        input.value = '';
        finishTest();
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Backspace' && input && input.value === '' && state.currentWordIdx > 0) {
      // go back to previous word
      state.currentWordIdx--;
      const prev = state.typedWords.pop();
      input.value = prev || '';
      state.typed = input.value;
      // reset letters
      state.letterEls[state.currentWordIdx].forEach(l => l.className = 'letter');
      // remove extra letters
      const wordEl = state.wordEls[state.currentWordIdx];
      wordEl.querySelectorAll('.letter.extra').forEach(l => l.remove());
      state.letterEls[state.currentWordIdx] = Array.from(wordEl.querySelectorAll('.letter'));
      wordEl.classList.remove('incorrect-word');
      state.currentLetterIdx = input.value.length;
      renderCurrentWord(input.value);
      updateCaret();
    }
  }

  if (input) {
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);
  }

  function renderCurrentWord(typed) {
    const word = state.words[state.currentWordIdx];
    const letters = state.letterEls[state.currentWordIdx];
    const wordEl = state.wordEls[state.currentWordIdx];

    // Reset extra letters
    wordEl.querySelectorAll('.extra').forEach(l => l.remove());

    for (let i = 0; i < word.length; i++) {
      if (i < typed.length) {
        letters[i].className = typed[i] === word[i] ? 'letter correct' : 'letter wrong';
      } else {
        letters[i].className = 'letter';
      }
    }

    // Extra letters
    if (typed.length > word.length) {
      const extras = typed.slice(word.length);
      // Re-read letters after possible previous extra cleanup
      const existingExtras = wordEl.querySelectorAll('.extra');
      existingExtras.forEach(l => l.remove());
      for (let i = 0; i < extras.length; i++) {
        const span = document.createElement('span');
        span.className = 'letter extra';
        span.textContent = extras[i];
        wordEl.appendChild(span);
      }
    }

    state.currentLetterIdx = typed.length;
    wordEl.classList.toggle('incorrect-word', typed.length > 0 && typed !== word.slice(0, typed.length));
  }

  function submitWord(typed) {
    const word = state.words[state.currentWordIdx];
    state.typedWords.push(typed);

    // Count chars
    const correct = [...typed].filter((c, i) => c === word[i]).length;
    state.correctChars += correct;
    state.totalChars += typed.length;

    // Mark word
    const letters = state.letterEls[state.currentWordIdx];
    for (let i = 0; i < word.length; i++) {
      if (i < typed.length) {
        letters[i].className = typed[i] === word[i] ? 'letter correct' : 'letter wrong';
      } else {
        letters[i].className = 'letter wrong';
      }
    }

    state.currentWordIdx++;
    state.currentLetterIdx = 0;
    state.typed = '';

    if (state.mode !== 'time' && state.currentWordIdx >= state.words.length) {
      finishTest();
      return;
    }

    updateCaret();
    scrollWords();
  }

  // ─── TIMER ────────────────────────────────────────────────────
  function startTest() {
    state.started = true;
    state.timeLeft = state.duration;
    const caret = document.getElementById('caret');
    if (caret) caret.classList.add('typing');

    if (state.mode === 'time') {
      state.timer = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();
        recordWPM();

        if (state.timeLeft <= 5) {
          const timerEl = document.getElementById('timer');
          if (timerEl) timerEl.classList.add('urgent');
        }
        if (state.timeLeft <= 0) {
          finishTest();
        }
      }, 1000);
    } else {
      // count up for words/quote
      state.startTime = Date.now();
    }
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    if (state.mode === 'time') {
      timerEl.textContent = state.timeLeft.toString();
    } else {
      const elapsed = Math.floor((Date.now() - (state.startTime || Date.now())) / 1000);
      timerEl.textContent = elapsed + 's';
    }
  }

  function recordWPM() {
    const elapsed = state.duration - state.timeLeft;
    if (elapsed <= 0) return;
    const wpm = Math.round((state.correctChars / 5) / (elapsed / 60));
    state.wpmHistory.push(Math.min(wpm, 250));
  }

  // ─── FINISH ───────────────────────────────────────────────────
  function finishTest() {
    if (state.finished) return;
    state.finished = true;
    if (state.timer) clearInterval(state.timer);
    if (input) input.blur();

    const elapsed = state.mode === 'time' ? state.duration : Math.max(1, (Date.now() - state.startTime) / 1000);

    const rawWPM = Math.round((state.totalChars / 5) / (elapsed / 60));
    const netWPM = Math.round((state.correctChars / 5) / (elapsed / 60));
    const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;

    const correctWords = state.typedWords.filter((w, i) => w === state.words[i]).length;
    const incorrectWords = state.typedWords.length - correctWords;

    const resWpm = document.getElementById('res-wpm');
    const resRaw = document.getElementById('res-raw');
    const resAcc = document.getElementById('res-acc');
    const resCorrect = document.getElementById('res-correct');
    const resIncorrect = document.getElementById('res-incorrect');
    const resTime = document.getElementById('res-time');
    const typingContainer = document.getElementById('typing-container');
    const restartBtn = document.getElementById('restart-btn');
    const timerEl = document.getElementById('timer');
    const resultsPanel = document.getElementById('results-panel');

    if (resWpm) resWpm.textContent = netWPM.toString();
    if (resRaw) resRaw.textContent = rawWPM.toString();
    if (resAcc) resAcc.textContent = accuracy + '%';
    if (resCorrect) resCorrect.textContent = correctWords.toString();
    if (resIncorrect) resIncorrect.textContent = incorrectWords.toString();
    if (resTime) resTime.textContent = Math.round(elapsed) + 's';

    // Chart
    renderChart();

    if (typingContainer) typingContainer.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'none';
    if (timerEl) timerEl.style.display = 'none';
    if (resultsPanel) resultsPanel.classList.add('show');
  }

  function renderChart() {
    const bars = document.getElementById('chart-bars');
    if (!bars) return;
    bars.innerHTML = '';
    const data = state.wpmHistory.length > 0 ? state.wpmHistory : [0];
    const max = Math.max(...data, 1);
    data.forEach(v => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = Math.max(4, (v / max) * 100) + '%';
      bar.title = v + ' wpm';
      bars.appendChild(bar);
    });
  }

  // ─── RESTART ──────────────────────────────────────────────────
  function restartTest() {
    if (state.timer) clearInterval(state.timer);
    state = {
      ...state,
      words: generateWords(80),
      wordEls: [],
      letterEls: [],
      currentWordIdx: 0,
      currentLetterIdx: 0,
      typed: '',
      typedWords: [],
      started: false,
      finished: false,
      timer: null,
      timeLeft: state.duration,
      totalTime: state.duration,
      wpmHistory: [],
      correctChars: 0,
      totalChars: 0,
    };

    const timerEl = document.getElementById('timer');
    const typingContainer = document.getElementById('typing-container');
    const restartBtn = document.getElementById('restart-btn');
    const resultsPanel = document.getElementById('results-panel');
    const wordsInner = document.getElementById('words-inner');
    const focusOverlay = document.getElementById('focus-overlay');
    const caret = document.getElementById('caret');

    if (timerEl) {
      timerEl.textContent = state.mode === 'time' ? state.duration.toString() : '0';
      timerEl.classList.remove('urgent');
      timerEl.style.display = '';
    }
    if (typingContainer) typingContainer.style.display = '';
    if (restartBtn) restartBtn.style.display = '';
    if (resultsPanel) resultsPanel.classList.remove('show');
    if (wordsInner) wordsInner.style.top = '0px';
    if (focusOverlay) focusOverlay.classList.remove('hidden');
    if (caret) caret.classList.remove('typing');
    if (input) input.value = '';

    renderWords();
  }

  function newTest() {
    restartTest();
  }

  // ─── OPTIONS ──────────────────────────────────────────────────
  function toggleOption(opt) {
    state[opt] = !state[opt];
    const btn = document.getElementById('tb-' + opt);
    if (btn) btn.classList.toggle('active', state[opt]);
    restartTest();
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('[id^="mode-"]').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('mode-' + mode);
    if (btn) btn.classList.add('active');

    // Duration buttons only relevant for time mode
    const durBtns = document.querySelectorAll('[id^="dur-"]');
    durBtns.forEach((b) => b.style.opacity = mode === 'time' ? '1' : '0.3');

    restartTest();
  }

  function setDuration(dur) {
    state.duration = dur;
    document.querySelectorAll('[id^="dur-"]').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('dur-' + dur);
    if (btn) btn.classList.add('active');
    restartTest();
  }

  // ─── FOCUS ────────────────────────────────────────────────────
  function focusInput() {
    if (input) input.focus();
    const overlay = document.getElementById('focus-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function handleInputFocus() {
    const overlay = document.getElementById('focus-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function handleInputBlur() {
    if (!state.finished) {
      const overlay = document.getElementById('focus-overlay');
      if (overlay) overlay.classList.remove('hidden');
    }
  }

  if (input) {
    input.addEventListener('focus', handleInputFocus);
    input.addEventListener('blur', handleInputBlur);
  }

  // Global keydown
  function handleDocumentKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      state.tabHeld = true;
    }
    if (state.tabHeld && e.key === 'Enter') {
      restartTest();
      focusInput();
    }
    if (!state.finished && !['Tab','Escape','F5'].includes(e.key)) {
      focusInput();
    }
  }

  function handleDocumentKeyUp(e) {
    if (e.key === 'Tab') state.tabHeld = false;
  }

  document.addEventListener('keydown', handleDocumentKeyDown);
  document.addEventListener('keyup', handleDocumentKeyUp);

  // Expose triggers to window
  window.toggleOption = toggleOption;
  window.setMode = setMode;
  window.setDuration = setDuration;
  window.focusInput = focusInput;
  window.restartTest = restartTest;
  window.newTest = newTest;

  // Cleanup handler
  window.cleanupTypingSpeed = function() {
    if (input) {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('focus', handleInputFocus);
      input.removeEventListener('blur', handleInputBlur);
    }
    document.removeEventListener('keydown', handleDocumentKeyDown);
    document.removeEventListener('keyup', handleDocumentKeyUp);
    if (state.timer) clearInterval(state.timer);

    delete window.toggleOption;
    delete window.setMode;
    delete window.setDuration;
    delete window.focusInput;
    delete window.restartTest;
    delete window.newTest;
    delete window.cleanupTypingSpeed;
  };

  // ─── INIT ─────────────────────────────────────────────────────
  restartTest();
})();
</script>
        `,
          }}
        />
      </div>
    </main>
  );
}
