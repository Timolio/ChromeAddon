document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('actionButton') as HTMLButtonElement;
    button.addEventListener('click', () => {
        alert('Addon works!');
    });
});
