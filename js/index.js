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
        id: 'u1', title: 'Greetings', ro: 'Salutări', color: 'primary', icon: '👋',
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
        id: 'u2', title: 'Basics', ro: 'Bazele', color: 'success', icon: '🙋',
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
        id: 'u3', title: 'Food & Drink', ro: 'Mâncare', color: 'danger', icon: '🍽️',
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
        id: 'u4', title: 'Family', ro: 'Familia', color: 'warning', icon: '👨‍👩‍👧',
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
        id: 'u5', title: 'Phrases', ro: 'Expresii', color: 'info', icon: '💬',
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
    { icon: '🥇', name: 'Primul pas', desc: 'Finish your first lesson', test: function(p) { return Object.keys(p.done).length >= 1; } },
    { icon: '🔥', name: 'Aprins', desc: 'Reach a 3-day streak', test: function(p) { return p.streak >= 3; } },
    { icon: '⭐', name: 'Stea', desc: 'Earn 50 XP', test: function(p) { return p.xp >= 50; } },
    { icon: '💎', name: 'Perfect', desc: 'Complete a lesson with no mistakes', test: function(p) { return p.perfects >= 1; } },
    { icon: '🍽️', name: 'Poftă bună', desc: 'Finish the Food unit', test: function(p) { return !!p.done['u3-2']; } },
    { icon: '🏆', name: 'Maestru', desc: 'Finish every lesson', test: function(p) { return Object.keys(p.done).length >= UNITS.length * LESSONS_PER_UNIT; } }
];

// ── app state ──
var state = {
    screen: 'home',
    active: null,
    lastMistakes: 0,
    hearts: MAX_HEARTS,
    progress: {
        xp: 0, todayXp: 0, gems: 120, streak: 1, perfects: 0,
        done: {},
        weekXp: [22, 35, 0, 41, 18, 30, 0]
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
            html += '>' + (done ? '✓' : unlocked ? unit.icon : '🔒') + '</button>';
            html += '<div class="small fw-bold mt-1">' + LESSON_NAMES[li] + '</div></div>';
        }
        html += '</div></div></div>';
    });
    if (doneCount === UNITS.length * LESSONS_PER_UNIT) {
        html += '<div class="alert alert-warning fw-bold text-center">🏆 Felicitări! You finished the whole course — replay any lesson to keep your streak alive.</div>';
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
            + '<div class="card-body p-2">'
            + '<div style="font-size:1.5rem">' + a.icon + '</div>'
            + '<div class="fw-bold small">' + escHtml(a.name) + '</div>'
            + '<div class="text-muted" style="font-size:.75rem">' + escHtml(a.desc) + '</div>'
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
}//305