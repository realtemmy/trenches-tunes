class SongNode {
  title: string;
  artist: string;
  duration: number;
  next: SongNode | null;
  prev: SongNode | null;

  constructor(title: string, artist: string, duration: number) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.next = null;
    this.prev = null;
  }
}

type track = {
  title: string;
  artist: string;
  duration: number;
};

class MusicPlayer2 {
  head: SongNode | null;
  currentTrack: SongNode | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  tracks: { title: string; artist: string; duration: number }[];

  constructor() {
    this.head = null;
    this.currentTrack = this.head;
    this.isPlaying = false;
    this.currentTime = 0;
    this.volume = 70;

    this.tracks = [
      { title: "Ocean Breeze", artist: "Midnight Waves", duration: 225 },
      { title: "Sunset Dreams", artist: "Aurora Sounds", duration: 252 },
      { title: "City Lights", artist: "Urban Echo", duration: 208 },
      { title: "Starlit Path", artist: "Cosmic Journey", duration: 303 },
    ];

    this.toNode();
  }

  addSong(track: { title: string; artist: string; duration: number }) {
    const newSong = new SongNode(track.title, track.artist, track.duration);
    if (!this.head) {
      this.head = newSong;
      this.currentTrack = this.head;
    } else {
      let currentNode = this.head;
      while (currentNode.next) {
        currentNode = currentNode.next;
      }
      currentNode.next = newSong;
    }
  }
  toNode() {
    for (let i = 0; i < this.tracks.length; i++) {
      this.addSong(this.tracks[i]);
    }
  }

  previousTrack() {
    if (this.currentTrack && this.currentTrack.prev) this.currentTrack.prev;
  }
  nextTrack() {
    if (this.currentTrack && this.currentTrack.next) this.currentTrack.next;
  }
  
}

const musicPlayer = new MusicPlayer2();

console.log(musicPlayer);
