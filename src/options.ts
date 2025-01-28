const wordInput = document.getElementById('wordInput') as HTMLInputElement;
const addWordButton = document.getElementById('addWord') as HTMLButtonElement;
const wordList = document.getElementById('wordList') as HTMLUListElement;

function loadWords() {
    chrome.storage.local.get('words', data => {
        const words = data.words || [];
        wordList.innerHTML = '';
        words.forEach((word: string, index: number) => {
            const li = document.createElement('li');

            const wordText = document.createElement('span');
            wordText.textContent = word;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');

            deleteButton.addEventListener('click', () => {
                deleteWord(index);
            });

            li.appendChild(wordText);
            li.appendChild(deleteButton);

            wordList.appendChild(li);
        });
    });
}

function addWord() {
    const newWord = wordInput.value.trim();
    if (!newWord) return;

    chrome.storage.local.get('words', data => {
        const words = data.words || [];
        words.push(newWord);
        chrome.storage.local.set({ words }, () => {
            wordInput.value = '';
            loadWords();
        });
    });
}

function deleteWord(index: number) {
    chrome.storage.local.get('words', data => {
        const words = data.words || [];
        words.splice(index, 1);
        chrome.storage.local.set({ words }, () => {
            loadWords();
        });
    });
}

addWordButton.addEventListener('click', addWord);

document.addEventListener('DOMContentLoaded', loadWords);
