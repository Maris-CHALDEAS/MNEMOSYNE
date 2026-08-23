class GameAudioEngine {
    constructor() {
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = null;
        this.audioBuffer = null;
        this.sourceNode = null;
        this.currentMusic = null;
    }

    async loadMusic(url) {
        if ( !url || (url === this.currentMusic && !this.isPaused)) return false;
        this.currentMusic = url;
        if (!this.ctx) this.ctx = new this.AudioContext();

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`BGM request failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        return true;
    }

    async playBackgroundMusic() {
        if (!this.ctx || !this.audioBuffer) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        this.stopSource();

        this.sourceNode = this.ctx.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.loop = true;
        this.sourceNode.loopStart = 0;
        this.sourceNode.loopEnd = this.audioBuffer.duration;
        this.sourceNode.connect(this.ctx.destination);
        this.sourceNode.start(0);
    }

    async pauseBackgroundMusic() {
        if (this.ctx?.state === 'running') await this.ctx.suspend();
    }

    async resumeBackgroundMusic() {
        if (this.ctx?.state === 'suspended') await this.ctx.resume();
    }

    get isPaused() {
        return this.ctx?.state === 'suspended';
    }

    stopSource() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode  = null;
        }
    }
    stop() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode  = null;
        }
        this.currentMusic = null
        this.audioBuffer = null
    }
}

export {GameAudioEngine};
export const gameAudio = new GameAudioEngine();
