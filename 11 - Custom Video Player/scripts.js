const video = document.querySelector("video.player__video");
const playPause = document.querySelector(".player__button.toggle");
const progressFilled = document.querySelector(".progress__filled");
const volume = document.querySelector("input[name='volume']");
const skipers = document.querySelectorAll('button[data-skip]');
const rate = document.querySelector("input[name='playbackRate']");
const progress = document.querySelector('.progress');

progressFilled.style.flexBasis = '0%';
volume.value = 1;
rate.value = 1;

video.addEventListener('timeupdate', () => {
    const value = Math.round((video.currentTime / video.duration) * 100);
    progressFilled.style.flexBasis = `${value}%`;
});

playPause.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPause.textContent = '||';
    } else {
        video.pause();
        playPause.textContent = '►';
    }
});

volume.addEventListener('input', (ev) => {
    video.volume = ev.target.value;
});

rate.addEventListener('input', (ev) => {
    video.playbackRate = ev.target.value;
});

skipers.forEach((sk) => {
    sk.addEventListener('click', (ev) => {
        video.currentTime = video.currentTime + Number(ev.target.dataset.skip);
    });
});

let mouseSeek = false;

const setVideoProgress = (ev) => {
    const valueProgress = ev.layerX * 100 / progress.clientWidth;
    video.currentTime = Math.round((valueProgress / 100) * video.duration);
};

progress.addEventListener('mousedown', () => {
    mouseSeek = true;
});
document.addEventListener('mouseup', () => {
    mouseSeek = false;
});
progress.addEventListener('mousemove', (ev) => {
    if (mouseSeek) {
        setVideoProgress(ev);
    } 
});
progress.addEventListener('click', (ev) => {
    setVideoProgress(ev);
});
