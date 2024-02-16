const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const sound = require("sound-play");
const path = require("path");

let mainWindow;
let intervalId;

// Function to display a notification with emoji and play a beep sound
const displayNotificationAndBeep = (title, message) => {
    const notification = new Notification({
        title,
        body: message,
        icon: 'C:\\Rahul\\Code\\eye-care-app\\media\\icon.png',
        silent: true,
    });

    notification.show();

    const beepPath = "C:\\Rahul\\Code\\eye-care-app\\media\\bubble.wav";
    sound.play(beepPath, 1.0); // Adjust volume if necessary
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 350,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('window-loaded');
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('startApp', () => {
        updateTimer();
    });

    ipcMain.on('stopApp', () => {
        clearInterval(intervalId);
        minutes = 20
        seconds = 0
        mainWindow.webContents.send('updateTimer', minutes, seconds);
        intervalId = null;
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

const updateTimer = () => {
    let minutes = 20;
    let seconds = 0;

    const startTimer = () => {
        intervalId = setInterval(() => {
            if (minutes === 0 && seconds === 0) {
                clearInterval(intervalId); // Clear the main timer interval
                // Start 20-second break
                displayNotificationAndBeep("Take a Break! ", "Remember to rest your eyes. Look at something 20 feet away for 20 seconds.");
                let breakSeconds = 20;
                let breakIntervalId = setInterval(() => {
                    if (breakSeconds === 0) {
                        clearInterval(breakIntervalId); // Clear the break interval
                        displayNotificationAndBeep("Break Over! ", "Back to work! Let's get productive. ");
                        updateTimer(); // Restart the timer after the break
                    }
                    // Send updated timer values to renderer process
                    mainWindow.webContents.send('updateTimer', 0, breakSeconds);
                    breakSeconds--;
                }, 1000); // Update every second during the break
            }

            // Send updated timer values to renderer process
            mainWindow.webContents.send('updateTimer', minutes, seconds);

            // Decrease timer
            if (seconds === 0) {
                seconds = 59;
                minutes--;
            } else {
                seconds--;
            }
        }, 1000); // Update every second
    };

    startTimer();
};


