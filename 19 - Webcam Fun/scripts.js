const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');



function takePhoto() {
    snap.play();
    const a = document.createElement('a');
    const img = document.createElement('img');
    const path = canvas.toDataURL('image/jpg'); 
    a.href = path;
    a.setAttribute('download', 'photo');
    img.src = path;
    img.alt = 'Your photo!';
    a.appendChild(img);
    strip.insertBefore(a, strip.children[0]);
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        }).catch((error) => {
            console.log('webcam error');
        });
        
}

function computeFrame() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(video, 0, 0, width, height);
    let frame = ctx.getImageData(0, 0, width, height);
    
    //frame = redEffect(frame);
    frame = rgbSplit(frame);
    //frame = slidersRGB(frame);

    ctx.putImageData(frame, 0, 0);
    return;
}

function redEffect(frame) {
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let ri = i * 4 + 0;
      let gi = i * 4 + 1;
      let bi = i * 4 + 2;

      frame.data[ri] += 200;
      frame.data[gi] -= 50;
      frame.data[bi] *= 0.5;
     
    }
    return frame;
}

function rgbSplit(frame) {
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let ri = i * 4 + 0;
      let gi = i * 4 + 1;
      let bi = i * 4 + 2;

      frame.data[ri - 150] = frame.data[ri];
      frame.data[ri + 500] = frame.data[gi];
      frame.data[ri - 550] = frame.data[bi];
     
    }
    return frame;
}

function slidersRGB(frame) {
    const values = {
        rmin: 0, rmax: 0,
        gmin: 0, gmax: 0,
        bmin: 0, bmax: 0
    };

    const sliders = document.querySelectorAll('input');
    sliders.forEach((slider) => {
        values[slider.name] = slider.value;
    });

    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];

        if (r <= values.rmax &&
            r >= values.rmin &&
            g <= values.gmax &&
            g >= values.gmin &&
            b <= values.bmax &&
            b >= values.bmin) {
                frame.data[i * 4 + 3] = 0;
            }
        

        /*if (r < values.rmin) {
            frame.data[i * 4 + 0] = values.rmin;
        } else if (r > values.rmax) {
            frame.data[i * 4 + 0] = values.rmax;
        }

        if (g < values.gmin) {
            frame.data[i * 4 + 1] = values.gmin;
        } else if (g > values.gmax) {
            frame.data[i * 4 + 1] = values.gmax;
        }

        if (b < values.bmin) {
            frame.data[i * 4 + 2] = values.bmin;
        } else if (b > values.bmax) {
            frame.data[i * 4 + 2] = values.bmax;
        }*/
    }

    return frame;
}

function timerCallback() {
    if (video.paused || video.ended) {
        return;
    }
    computeFrame();
      
    setTimeout(function () {
        timerCallback();
    }, 100);
}

video.addEventListener('canplay', () => {
    timerCallback();
});