// ===== CELEBRATION AUDIO =====

let celebrationAudio = null;
let celebrationAudioObjectUrl = null;

function getAudioConfig() {
    const audioConfig = config.audio || {};

    return {
        url: audioConfig.url || '',
        file: audioConfig.file || '',
        type: audioConfig.type || '',
        volume: typeof audioConfig.volume === 'number' ? audioConfig.volume : 1,
        loop: Boolean(audioConfig.loop)
    };
}

function createCelebrationAudio() {
    if (celebrationAudio) return celebrationAudio;

    celebrationAudio = document.createElement('audio');
    celebrationAudio.id = 'celebrationAudio';
    celebrationAudio.preload = 'auto';
    celebrationAudio.controls = false;
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

function addAudioSource(src, type = '') {
    if (!src) return;

    const audio = createCelebrationAudio();
    const source = document.createElement('source');
    source.src = src;
    if (type) source.type = type;
    audio.appendChild(source);
}

function initializeCelebrationAudio() {
    const audio = createCelebrationAudio();
    const audioConfig = getAudioConfig();

    clearCelebrationAudioSources();

    if (audioConfig.url) {
        addAudioSource(audioConfig.url, audioConfig.type);
    }

    if (audioConfig.file) {
        addAudioSource(audioConfig.file, audioConfig.type);
    }

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

function setCelebrationAudioUrl(url, mimeType = '') {
    if (!config.audio) config.audio = {};

    config.audio.url = url;
    config.audio.file = '';
    config.audio.type = mimeType;

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
    config.audio.url = '';
    config.audio.file = celebrationAudioObjectUrl;
    config.audio.type = file.type || '';

    initializeCelebrationAudio();
}

function setCelebrationAudioSources(sources = []) {
    const audio = createCelebrationAudio();
    clearCelebrationAudioSources();

    sources.forEach(sourceData => {
        if (typeof sourceData === 'string') {
            addAudioSource(sourceData);
            return;
        }

        if (sourceData && sourceData.src) {
            addAudioSource(sourceData.src, sourceData.type || '');
        }
    });

    audio.load();
}

window.playCelebrationAudio = playCelebrationAudio;
window.pauseCelebrationAudio = pauseCelebrationAudio;
window.stopCelebrationAudio = stopCelebrationAudio;
window.setCelebrationAudioUrl = setCelebrationAudioUrl;
window.setCelebrationAudioFile = setCelebrationAudioFile;
window.setCelebrationAudioSources = setCelebrationAudioSources;

// Browser-friendly audio formats can be configured independently.
// Examples: audio/mpeg (MP3), audio/wav (WAV), audio/ogg (OGG),
// audio/mp4 (M4A/MP4 where supported), audio/aac (AAC where supported).
document.addEventListener('DOMContentLoaded', initializeCelebrationAudio);
