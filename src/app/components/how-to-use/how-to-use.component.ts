import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-how-to-use',
  imports: [
    TranslateModule
  ],
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.css']
})
export class HowToUseComponent {
private readonly AUDIO_PATH = 'assets/audio/Free_Test_Data_500KB_MP3.mp3';  
  audio = new Audio();
  isPlaying = false;
  isTalking = false;
  isMouthOpen = false;
  private animationInterval: any;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;

  constructor(private translate: TranslateService) {}

  async playAudio() { 
    if (this.isPlaying) {
      this.stopAudio();
      return;
    }

    try {
      // Initialize audio context if not exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }

      // Reset audio element
      this.audio.src = this.AUDIO_PATH; 
      this.audio.crossOrigin = 'anonymous';
      
      // Clean up previous connections if any
      if (this.audioSource) {
        this.audioSource.disconnect();
      }

      // Create new source and connect
      this.audioSource = this.audioContext.createMediaElementSource(this.audio);
      this.audioSource.connect(this.analyser!);
      this.analyser!.connect(this.audioContext.destination);

      this.isPlaying = true;
      this.isTalking = true;
      this.startMouthAnimation();

      // Load and play
      await this.audio.load();
      await this.audio.play();

      this.audio.onended = () => {
        this.stopAudio();
      };

    } catch (error) {
      console.error('Error playing audio:', error);
      this.stopAudio();
      // Handle CORS error specifically
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.error('CORS issue detected. Please configure your server or use a proxy.');
      }
    }
  }

  private startMouthAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.analyser && this.dataArray) {
        this.analyser.getByteFrequencyData(this.dataArray);
        const volume = this.getAverageVolume();
        this.isMouthOpen = volume > 50;
      }
    }, 50);
  }

  private getAverageVolume(): number {
    if (!this.dataArray) return 0;
    
    let values = 0;
    const length = this.dataArray.length;
    for (let i = 0; i < length; i++) {
      values += this.dataArray[i];
    }
    return values / length;
  }

  private stopAudio() {
    clearInterval(this.animationInterval);
    this.isPlaying = false;
    this.isTalking = false;
    this.isMouthOpen = false;
    this.audio.pause();
    this.audio.currentTime = 0;
    
    // Clean up audio connections
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
  }
}