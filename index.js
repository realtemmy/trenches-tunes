class SongNode {
  constructor(title, artist, duration, url) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.url = url;
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
    this.isRepeat = false;

    this.tracks = [
      {
        title: "SoundHelix Song 1",
        artist: "T. Schürger",
        genre: "Instrumental",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 351,
      },
      {
        title: "SoundHelix Song 2",
        artist: "T. Schürger",
        genre: "Instrumental",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: 299,
      },
      {
        title: "Acoustic Breeze",
        artist: "Bensound",
        genre: "Acoustic",
        url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
        duration: 223,
      },
      {
        title: "SoundHelix Song 3",
        artist: "T. Schürger",
        genre: "Instrumental",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: 317,
      },
    ];

    this.toNode();
    this.initElements();
    this.bindEvents();
    this.updateTrackInfo();
    // this.startProgressSimulation();
    this.setupAudioListeners();
    this.updatePlaylist();
  }

  addSong(track) {
    const newSong = new SongNode(
      track.title,
      track.artist,
      track.duration,
      track.url
    );
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
    this.audio = document.getElementById("audioPlayer");
    this.repeatBtn = document.getElementById("repeat");
    this.shuffleBtn = document.getElementById("shuffle");
  }

  bindEvents() {
    this.playPauseBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.previousTrack());
    this.nextBtn.addEventListener("click", () => this.nextTrack());
    this.progressBar.addEventListener("click", (e) => this.setProgress(e));
    this.volumeSlider.addEventListener("input", (e) =>
      this.setVolume(e.target.value)
    );
    this.repeatBtn.addEventListener("click", () => this.repeat());
    this.shuffleBtn.addEventListener("click", () => this.shuffle());
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.playPauseBtn.textContent = this.isPlaying ? "⏸" : "▶";

    if (this.isPlaying) {
      this.player.classList.remove("paused");

      if (this.audio.readyState < 4) {
        this.audio.addEventListener(
          "canplaythrough",
          () => {
            this.audio.play();
          },
          { once: true }
        );
      } else {
        this.audio.play();
      }
    } else {
      this.player.classList.add("paused");
      this.audio.pause();
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
    this.updatePlaylist();
    this.updateTrackInfo();
  }
  nextTrack() {
    if (this.currentTrack && this.currentTrack.next)
      this.currentTrack = this.currentTrack.next;
    this.updatePlaylist();
    this.updateTrackInfo();
  }

  repeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle("active", this.isRepeatPlaylist);
    console.log(this.isRepeat);
  }

  toArray() {
    let currentNode = this.head;
    const array = [];
    while (currentNode) {
      array.push(currentNode);
      currentNode = currentNode.next;
    }
    return array;
  }

  shuffle() {
    const array = this.toArray();
    let currentIndex = array.length;
    let randomIndex;

    // Fisher Yates shuffling algorithm
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    // Clear list before adding new ones
    this.head = null;
    this.currentTrack = null;

    // Convert back to linked lists
    for (let i = 0; i < array.length; i++) {
      this.addSong(array[i]);
    }
    this.updateTrackInfo();
    this.updatePlaylist();
  }

  setProgress(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * this.audio.duration;

    this.audio.currentTime = seekTime;
    this.currentTime = seekTime;
    this.updateProgress();
  }

  setVolume(volume) {
    this.volume = volume;
    this.audio.volume = volume / 100;
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
    this.audio.src = track.url;
    // this.audio.play();
    this.trackTitle.textContent = track.title;
    this.trackArtist.textContent = track.artist;
    this.currentTime = 0;
    this.totalTimeEl.textContent = this.formatTime(track.duration);

    if (this.isPlaying) {
      this.audio.pause();
      this.audio.load();
      this.audio.addEventListener(
        "canplaythrough",
        () => {
          this.audio.play();
        },
        { once: true }
      );
    }
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

  setupAudioListeners() {
    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });

    this.audio.addEventListener("ended", () => {
      if (this.currentTrack.next) {
        this.nextTrack();
      } else if (this.isRepeat) {
        this.currentTrack = this.head;
        this.currentTime = 0;

        this.updateTrackInfo();
        this.updatePlaylist();
      } else {
        this.isPlaying = false;
        this.playPauseBtn.textContent = "▶";
      }
    });

    this.audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      // Show error to user
    });
  }
}
new MusicPlayer();
