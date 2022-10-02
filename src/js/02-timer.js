import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;

let deadlineTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    deadlineTime = selectedDates[0];

    if (deadlineTime < Date.now()) {
      Notify.failure('Please choose a date in the future');
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,
  isActive: false,
  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;

    this.intervald = setInterval(() => {
      const startTime = Date.now();
      const deltaTime = deadlineTime.getTime() - startTime;
      const time = this.convertMs(deltaTime);

      if (deltaTime > 0) {
        updateValueField(time);
      } else {
        this.stop();
      }
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    startBtn.disabled = true;
  },

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  },

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
};

function updateValueField({ days, hours, minutes, seconds }) {
  const refs = {
    daysValueField: document.querySelector('[data-days]'),
    hoursValueField: document.querySelector('[data-hours]'),
    minutesValueField: document.querySelector('[data-minutes]'),
    secondsValueField: document.querySelector('[data-seconds]'),
  };
  refs.daysValueField.textContent = days;
  refs.hoursValueField.textContent = hours;
  refs.minutesValueField.textContent = minutes;
  refs.secondsValueField.textContent = seconds;
}

startBtn.addEventListener('click', timer.start.bind(timer));
