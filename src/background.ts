function sendMessageToActiveTab(message: any) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0]?.id, message);
        }
    });
}

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'showPopup') {
        sendMessageToActiveTab({ action: 'showPopup' });
    }
});

chrome.tabs.onActivated.addListener(() => {
    chrome.alarms.get('showPopup', alarm => {
        if (!alarm) {
            sendMessageToActiveTab({ action: 'showPopup' });
        } else {
            sendMessageToActiveTab({ action: 'removePopup' });
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkAlarm') {
        chrome.alarms.get('showPopup', alarm => {
            console.log(alarm);
            sendResponse({ alarmExists: !!alarm });
        });
        return true;
    }

    if (message.action === 'setAlarm') {
        chrome.alarms.create('showPopup', { delayInMinutes: 3 });
        chrome.storage.local.remove('currentWord');
        sendResponse('alarm set');
    }
});
