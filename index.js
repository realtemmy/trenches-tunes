class SongNode {
  constructor(title, artist, duration, url) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.url = url
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
        title: "A Calm Sunset",
        artist: "Dee Yan-Key",
        genre: "Jazz",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Dee_Yan-Key/slow_jazz_sunset/Dee_Yan-Key_-_01_-_a_calm_sunset.mp3",
        duration: 214,
      },
      {
        title: "On the Verge",
        artist: "Ketsa",
        genre: "Hip Hop / Chill",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Floating/On_The_Verge.mp3",
        duration: 187,
      },
      {
        title: "Sonata No. 1",
        artist: "Kevin MacLeod",
        genre: "Classical",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/curator/ccCommunity/Kevin_MacLeod/Classical_Sampler/Kevin_MacLeod_-_Sonata_No_1.mp3",
        duration: 310,
      },
      {
        title: "Acoustic Breeze",
        artist: "Bensound",
        genre: "Acoustic",
        url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
        duration: 223,
      },
      {
        title: "A New Beginning",
        artist: "Mixkit",
        genre: "Cinematic",
        url: "https://assets.mixkit.co/music/preview/mixkit-a-new-beginning-693.mp3",
        duration: 147,
      },
      {
        title: "Night Run",
        artist: "Mixkit",
        genre: "Electronic / Synth",
        url: "https://assets.mixkit.co/music/preview/mixkit-night-run-666.mp3",
        duration: 172,
      },
      {
        title: "Dream Culture",
        artist: "Kevin MacLeod",
        genre: "Ambient",
        url: "https://orangefreesounds.com/wp-content/uploads/2021/06/Dream-Culture.mp3",
        duration: 158,
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
    this.startProgressSimulation();
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
      this.audio.play();
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
    this.audio.src = track.url;
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
