class GameAudioEngine {
    constructor() {
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = null;
        this.audioBuffer = null;
        this.sourceNode = null;
    }

    async loadMusic(url) {
        if (!this.ctx) this.ctx = new this.AudioContext();

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    }

    async playBackgroundMusic() {
        if (!this.ctx || !this.audioBuffer) return;
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        this.stop();

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

    stop() {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.sourceNode  = null;
        }
    }
}

export {GameAudioEngine};
