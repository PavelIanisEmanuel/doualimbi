// ── helpers ──
function speak(text, rate) {
    rate = rate || 0.88;
    try {
        var synth = window.speechSynthesis;
        if (!synth) return;
        synth.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'ro-RO';
        u.rate = rate;
        var v = synth.getVoices().find(function(v) { return v.lang && v.lang.toLowerCase().startsWith('ro'); }) || null;
        if (v) u.voice = v;
        synth.speak(u);
    } catch(e) {}
}

function norm(s) {
    return (s || '').toLowerCase()
        .replace(/ă|â/g, 'a').replace(/î/g, 'i')
        .replace(/ș|ş/g, 's').replace(/ț|ţ/g, 't')
        .replace(/[.,!?;:'"'\-]/g, '').replace(/\s+/g, ' ').trim();
}

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, n); }

function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escJs(s) {
    return String(s || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

// ── course data ──
var UNITS = [
    {
        id: 'u1', title: 'Greetings', ro: 'Salutări', color: 'primary', icon: '<i class="bi bi-hand-wave-fill"></i>',
        tip: { title: 'Saying hello in Romanian', body: '«Bună» is the everyday hello. «Bună ziua» (good day) is the polite version you\'d use with strangers or elders. «Salut» is casual, like "hi". Romanians say «mulțumesc» for thank you — locals often shorten it to «mersi».' },
        vocab: [
            { ro: 'bună', en: 'hello' },
            { ro: 'bună ziua', en: 'good day' },
            { ro: 'salut', en: 'hi' },
            { ro: 'la revedere', en: 'goodbye' },
            { ro: 'mulțumesc', en: 'thank you', alt: ['thanks'] },
            { ro: 'te rog', en: 'please' },
            { ro: 'da', en: 'yes' },
            { ro: 'nu', en: 'no' },
            { ro: 'bine', en: 'well', alt: ['good', 'fine'] },
            { ro: 'noapte bună', en: 'good night' }
        ],
        sentences: [
            { ro: 'bună ziua doamnă', en: 'good day madam', bank: ['bună', 'ziua', 'doamnă', 'nu', 'apă'] },
            { ro: 'mulțumesc foarte mult', en: 'thank you very much', bank: ['mulțumesc', 'foarte', 'mult', 'da', 'pâine'] },
            { ro: 'da te rog', en: 'yes please', bank: ['da', 'te', 'rog', 'nu', 'bine'] }
        ]
    },
    {
        id: 'u2', title: 'Basics', ro: 'Bazele', color: 'success', icon: '<i class="bi bi-person-fill"></i>',
        tip: { title: 'I am, you are…', body: '«Eu sunt» means "I am", «tu ești» means "you are". Romanian usually drops the pronoun — «sunt bine» alone means "I\'m well". Verb endings tell you who is doing the action, just like in Italian or Spanish.' },
        vocab: [
            { ro: 'eu sunt', en: 'I am' },
            { ro: 'tu ești', en: 'you are' },
            { ro: 'băiat', en: 'boy' },
            { ro: 'fată', en: 'girl' },
            { ro: 'bărbat', en: 'man' },
            { ro: 'femeie', en: 'woman' },
            { ro: 'copil', en: 'child' },
            { ro: 'prieten', en: 'friend' },
            { ro: 'român', en: 'Romanian' },
            { ro: 'student', en: 'student' }
        ],
        sentences: [
            { ro: 'eu sunt student', en: 'I am a student', bank: ['eu', 'sunt', 'student', 'fată', 'nu'] },
            { ro: 'tu ești prieten', en: 'you are a friend', bank: ['tu', 'ești', 'prieten', 'copil', 'da'] },
            { ro: 'eu sunt român', en: 'I am Romanian', bank: ['eu', 'sunt', 'român', 'femeie', 'bine'] }
        ]
    },
    {
        id: 'u3', title: 'Food & Drink', ro: 'Mâncare', color: 'danger', icon: '<i class="bi bi-cup-hot-fill"></i>',
        tip: { title: 'Eating like a local', body: '«Mănânc» = I eat, «beau» = I drink. Romanian has no separate word for "some" here — «beau apă» literally "I drink water". Try «poftă bună!» before a meal: it\'s the Romanian "bon appétit", said at every table.' },
        vocab: [
            { ro: 'apă', en: 'water' },
            { ro: 'pâine', en: 'bread' },
            { ro: 'lapte', en: 'milk' },
            { ro: 'măr', en: 'apple' },
            { ro: 'brânză', en: 'cheese' },
            { ro: 'cafea', en: 'coffee' },
            { ro: 'vin', en: 'wine' },
            { ro: 'supă', en: 'soup' },
            { ro: 'eu mănânc', en: 'I eat' },
            { ro: 'eu beau', en: 'I drink' }
        ],
        sentences: [
            { ro: 'eu beau apă', en: 'I drink water', bank: ['eu', 'beau', 'apă', 'pâine', 'tu'] },
            { ro: 'eu mănânc pâine', en: 'I eat bread', bank: ['eu', 'mănânc', 'pâine', 'vin', 'ești'] },
            { ro: 'eu beau cafea cu lapte', en: 'I drink coffee with milk', bank: ['eu', 'beau', 'cafea', 'cu', 'lapte', 'măr'] }
        ]
    },
    {
        id: 'u4', title: 'Family', ro: 'Familia', color: 'warning', icon: '<i class="bi bi-people-fill"></i>',
        tip: { title: 'Family words', body: '«Mamă» and «tată» are mom and dad. Romanian shows possession with «mea/meu» (my): «mama mea» = my mother, «tatăl meu» = my father. Note how the ending changes with gender — feminine «mea», masculine «meu».' },
        vocab: [
            { ro: 'mamă', en: 'mother', alt: ['mom'] },
            { ro: 'tată', en: 'father', alt: ['dad'] },
            { ro: 'frate', en: 'brother' },
            { ro: 'soră', en: 'sister' },
            { ro: 'fiu', en: 'son' },
            { ro: 'fiică', en: 'daughter' },
            { ro: 'bunic', en: 'grandfather' },
            { ro: 'bunică', en: 'grandmother' },
            { ro: 'familie', en: 'family' },
            { ro: 'casă', en: 'house', alt: ['home'] }
        ],
        sentences: [
            { ro: 'mama mea este bună', en: 'my mother is good', bank: ['mama', 'mea', 'este', 'bună', 'frate'] },
            { ro: 'eu am un frate', en: 'I have a brother', bank: ['eu', 'am', 'un', 'frate', 'soră', 'casă'] },
            { ro: 'familia mea este mare', en: 'my family is big', bank: ['familia', 'mea', 'este', 'mare', 'fiu'] }
        ]
    },
    {
        id: 'u5', title: 'Phrases', ro: 'Expresii', color: 'info', icon: '<i class="bi bi-chat-dots-fill"></i>',
        tip: { title: 'Survival phrases', body: '«Ce mai faci?» (how are you?) is the universal opener — answer «bine, mulțumesc». «Nu înțeleg» (I don\'t understand) and «mai rar, vă rog» (slower, please) will rescue you in any conversation in Bucharest.' },
        vocab: [
            { ro: 'ce mai faci?', en: 'how are you?' },
            { ro: 'cum te cheamă?', en: 'what is your name?', alt: ['whats your name?'] },
            { ro: 'mă numesc Ana', en: 'my name is Ana' },
            { ro: 'nu înțeleg', en: 'I do not understand', alt: ["I don't understand"] },
            { ro: 'unde este?', en: 'where is it?', alt: ['where is'] },
            { ro: 'vorbiți engleză?', en: 'do you speak English?' },
            { ro: 'cât costă?', en: 'how much does it cost?', alt: ['how much is it?'] },
            { ro: 'îmi pare rău', en: 'I am sorry', alt: ["i'm sorry", 'sorry'] },
            { ro: 'cu plăcere', en: 'you are welcome', alt: ["you're welcome"] },
            { ro: 'noroc!', en: 'cheers!', alt: ['good luck!'] }
        ],
        sentences: [
            { ro: 'unde este gara?', en: 'where is the train station?', bank: ['unde', 'este', 'gara', 'cât', 'costă'] },
            { ro: 'nu înțeleg vorbiți engleză?', en: "I don't understand, do you speak English?", bank: ['nu', 'înțeleg', 'vorbiți', 'engleză', 'noroc'] },
            { ro: 'ce mai faci prietene?', en: 'how are you, friend?', bank: ['ce', 'mai', 'faci', 'prietene', 'unde'] }
        ]
    }
];

var LESSONS_PER_UNIT = 3;
var LESSON_NAMES = ['Discover', 'Practice', 'Master'];
var XP_PER_LESSON = 14;
var DAILY_GOAL = 30;
var MAX_HEARTS = 5;

var ACHIEVEMENTS = [
    { icon: '<i class="bi bi-award-fill text-warning"></i>', name: 'Primul pas', desc: 'Finish your first lesson', test: function(p) { return Object.keys(p.done).length >= 1; } },
    { icon: '<i class="bi bi-fire text-danger"></i>', name: 'Aprins', desc: 'Reach a 3-day streak', test: function(p) { return p.streak >= 3; } },
    { icon: '<i class="bi bi-star-fill text-warning"></i>', name: 'Stea', desc: 'Earn 50 XP', test: function(p) { return p.xp >= 50; } },
    { icon: '<i class="bi bi-gem text-info"></i>', name: 'Perfect', desc: 'Complete a lesson with no mistakes', test: function(p) { return p.perfects >= 1; } },
    { icon: '<i class="bi bi-cup-hot-fill text-secondary"></i>', name: 'Poftă bună', desc: 'Finish the Food unit', test: function(p) { return !!p.done['u3-2']; } },
    { icon: '<i class="bi bi-trophy-fill text-warning"></i>', name: 'Maestru', desc: 'Finish every lesson', test: function(p) { return Object.keys(p.done).length >= UNITS.length * LESSONS_PER_UNIT; } }
];

// ── current logged-in user ──
var currentUser = null;

// ── app state ──
var state = {
    screen: 'home',
    active: null,
    lastMistakes: 0,
    hearts: MAX_HEARTS,
    progress: {
        xp: 0, todayXp: 0, gems: 120, streak: 1, perfects: 0,
        done: {},
        weekXp: [0, 0, 0, 0, 0, 0, 0]
    },
    exercises: [],
    idx: 0,
    chosen: null,
    typed: '',
    built: [],
    feedback: null,
    mistakes: 0,
    combo: 0,
    matchLeft: [],
    matchRight: [],
    matchSelL: null,
    matchSelR: null,
    matchSolved: [],
    matchWrong: null
};

// ── lesson builder ──
function buildLesson(unit, lessonIdx) {
    var allRo = unit.vocab.map(function(v) { return v.ro; });
    var allEn = unit.vocab.map(function(v) { return v.en; });
    var vocab = pick(unit.vocab, 5);
    var ex = [];
    vocab.forEach(function(v, i) {
        var mode = (i + lessonIdx) % 4;
        if (mode === 0) {
            ex.push({ type: 'select', prompt: 'Which one means "' + v.en + '"?', ro: v.ro,
                options: shuffle([v.ro].concat(pick(allRo.filter(function(r) { return r !== v.ro; }), 3))),
                answer: v.ro, optionsAreRo: true });
        } else if (mode === 1) {
            ex.push({ type: 'select', prompt: 'What does «' + v.ro + '» mean?', ro: v.ro, speakPrompt: true,
                options: shuffle([v.en].concat(pick(allEn.filter(function(e) { return e !== v.en; }), 3))),
                answer: v.en, optionsAreRo: false });
        } else if (mode === 2) {
            ex.push({ type: 'listen', prompt: 'Tap what you hear', ro: v.ro,
                options: shuffle([v.ro].concat(pick(allRo.filter(function(r) { return r !== v.ro; }), 3))),
                answer: v.ro });
        } else {
            ex.push({ type: 'type', prompt: 'Write "' + v.ro + '" in English', ro: v.ro, speakPrompt: true,
                answers: [v.en].concat(v.alt || []) });
        }
    });
    var s = unit.sentences[lessonIdx % unit.sentences.length];
    ex.splice(2, 0, { type: 'build', prompt: 'Translate: "' + s.en + '"', ro: s.ro, bank: shuffle(s.bank), answer: s.ro });
    ex.push({ type: 'match', prompt: 'Match the pairs', pairs: pick(unit.vocab, 4).map(function(v) { return [v.ro, v.en]; }) });
    return ex;
}

// ── render: home ──
function renderHome() {
    var p = state.progress;
    var doneCount = Object.keys(p.done).length;
    var html = '<div class="pb-5">';
    UNITS.forEach(function(unit, ui) {
        var unitUnlocked = ui === 0 || !!p.done[UNITS[ui-1].id + '-' + (LESSONS_PER_UNIT-1)];
        html += '<div class="card mb-3' + (unitUnlocked ? '' : ' opacity-50') + '">';
        html += '<div class="card-header bg-' + unit.color + ' text-' + (unit.color === 'warning' ? 'dark' : 'white') + ' d-flex justify-content-between align-items-center">';
        html += '<div><strong>Unit ' + (ui+1) + ' · ' + escHtml(unit.title) + '</strong><br><small>' + escHtml(unit.ro) + '</small></div>';
        html += '<button class="btn btn-light btn-sm fw-bold" onclick="openTip(\'' + unit.id + '\')">' + unit.icon + ' Tips</button>';
        html += '</div><div class="card-body"><div class="d-flex justify-content-around flex-wrap gap-3">';
        for (var li = 0; li < LESSONS_PER_UNIT; li++) {
            var key = unit.id + '-' + li;
            var done = !!p.done[key];
            var prevKey = unit.id + '-' + (li-1);
            var unlocked = unitUnlocked && (li === 0 || !!p.done[prevKey]);
            var btnColor = done ? ('btn-' + unit.color) : (unlocked ? ('btn-outline-' + unit.color) : 'btn-secondary');
            html += '<div class="text-center">';
            html += '<button class="btn ' + btnColor + ' rounded-circle" style="width:64px;height:64px;font-size:1.4rem"';
            if (unlocked) html += ' onclick="startLesson(\'' + unit.id + '\',' + li + ')"';
            else html += ' disabled';
            html += '>' + (done ? '<i class="bi bi-check-lg"></i>' : unlocked ? unit.icon : '<i class="bi bi-lock-fill"></i>') + '</button>';
            html += '<div class="small fw-bold mt-1">' + LESSON_NAMES[li] + '</div></div>';
        }
        html += '</div></div></div>';
    });
    if (doneCount === UNITS.length * LESSONS_PER_UNIT) {
        html += '<div class="alert alert-warning fw-bold text-center"><i class="bi bi-trophy-fill"></i> Felicitări! You finished the whole course — replay any lesson to keep your streak alive.</div>';
    }
    html += '</div>';
    return html;
}

// ── render: profile ──
function renderProfile() {
    var p = state.progress;
    var goalPct = Math.min(100, (p.todayXp / DAILY_GOAL) * 100);
    var week = p.weekXp;
    var max = Math.max(DAILY_GOAL, Math.max.apply(null, week));
    var days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    var barsHtml = '';
    week.forEach(function(v, i) {
        var pct = Math.max(4, (v / max) * 100);
        barsHtml += '<div class="flex-fill text-center">'
            + '<div style="height:80px;display:flex;align-items:flex-end">'
            + '<div class="w-100 rounded ' + (i===6 ? 'bg-primary' : 'bg-primary bg-opacity-25') + '" style="height:' + pct + '%;transition:height .4s"></div>'
            + '</div>'
            + '<div class="small fw-bold mt-1 ' + (i===6 ? 'text-primary' : 'text-muted') + '">' + days[i] + '</div></div>';
    });

    var achievementsHtml = '';
    ACHIEVEMENTS.forEach(function(a) {
        var won = a.test(p);
        achievementsHtml += '<div class="col-6"><div class="card mb-2' + (won ? ' border-warning' : '') + '" style="' + (won ? 'background:#FFF8DC' : '') + '">'
            + '<div class="card-body p-2 text-dark">'
            + '<div style="font-size:1.5rem">' + a.icon + '</div>'
            + '<div class="fw-bold small text-dark">' + escHtml(a.name) + '</div>'
            + '<div class="text-muted small" style="font-size:.75rem">' + escHtml(a.desc) + '</div>'
            + '</div></div></div>';
    });

    return '<div class="pb-5">'
        + '<div class="card mb-3"><div class="card-body">'
        + '<h6 class="fw-bold">Daily goal</h6>'
        + '<div class="text-muted small mb-2">' + p.todayXp + ' / ' + DAILY_GOAL + ' XP today</div>'
        + '<div class="progress" style="height:16px"><div class="progress-bar ' + (goalPct>=100?'bg-success':'bg-warning') + '" style="width:' + goalPct + '%"></div></div>'
        + (goalPct >= 100 ? '<div class="text-success fw-bold mt-2">✓ Goal reached — bravo!</div>' : '')
        + '</div></div>'
        + '<div class="card mb-3"><div class="card-body">'
        + '<h6 class="fw-bold mb-3">This week</h6>'
        + '<div class="d-flex gap-1">' + barsHtml + '</div>'
        + '</div></div>'
        + '<div class="card"><div class="card-body">'
        + '<h6 class="fw-bold mb-3">Achievements</h6>'
        + '<div class="row">' + achievementsHtml + '</div>'
        + '</div></div></div>';
}

// ── render: match exercise ──
function renderMatch() {
    var ex = state.exercises[state.idx];
    var html = '<div class="row g-2"><div class="col-6 d-grid gap-2">';
    state.matchLeft.forEach(function(t) {
        var done = state.matchSolved.indexOf(t) !== -1;
        var sel = state.matchSelL === t;
        var wrong = state.matchWrong && state.matchWrong[0] === t;
        var cls = done ? 'btn btn-success' : wrong ? 'btn btn-danger' : sel ? 'btn btn-primary' : 'btn btn-outline-secondary';
        html += '<button class="' + cls + ' fw-bold" ' + (done ? 'disabled' : 'onclick="matchSelectL(\'' + escJs(t) + '\')"') + '>' + escHtml(t) + '</button>';
    });
    html += '</div><div class="col-6 d-grid gap-2">';
    state.matchRight.forEach(function(t) {
        var done = state.matchSolved.some(function(s) {
            var pair = ex.pairs.find(function(p) { return p[0] === s; });
            return pair && pair[1] === t;
        });
        var sel = state.matchSelR === t;
        var wrong = state.matchWrong && state.matchWrong[1] === t;
        var cls = done ? 'btn btn-success' : wrong ? 'btn btn-danger' : sel ? 'btn btn-primary' : 'btn btn-outline-secondary';
        html += '<button class="' + cls + ' fw-bold" ' + (done ? 'disabled' : 'onclick="matchSelectR(\'' + escJs(t) + '\')"') + '>' + escHtml(t) + '</button>';
    });
    html += '</div></div>';
    return html;
}

// ── render: lesson ──
function renderLesson() {
    if (state.hearts <= 0) {
        return '<div class="text-center py-5 px-3" style="max-width:480px;margin:0 auto">'
            + '<div style="font-size:4rem" class="mb-3 text-danger"><i class="bi bi-heartbreak-fill"></i></div>'
            + '<h2 class="fw-bold">Out of hearts!</h2>'
            + '<p class="text-muted fw-bold">Practice refills your hearts. Take a breath and try again — repetition is how Romanian sticks.</p>'
            + '<div class="d-grid gap-2 mt-4">'
            + '<button class="btn btn-primary fw-bold" onclick="retryLesson()"><i class="bi bi-heart-fill"></i> Practice again (refill hearts)</button>'
            + '<button class="btn btn-outline-secondary fw-bold" onclick="exitLesson()">Back to path</button>'
            + '</div></div>';
    }

    var ex = state.exercises[state.idx];
    var total = state.exercises.length;
    var progressPct = (state.idx / total) * 100;
    var feedback = state.feedback;
    var ready = false;
    if (ex.type === 'select' || ex.type === 'listen') ready = state.chosen !== null;
    else if (ex.type === 'type') ready = state.typed.trim().length > 0;
    else if (ex.type === 'build') ready = state.built.length > 0;

    var exerciseHtml = '';
    if (ex.type === 'select' || ex.type === 'listen') {
        exerciseHtml = '<div class="d-grid gap-2">';
        ex.options.forEach(function(opt) {
            var sel = state.chosen === opt;
            var cls = 'btn btn-outline-secondary text-start fw-bold';
            if (feedback) {
                if (opt === ex.answer) cls = 'btn btn-success text-start fw-bold';
                else if (sel) cls = 'btn btn-danger text-start fw-bold';
            } else if (sel) {
                cls = 'btn btn-primary text-start fw-bold';
            }
            exerciseHtml += '<button class="' + cls + '" onclick="chooseOption(\'' + escJs(opt) + '\')" ' + (feedback ? 'disabled' : '') + '>' + escHtml(opt) + '</button>';
        });
        exerciseHtml += '</div>';
    } else if (ex.type === 'type') {
        exerciseHtml = '<input type="text" id="typeInput" class="form-control form-control-lg fw-bold" '
            + 'placeholder="Type in English…" value="' + escHtml(state.typed) + '" '
            + (feedback ? 'disabled' : '')
            + ' oninput="setTyped(this.value)"'
            + ' onkeydown="if(event.key===\'Enter\'&&!state.feedback)checkAnswer()">';
    } else if (ex.type === 'build') {
        var builtHtml = state.built.length === 0
            ? '<span class="text-muted fw-bold">Tap the words below…</span>'
            : state.built.map(function(bi, i) {
                return '<button class="btn btn-outline-primary btn-sm fw-bold me-1 mb-1" '
                    + (feedback ? 'disabled' : 'onclick="removeBuilt(' + i + ')"') + '>'
                    + escHtml(ex.bank[bi]) + '</button>';
            }).join('');
        var bankHtml = ex.bank.map(function(w, i) {
            var consumed = state.built.indexOf(i) !== -1;
            return '<button class="btn btn-outline-secondary btn-sm fw-bold me-1 mb-1" '
                + ((consumed || !!feedback) ? 'disabled' : 'onclick="addBuilt(' + i + ')"')
                + (consumed ? ' style="opacity:.3"' : '') + '>'
                + escHtml(w) + '</button>';
        }).join('');
        exerciseHtml = '<div class="border-bottom border-2 p-2 mb-3 d-flex flex-wrap" style="min-height:52px">' + builtHtml + '</div>'
            + '<div class="d-flex flex-wrap">' + bankHtml + '</div>';
    } else if (ex.type === 'match') {
        exerciseHtml = renderMatch();
    }

    var footerBgClass = feedback === 'correct' ? 'bg-success bg-opacity-10 border-top border-success'
        : feedback === 'wrong'   ? 'bg-danger bg-opacity-10 border-top border-danger'
            : 'bg-body border-top';
    var footerHtml = '';
    if (ex.type !== 'match') {
        var footerContent = '';
        if (feedback === 'correct') {
            footerContent = '<div class="text-success fw-bold mb-2">✓ Excelent! &nbsp;«' + escHtml(ex.ro) + '»</div>';
        } else if (feedback === 'wrong') {
            var correctAns = ex.type === 'type' ? ex.answers[0] : ex.answer;
            footerContent = '<div class="text-danger fw-bold mb-2">Not quite. Correct answer: <u>' + escHtml(correctAns) + '</u></div>';
        }
        var btnClass = feedback === 'wrong' ? 'btn-danger' : 'btn-success';
        var btnLabel = feedback ? 'CONTINUE' : 'CHECK';
        var btnAction = feedback ? 'nextExercise()' : 'checkAnswer()';
        var btnDisabled = (!feedback && !ready) ? 'disabled' : '';
        footerContent += '<button id="footer-btn" class="btn ' + btnClass + ' w-100 fw-bold" ' + btnDisabled + ' onclick="' + btnAction + '">' + btnLabel + '</button>';
        footerHtml = '<div class="fixed-bottom p-3 ' + footerBgClass + '" style="z-index:20">'
            + '<div style="max-width:560px;margin:0 auto">' + footerContent + '</div></div>';
    }

    var comboHtml = (state.combo >= 3 && !feedback)
        ? '<div class="text-center fw-bold text-warning mb-2"><i class="bi bi-fire"></i> ' + state.combo + ' in a row!</div>' : '';

    return '<div style="max-width:560px;margin:0 auto;padding-bottom:160px">'
        + '<div class="d-flex align-items-center gap-2 mb-3">'
        + '<button class="btn btn-link text-muted fw-bold p-0 text-decoration-none" onclick="exitLesson()">✕</button>'
        + '<div class="progress flex-fill" style="height:14px"><div class="progress-bar bg-success" style="width:' + progressPct + '%;transition:width .35s"></div></div>'
        + '<span class="fw-bold text-danger"><i class="bi bi-heart-fill"></i> ' + state.hearts + '</span>'
        + '</div>'
        + comboHtml
        + '<h5 class="fw-bold mb-3 d-flex align-items-center gap-2">'
        + (ex.type === 'listen' ? '<button class="btn btn-primary rounded-3" onclick="speak(\'' + escJs(ex.ro) + '\')"><i class="bi bi-volume-up-fill"></i></button>' : '')
        + '<span>' + escHtml(ex.prompt) + '</span>'
        + (ex.speakPrompt ? '<button class="btn btn-primary btn-sm rounded-3" onclick="speak(\'' + escJs(ex.ro) + '\')"><i class="bi bi-volume-up-fill"></i></button>' : '')
        + '</h5>'
        + exerciseHtml
        + footerHtml
        + '</div>';
}

// ── render: complete ──
function renderComplete() {
    var unit = state.active.unit;
    var total = 7;
    var acc = Math.round(((total - Math.min(state.lastMistakes, total)) / total) * 100);
    var perfect = state.lastMistakes === 0;
    return '<div style="max-width:480px;margin:0 auto;padding:40px 20px;text-align:center">'
        + '<div style="font-size:4rem" class="mb-2 anim-pop">' + (perfect ? '<i class="bi bi-trophy-fill text-warning"></i>' : '<i class="bi bi-stars text-primary"></i>') + '</div>'
        + '<h2 class="fw-bold">' + (perfect ? 'Perfect! Fără greșeli!' : 'Lecție completă!') + '</h2>'
        + '<p class="text-muted fw-bold">' + escHtml(unit.title) + ' · ' + escHtml(unit.ro) + '</p>'
        + '<div class="d-flex gap-3 justify-content-center my-4">'
        + '<div class="card px-4 py-3 border-warning" style="background:#fffacd"><div class="small fw-bold text-warning-emphasis">XP EARNED</div><div class="fw-bold fs-3">+' + XP_PER_LESSON + '</div></div>'
        + '<div class="card px-4 py-3 border-success text-success"><div class="small fw-bold">ACCURACY</div><div class="fw-bold fs-3">' + acc + '%</div></div>'
        + '</div>'
        + '<button class="btn btn-primary w-100 fw-bold" onclick="navigate(\'home\')">CONTINUE</button>'
        + '</div>';
}

// ── actions ──
function navigate(screen) {
    state.screen = screen;
    render();
}

function startLesson(unitId, lessonIdx) {
    var unit = UNITS.find(function(u) { return u.id === unitId; });
    state.active = { unit: unit, lessonIdx: lessonIdx };
    state.hearts = MAX_HEARTS;
    state.exercises = buildLesson(unit, lessonIdx);
    state.idx = 0;
    state.chosen = null;
    state.typed = '';
    state.built = [];
    state.feedback = null;
    state.mistakes = 0;
    state.combo = 0;
    state.matchLeft = [];
    state.matchRight = [];
    state.matchSelL = null;
    state.matchSelR = null;
    state.matchSolved = [];
    state.matchWrong = null;
    state.screen = 'lesson';
    render();
    var first = state.exercises[0];
    if (first && first.type === 'listen') setTimeout(function() { speak(first.ro); }, 350);
}

function chooseOption(opt) {
    if (state.feedback) return;
    state.chosen = opt;
    var ex = state.exercises[state.idx];
    if (ex.type === 'listen' || ex.optionsAreRo) speak(opt);
    render();
}

function setTyped(val) {
    state.typed = val;
    var btn = document.getElementById('footer-btn');
    if (btn) btn.disabled = val.trim().length === 0;
}

function addBuilt(i) {
    if (state.feedback) return;
    speak(state.exercises[state.idx].bank[i]);
    state.built = state.built.concat([i]);
    render();
}

function removeBuilt(i) {
    if (state.feedback) return;
    state.built = state.built.filter(function(_, j) { return j !== i; });
    render();
}

function checkAnswer() {
    var ex = state.exercises[state.idx];
    if (state.feedback) return;
    var ok = false;
    if (ex.type === 'select' || ex.type === 'listen') ok = state.chosen === ex.answer;
    if (ex.type === 'type') ok = ex.answers.some(function(a) { return norm(a) === norm(state.typed); });
    if (ex.type === 'build') ok = norm(state.built.map(function(bi) { return ex.bank[bi]; }).join(' ')) === norm(ex.answer);
    if (ok) {
        state.feedback = 'correct';
        state.combo++;
        speak(ex.ro, 0.95);
    } else {
        state.feedback = 'wrong';
        state.combo = 0;
        state.mistakes++;
        state.hearts--;
    }
    render();
}

function nextExercise() {
    if (state.idx + 1 >= state.exercises.length) {
        completeLesson(state.mistakes);
        return;
    }
    state.idx++;
    state.chosen = null;
    state.typed = '';
    state.built = [];
    state.feedback = null;
    var ex = state.exercises[state.idx];
    if (ex.type === 'match') {
        state.matchLeft = shuffle(ex.pairs.map(function(p) { return p[0]; }));
        state.matchRight = shuffle(ex.pairs.map(function(p) { return p[1]; }));
        state.matchSelL = null;
        state.matchSelR = null;
        state.matchSolved = [];
        state.matchWrong = null;
    }
    render();
    if (ex.type === 'listen') setTimeout(function() { speak(ex.ro); }, 350);
    if (ex.type === 'type') setTimeout(function() { var inp = document.getElementById('typeInput'); if (inp) inp.focus(); }, 100);
}

function matchSelectL(t) {
    if (state.matchSolved.indexOf(t) !== -1) return;
    state.matchSelL = t;
    speak(t);
    if (state.matchSelR !== null) { tryMatchPair(); } else { render(); }
}

function matchSelectR(t) {
    var ex = state.exercises[state.idx];
    var done = state.matchSolved.some(function(s) {
        var pair = ex.pairs.find(function(p) { return p[0] === s; });
        return pair && pair[1] === t;
    });
    if (done) return;
    state.matchSelR = t;
    if (state.matchSelL !== null) { tryMatchPair(); } else { render(); }
}

function tryMatchPair() {
    var ex = state.exercises[state.idx];
    var ok = ex.pairs.some(function(p) { return p[0] === state.matchSelL && p[1] === state.matchSelR; });
    if (ok) {
        state.matchSolved = state.matchSolved.concat([state.matchSelL]);
        var isDone = state.matchSolved.length === ex.pairs.length;
        state.matchSelL = null;
        state.matchSelR = null;
        render();
        if (isDone) setTimeout(function() { nextExercise(); }, 350);
    } else {
        state.matchWrong = [state.matchSelL, state.matchSelR];
        render();
        setTimeout(function() {
            state.matchWrong = null;
            state.matchSelL = null;
            state.matchSelR = null;
            render();
        }, 500);
    }
}

function completeLesson(mistakes) {
    state.lastMistakes = mistakes;
    var key = state.active.unit.id + '-' + state.active.lessonIdx;
    var week = state.progress.weekXp.slice();
    week[6] += XP_PER_LESSON;
    state.progress = {
        xp: state.progress.xp + XP_PER_LESSON,
        todayXp: state.progress.todayXp + XP_PER_LESSON,
        gems: state.progress.gems + (mistakes === 0 ? 15 : 5),
        streak: state.progress.streak,
        perfects: state.progress.perfects + (mistakes === 0 ? 1 : 0),
        done: Object.assign({}, state.progress.done, { [key]: true }),
        weekXp: week
    };
    saveProgress();
    state.screen = 'complete';
    render();
}

function exitLesson() {
    state.hearts = MAX_HEARTS;
    state.screen = 'home';
    render();
}

function retryLesson() {
    state.hearts = MAX_HEARTS;
    startLesson(state.active.unit.id, state.active.lessonIdx);
}

function openTip(unitId) {
    var unit = UNITS.find(function(u) { return u.id === unitId; });
    var vocabHtml = unit.vocab.slice(0, 5).map(function(v) {
        return '<button class="btn btn-outline-secondary btn-sm fw-bold me-1 mb-1" onclick="speak(\'' + escJs(v.ro) + '\')">'
            + '<i class="bi bi-volume-up-fill"></i> ' + escHtml(v.ro) + ' <span class="text-muted fw-normal">· ' + escHtml(v.en) + '</span></button>';
    }).join('');
    document.getElementById('tipModalContent').innerHTML =
        '<div class="modal-header border-0 pb-0">'
        + '<h5 class="modal-title fw-bold">' + unit.icon + ' ' + escHtml(unit.tip.title) + '</h5>'
        + '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>'
        + '</div>'
        + '<div class="modal-body">'
        + '<p class="text-muted fw-bold lh-base">' + escHtml(unit.tip.body) + '</p>'
        + '<div class="mb-2">' + vocabHtml + '</div>'
        + '</div>'
        + '<div class="modal-footer border-0 pt-0">'
        + '<button class="btn btn-primary w-100 fw-bold" data-bs-dismiss="modal">Got it</button>'
        + '</div>';
    new bootstrap.Modal(document.getElementById('tipModal')).show();
}

function saveProgress() {
    if (!currentUser) return;
    fetch('http://localhost:3000/users/' + currentUser.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: state.progress })
    }).catch(function() {});
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function updateNavStats() {
    var p = state.progress;
    document.getElementById('nav-streak').innerHTML = '<i class="bi bi-fire text-danger"></i> ' + p.streak;
    document.getElementById('nav-gems').innerHTML = '<i class="bi bi-gem text-info"></i> ' + p.gems;
    document.getElementById('nav-xp').innerHTML = '<i class="bi bi-lightning-charge-fill text-warning"></i> ' + p.xp + ' XP';
    document.querySelectorAll('.nav-link[data-screen]').forEach(function(el) {
        el.classList.toggle('active', el.dataset.screen === state.screen);
    });
    var authLink = document.getElementById('nav-auth-link');
    if (authLink) {
        if (currentUser) {
            authLink.textContent = 'Logout (' + currentUser.username + ')';
            authLink.href = '#';
            authLink.onclick = function() { logout(); return false; };
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
}

function render() {
    var app = document.getElementById('app');
    if (state.screen === 'home') app.innerHTML = renderHome();
    else if (state.screen === 'profile') app.innerHTML = renderProfile();
    else if (state.screen === 'lesson') app.innerHTML = renderLesson();
    else if (state.screen === 'complete') app.innerHTML = renderComplete();
    updateNavStats();
}

// warm up speech voices
try { window.speechSynthesis && window.speechSynthesis.getVoices(); } catch(e) {}

(async function() {
    var stored = localStorage.getItem('currentUser');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            var res = await fetch('http://localhost:3000/users/' + currentUser.id);
            var userData = await res.json();
            if (userData && userData.progress) {
                state.progress = userData.progress;
            }
        } catch(e) {
            currentUser = null;
            localStorage.removeItem('currentUser');
        }
    }
    render();
})();