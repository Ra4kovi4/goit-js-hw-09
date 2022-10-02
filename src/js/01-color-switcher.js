const refs = {
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};
let intervalId = null;
refs.stopBtn.disabled = true;
refs.startBtn.addEventListener('click', onChangeBodeColor);
refs.stopBtn.addEventListener('click', onStopChangeBodeColor);

function onChangeBodeColor() {
  if (refs.startBtn.disabled) {
    return;
  }

  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;

  intervalId = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function onStopChangeBodeColor() {
  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;

  clearInterval(intervalId);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
