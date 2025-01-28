function getRandomWord(words: string[]): string {
    return words[Math.floor(Math.random() * words.length)];
}

function createReminder(): void {
    if (document.getElementById('reminder-popup')) return;

    chrome.storage.local.get(['words', 'currentWord'], data => {
        const words = data.words || [];

        let randomWord = data.currentWord;
        if (!randomWord && words.length > 0) {
            randomWord = getRandomWord(words);
            chrome.storage.local.set({ currentWord: randomWord });
        }

        if (!randomWord) return;

        const reminder = document.createElement('div');
        reminder.id = 'reminder-popup';

        reminder.innerHTML = `
            <div class="reminder-content">
                <h3>${randomWord}</h3>
                <button id="close-reminder">⨯</button>
                <div class="progress-bar"></div>
            </div>
            
        `;
        document.body.appendChild(reminder);

        const timeoutId = setTimeout(() => {
            reminder.remove();
            chrome.runtime.sendMessage({ action: 'setAlarm' });
        }, 45000);

        document
            .getElementById('close-reminder')
            ?.addEventListener('click', () => {
                reminder.remove();
                chrome.runtime.sendMessage({ action: 'setAlarm' });
            });
    });
}

function removeReminder() {
    const reminder = document.getElementById('reminder-popup');
    if (reminder) reminder.remove();
}

chrome.runtime.onMessage.addListener(message => {
    if (message.action === 'showPopup') {
        createReminder();
    } else if (message.action === 'removePopup') {
        removeReminder();
    }
});

chrome.runtime.sendMessage({ action: 'checkAlarm' }, response => {
    if (!response || !response.alarmExists) {
        createReminder();
    }
});

function insertFontLinks() {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href =
        'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap';

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
}

insertFontLinks();
