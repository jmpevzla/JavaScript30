let interval;

function calcTime(elm, segs) {
    const leftMins = Math.floor(segs / 60);
    const leftSegs = String(segs - Math.floor(leftMins * 60)).padStart(2, '0');
    elm.textContent = `${leftMins}:${leftSegs}`;
}

function setTime(segs) {
    const timeLeft = document.querySelector('.display__time-left');
    const endTime = document.querySelector('.display__end-time');

    calcTime(timeLeft, segs);
    clearInterval(interval);
    interval = setInterval(() => {
        segs--;
        if (segs < 0) {
            clearInterval(interval);
        } else {
            calcTime(timeLeft, segs);
        }
    }, 1000);

    let now = new Date().getTime();
    now = new Date(now + segs * 1000);
    const nowHrs = String(now.getHours()).padStart(2, '0');
    const nowMin = String(now.getMinutes()).padStart(2, '0');
    endTime.textContent = `Be Back At ${nowHrs}:${nowMin}`;
}

const buttons = Array.from(document.querySelectorAll('.timer__button'));
const custom = document.getElementById('custom');

buttons.forEach((button) => {
    const time = button.dataset.time;
    button.addEventListener('click', () => {
        setTime(time);
    });
});

custom.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const entries = new FormData(ev.target).entries(); 
    for(let value of entries) {
        const num = Number(value[1]);
        if (!Number.isNaN(num)) {
            setTime(num * 60);
        }
    }
});
