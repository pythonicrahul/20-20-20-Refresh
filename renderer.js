const { ipcRenderer } = require('electron');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');

startBtn.addEventListener('click', () => {
    ipcRenderer.send('startApp');
    startBtn.style.display = 'none'; // Hide the Start button
    stopBtn.style.display = 'inline-block'; // Display the Stop button
});

stopBtn.addEventListener('click', () => {
    ipcRenderer.send('stopApp');
    stopBtn.style.display = 'none'; // Hide the Stop button
    startBtn.style.display = 'inline-block'; // Display the Start button
});

resetBtn.addEventListener('click', () => {
    ipcRenderer.send('stopApp');
    ipcRenderer.send('startApp');
})

ipcRenderer.on('updateTimer', (event, minutes, seconds) => {
    timerMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
    timerSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
});
