let c = document.getElementById("cvs"), ctx = c.getContext("2d");

let state = 0, hover = 0, n, m, brk, tot, mx = 300, my = 0, deagle = new Image(), score = 0, bullet = 0, lookat = 0, shot = 0;
deagle.src = 'deagle.png';
const PAD = 100, BOT = 400;

function frame() {
  const color = ['#FFFFFF', '#000000'];
  if (state == 0) {
    ctx.font = "200px Arial";
    ctx.fillStyle = color[hover];
    ctx.fillRect(0, 0, 1600, 1200);
    ctx.fillStyle = color[1 - hover];
    ctx.fillText("START", 520, 650);
  } else if (state == 1) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1600, 1200);
    for (let i = 0; i < n; ++i)
      for (let j = 0; j < m; ++j)
        if (brk[i][j][1] != -1) {
          if (brk[i][j][1] == 0) {
            ctx.beginPath();
            ctx.rect(PAD + (1600 - 2 * PAD) / m * j, PAD + (1200 - PAD - BOT) / n * i, (1600 - 2 * PAD) / m, (1200 - PAD - BOT) / n);
            ctx.stroke();
            ctx.closePath();
          } else {
            ctx.fillStyle = color[brk[i][j][1]];
            ctx.fillRect(PAD + (1600 - 2 * PAD) / m * j, PAD + (1200 - PAD - BOT) / n * i, (1600 - 2 * PAD) / m, (1200 - PAD - BOT) / n);
          }

          ctx.fillStyle = color[1 - brk[i][j][1]];
          ctx.fillStyle = color[1 - brk[i][j][1]];
          let sz = Math.min((1600 - 2 * PAD) / m, (1200 - PAD - BOT) / n);
          ctx.font = `${sz / 2}px Arial`;
          ctx.fillText(brk[i][j][0].toString(), PAD + (1600 - 2 * PAD) / m * j, PAD + (1200 - PAD - BOT) / n * (i + 1) - 20);

        } else {
          console.log(i, j);
        }

    ctx.fillStyle = '#000000';
    ctx.font = `50px Arial`;
    ctx.fillText(`score: ${score} bullets: ${bullet}`, 100, 70);
    ctx.save();

    let p = ((new Date()).getTime() - shot) / 500;
    if (p < 1) {
      const X = 0, Y = 100;
      ctx.translate(mx - 60 + X, 1100 - 703 / 3 + 100 + Y);
      ctx.rotate(p < 0.1 ? p / 0.1 * Math.PI / 4 : (1 - Math.pow((p - 0.1) / 0.9, 2)) * Math.PI / 4);
      ctx.drawImage(deagle, -167 / 3 - X, -350 / 3 - Y, 372 / 3, 703 / 3);
    } else {
      ctx.translate(mx - 60, 1100 - 703 / 3 + 100);
      if (lookat) {
        let p = ((new Date()).getTime() - lookat) / 2000;
        ctx.rotate(Math.PI * 2 * p * 5);
        if (p > 1) {
          lookat = 0;
        }
      }
      ctx.drawImage(deagle, -167 / 3, -350 / 3, 372 / 3, 703 / 3);
      console.log(mx, 'drawImage');
    }
    ctx.restore();

  } else if (state == 2) {
    ctx.font = "200px Arial";
    ctx.fillStyle = color[0];
    ctx.fillRect(0, 0, 1600, 1200);
    ctx.fillStyle = color[1];
    ctx.fillText(`score: ${score}`, 100, 600);
    ctx.fillText(`click to restart`, 100, 800);
  }
  requestAnimationFrame(frame);
}

frame();

let snd = new Audio("deagle.wav");

c.addEventListener("click", () => {
  if (state == 0) {
    state = 1;
    let input = document.getElementById('input').value.split('\n');
    [n, m, bullet] = input[0].split(' ').map(x => parseInt(x));
    brk = [];
    tot = n * m;
    score = 0;
    for (let i = 1; i <= n; ++i) {
      let arr = input[i].split(' ');
      let ln = [];
      for (let j = 0; j < m; ++j) {
        ln.push([parseInt(arr[2 * j]), arr[2 * j + 1] == 'Y' ? 1 : 0])
      }
      brk.push(ln);
    }
  } else if (state == 1) {
    if (bullet > 0 && (new Date()).getTime() - shot > 200) {
      snd.pause();
      snd.currentTime = 0;
      snd.play();
      shot = (new Date()).getTime();
      lookat = 0;
      bullet -= 1;
      tot -= 1;
      for (let j = m - 1; j >= 0; --j) {
        if (mx >= (1600 - 2 * PAD) / m * j) {
          for (let i = n - 1; i >= 0; --i) {
            if (brk[i][j][1] != -1) {
              score += brk[i][j][0];
              bullet += brk[i][j][1] == 1;
              brk[i][j][1] = -1;
              break;
            }
          }
          break;
        }
      }
      if (bullet == 0 || tot == 0) {
        setTimeout(() => {
          state = 2;
        }, 1500);
      }
    }
  } else {
    location.reload();
  }

});

c.addEventListener("mousemove", (e) => {
  let rect = c.getBoundingClientRect();
  mx = (e.clientX - rect.left) * 2;
  my = (e.clientY - rect.top) * 2;
  mx = Math.max(mx, PAD + 372 / 3 - 100);
  mx = Math.min(mx, 1600 - PAD + 20);
  //my = Math.max(my, 1400 - BOT);
  //my = Math.min(my, 1200);
});

c.addEventListener("mouseenter", () => {
  console.log('enter');
  hover = 1;
});

c.addEventListener("mouseleave", () => {
  console.log('leave');
  hover = 0;
});


document.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key == 'F' || e.key == 'f') {
    lookat = (new Date()).getTime();
  }
});
