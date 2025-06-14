class SongNode {
  constructor(title, artist, duration) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.next = null;
    this.prev = null;
  }
}

class MusicPlayer {
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
    this.initElements();
    this.bindEvents();
    this.updateTrackInfo();
    this.startProgressSimulation();
    this.updatePlaylist();
  }

  addSong(track) {
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
      newSong.prev = currentNode;
    }
  }
  toNode() {
    for (let i = 0; i < this.tracks.length; i++) {
      this.addSong(this.tracks[i]);
    }
  }

  initElements() {
    this.player = document.getElementById("musicPlayer");
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.progressBar = document.getElementById("progressBar");
    this.progress = document.getElementById("progress");
    this.currentTimeEl = document.getElementById("currentTime");
    this.totalTimeEl = document.getElementById("totalTime");
    this.trackTitle = document.getElementById("trackTitle");
    this.trackArtist = document.getElementById("trackArtist");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.equalizer = document.getElementById("equalizer");
    this.playlist = document.querySelector(".playlist");
    this.playlistItems = document.querySelectorAll(".playlist-item");
  }

  bindEvents() {
    this.playPauseBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.previousTrack());
    this.nextBtn.addEventListener("click", () => this.nextTrack());
    this.progressBar.addEventListener("click", (e) => this.setProgress(e));
    this.volumeSlider.addEventListener("input", (e) =>
      this.setVolume(e.target.value)
    );

    this.playlistItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.currentTrack = parseInt(item.dataset.track);
        this.updateTrackInfo();
        this.updatePlaylist();
        this.currentTime = 0;
        if (this.isPlaying) {
          this.updateProgress();
        }
      });
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.playPauseBtn.textContent = this.isPlaying ? "⏸" : "▶";

    if (this.isPlaying) {
      this.player.classList.remove("paused");
    } else {
      this.player.classList.add("paused");
    }
  }

  getNodeAtIndex(index) {
    let currentNode = this.head,
      currentIndex = 0;
    while (currentIndex < index && currentNode.next) {
      currentNode = currentNode.next;
      currentIndex++;
    }
    return currentNode;
  }

  previousTrack() {
    if (this.currentTrack && this.currentTrack.prev)
      this.currentTrack = this.currentTrack.prev;

    this.updateTrackInfo();
    this.updatePlaylist();
  }
  nextTrack() {
    if (this.currentTrack && this.currentTrack.next)
      this.currentTrack = this.currentTrack.next;

    this.updateTrackInfo();
    this.updatePlaylist();
  }

  setProgress(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.currentTime = percent * this.currentTrack.duration;
    this.updateProgress();
  }

  setVolume(volume) {
    this.volume = volume;
    const volumeIcon = document.querySelector(".volume-icon");
    if (volume == 0) {
      volumeIcon.textContent = "🔇";
    } else if (volume < 50) {
      volumeIcon.textContent = "🔉";
    } else {
      volumeIcon.textContent = "🔊";
    }
  }

  updateTrackInfo() {
    const track = this.currentTrack;
    this.trackTitle.textContent = track.title;
    this.trackArtist.textContent = track.artist;
    this.totalTimeEl.textContent = this.formatTime(track.duration);
  }

  updatePlaylist() {
    this.playlist.innerHTML = "";

    let index = 0,
      currentNode = this.head;
    while (currentNode) {
      const item = document.createElement("div");
      item.classList.add("playlist-item");
      if (currentNode === this.currentTrack) item.classList.add("active");
      item.dataset.track = index;

      const trackNumber = document.createElement("div");
      trackNumber.className = "track-number";
      trackNumber.textContent = (index + 1).toString();

      const trackDetails = document.createElement("div");
      trackDetails.className = "track-details";

      const trackName = document.createElement("div");
      trackName.className = "track-name";
      trackName.textContent = currentNode.title;

      const trackDuration = document.createElement("div");
      trackDuration.className = "track-duration";
      trackDuration.textContent = this.formatTime(currentNode.duration);

      trackDetails.appendChild(trackName);
      trackDetails.appendChild(trackDuration);

      item.appendChild(trackNumber);
      item.appendChild(trackDetails);

      const trackNode = currentNode;

      item.addEventListener("click", () => {
        this.currentTrack = trackNode;
        this.currentTime = 0;
        this.updateTrackInfo();
        this.updatePlaylist();
      });
      this.playlist.appendChild(item);

      currentNode = currentNode.next;
      index++;
    }
  }

  updateProgress() {
    const track = this.currentTrack;
    const percent = (this.currentTime / track.duration) * 100;
    this.progress.style.width = `${percent}%`;
    this.currentTimeEl.textContent = this.formatTime(this.currentTime);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  startProgressSimulation() {
    setInterval(() => {
      if (this.isPlaying) {
        this.currentTime += 1;
        if (this.currentTime >= this.currentTrack.duration) {
          this.nextTrack();
          this.currentTime = 0;
        }
        this.updateProgress();
      }
    }, 1000);
  }
}
new MusicPlayer();
