// DOM Elements
const backgroundMusic = document.getElementById('backgroundMusic');
const playPauseButton = document.getElementById('playPauseButton');
const audioControls = document.querySelector('.audio-controls');
const openButton = document.getElementById('openInvitation');
const invitationCover = document.getElementById('cover');
const invitationContent = document.getElementById('invitation');
const copyButton = document.getElementById('copyButton');
const copyMessage = document.getElementById('copyMessage');
const accountNumber = document.getElementById('accountNumber');
const rsvpForm = document.getElementById('rsvpForm');
const responseMessage = document.getElementById('responseMessage');
const rsvpList = document.getElementById('rsvpList'); // Elemen untuk menampilkan daftar RSVP
const attendanceCountsElement = document.getElementById('attendanceCounts'); // Elemen untuk menampilkan jumlah kehadiran

// Event listener to open the invitation
openButton.addEventListener('click', function() {
    invitationCover.style.display = 'none';
    invitationContent.style.display = 'block';
    audioControls.style.display = 'block'; // Show the audio controls
    togglePlayPause();
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to get query parameter value
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set guest name from URL parameter
const guestName = getQueryParam('guest');
if (guestName) {
    document.getElementById('guest').textContent = guestName;
}

// Countdown timer
const targetDate = new Date('2024-09-15T00:00:00');

function updateCountdown() {
    const now = new Date();
    const timeDiff = targetDate - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update the countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initialize countdown

// Copy account number to clipboard
copyButton.addEventListener('click', function() {
    navigator.clipboard.writeText(accountNumber.innerText).then(function() {
        copyMessage.innerText = 'Nomor rekening berhasil disalin!';
    }).catch(function() {
        copyMessage.innerText = 'Gagal menyalin nomor rekening.';
    });
});

// Toggle play/pause for the music
let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    isPlaying = !isPlaying;
    playPauseButton.src = isPlaying ? 'pause.png' : 'play.png'; // Update button image
}

// Event listener for the play/pause button
playPauseButton.addEventListener('click', togglePlayPause);

// Fungsi untuk menampilkan pesan RSVP
function fetchMessages() {
    fetch('https://zhapran-fira-tema-2.glitch.me/rsvp')
        .then(response => response.json())
        .then(data => {
            const messagesContainer = document.getElementById('messages');
            messagesContainer.innerHTML = '';
            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message-item');
                messageElement.innerHTML = `
                    <h4>${message.name}</h4>
                    <p>${message.message}</p>
                `;
                messagesContainer.appendChild(messageElement);
            });
        });
}

// Fungsi untuk menampilkan jumlah kehadiran
function fetchAttendanceCounts() {
    fetch('https://zhapran-fira-tema-2.glitch.me/rsvp/attendance')
        .then(response => response.json())
        .then(data => {
            document.getElementById('hadirCount').textContent = data.hadir;
            document.getElementById('tidakHadirCount').textContent = data.tidakHadir;
            document.getElementById('raguCount').textContent = data.ragu;
        });
}

// Event listener untuk form submit
rsvpForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah halaman refresh

    // Mengambil nilai dari form
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const attendance = document.getElementById('attendance').value;

    // Mengirim data ke server Glitch
    fetch('https://zhapran-fira-tema-2.glitch.me/rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, message, attendance })
    })
    .then(response => response.json())
    .then(data => {
        responseMessage.textContent = `Terima kasih, ${name}! Pesan Anda telah diterima: "${message}"`;
        // Reset form setelah submit
        rsvpForm.reset();
        // Refresh daftar RSVP dan jumlah kehadiran
        displayRSVPs();
    })
    .catch(error => {
        responseMessage.textContent = 'Terjadi kesalahan, coba lagi nanti.';
        console.error('Error:', error);
    });
});

// Panggil displayRSVPs() saat halaman pertama kali dimuat
fetchMessages();
fetchAttendanceCounts();
