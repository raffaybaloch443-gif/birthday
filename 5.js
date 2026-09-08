// ===== CELEBRATION AUDIO MODULE =====
// Supports local files, direct URLs and multiple browser audio formats.

let celebrationAudio = null;
let celebrationAudioObjectUrl = null;

function getDefaultAudioConfig() {
    return {
        // Put your local audio files inside an /audio folder and use these paths.
        // You can keep one source or add multiple fallback formats.
        sources: [
            { src: 'audio/celebration.mp3', type: 'audio/mpeg' },
            { src: 'audio/celebration.wav', type: 'audio/wav' },
            { src: 'audio/celebration.ogg', type: 'audio/ogg' },
            { src: 'audio/celebration.m4a', type: 'audio/mp4' },
            { src: 'audio/celebration.aac', type: 'audio/aac' }
        ],
        volume: 1,
        loop: false
    };
}

function getAudioConfig() {
    if (!config.audio) {
        config.audio = getDefaultAudioConfig();
    }

    return {
        sources: Array.isArray(config.audio.sources) ? config.audio.sources : [],
        volume: typeof config.audio.volume === 'number' ? config.audio.volume : 1,
        loop: Boolean(config.audio.loop)
    };
}

function createCelebrationAudio() {
    if (celebrationAudio) return celebrationAudio;

    celebrationAudio = document.createElement('audio');
    celebrationAudio.id = 'celebrationAudio';
    celebrationAudio.preload = 'auto';
    celebrationAudio.controls = false;
    celebrationAudio.setAttribute('aria-hidden', 'true');
    document.body.appendChild(celebrationAudio);

    return celebrationAudio;
}

function clearCelebrationAudioSources() {
    const audio = createCelebrationAudio();
    audio.pause();
    audio.removeAttribute('src');

    while (audio.firstChild) {
        audio.removeChild(audio.firstChild);
    }
}

function addAudioSource(src, mimeType = '') {
    if (!src) return;

    const audio = createCelebrationAudio();
    const source = document.createElement('source');
    source.src = src;
    if (mimeType) source.type = mimeType;
    audio.appendChild(source);
}

function initializeCelebrationAudio() {
    const audio = createCelebrationAudio();
    const audioConfig = getAudioConfig();

    clearCelebrationAudioSources();

    audioConfig.sources.forEach(source => {
        if (typeof source === 'string') {
            addAudioSource(source);
            return;
        }

        if (source && source.src) {
            addAudioSource(source.src, source.type || '');
        }
    });

    audio.volume = Math.min(1, Math.max(0, audioConfig.volume));
    audio.loop = audioConfig.loop;
    audio.load();
}

async function playCelebrationAudio() {
    if (!celebrationAudio) initializeCelebrationAudio();
    if (!celebrationAudio) return;

    try {
        celebrationAudio.currentTime = 0;
        await celebrationAudio.play();
    } catch (error) {
        console.warn('Celebration audio could not be played:', error);
    }
}

function pauseCelebrationAudio() {
    if (celebrationAudio) celebrationAudio.pause();
}

function stopCelebrationAudio() {
    if (!celebrationAudio) return;

    celebrationAudio.pause();
    celebrationAudio.currentTime = 0;
}

function setCelebrationAudioUrl(url, mimeType = 'audio/mpeg') {
    if (!config.audio) config.audio = {};

    config.audio.sources = url ? [{ src: url, type: mimeType }] : [];
    initializeCelebrationAudio();
}

function setCelebrationAudioFile(file) {
    if (!(file instanceof File)) {
        console.warn('setCelebrationAudioFile expects a File object.');
        return;
    }

    if (celebrationAudioObjectUrl) {
        URL.revokeObjectURL(celebrationAudioObjectUrl);
    }

    celebrationAudioObjectUrl = URL.createObjectURL(file);

    if (!config.audio) config.audio = {};
    config.audio.sources = [{
        src: celebrationAudioObjectUrl,
        type: file.type || ''
    }];

    initializeCelebrationAudio();
}

function setCelebrationAudioSources(sources = []) {
    if (!config.audio) config.audio = {};

    config.audio.sources = sources.map(source => {
        if (typeof source === 'string') return { src: source, type: '' };
        return {
            src: source?.src || '',
            type: source?.type || ''
        };
    }).filter(source => source.src);

    initializeCelebrationAudio();
}

function setCelebrationAudioVolume(volume) {
    const safeVolume = Math.min(1, Math.max(0, Number(volume) || 0));

    if (!config.audio) config.audio = {};
    config.audio.volume = safeVolume;

    const audio = createCelebrationAudio();
    audio.volume = safeVolume;
}

function setCelebrationAudioLoop(loop) {
    if (!config.audio) config.audio = {};
    config.audio.loop = Boolean(loop);

    const audio = createCelebrationAudio();
    audio.loop = config.audio.loop;
}

function clearCelebrationAudio() {
    clearCelebrationAudioSources();

    if (celebrationAudioObjectUrl) {
        URL.revokeObjectURL(celebrationAudioObjectUrl);
        celebrationAudioObjectUrl = null;
    }
}

window.playCelebrationAudio = playCelebrationAudio;
window.pauseCelebrationAudio = pauseCelebrationAudio;
window.stopCelebrationAudio = stopCelebrationAudio;
window.setCelebrationAudioUrl = setCelebrationAudioUrl;
window.setCelebrationAudioFile = setCelebrationAudioFile;
window.setCelebrationAudioSources = setCelebrationAudioSources;
window.setCelebrationAudioVolume = setCelebrationAudioVolume;
window.setCelebrationAudioLoop = setCelebrationAudioLoop;
window.clearCelebrationAudio = clearCelebrationAudio;
