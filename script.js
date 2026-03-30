// ============================================
// OD PALAMYCHEATEROW - PEŁNY SCRIPT.JS
// ============================================

// IP serwera
const SERVER_IP = 'odpalamycheaterow.pl';

// Nawigacja mobilna
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});

// Smooth scroll dla wszystkich linków
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Kopiuj IP - z powiadomieniem
function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        const btn = event ? event.target.closest('button') : document.querySelector('.copy-ip');
        const originalText = btn ? btn.innerHTML : 'Skopiuj IP';
        if (btn) {
            btn.innerHTML = '✅ SKOPIOWANO!';
            btn.style.background = '#10b981';
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.transform = '';
            }, 2000);
        }
        showNotification('📋 Skopiowano!', `IP ${SERVER_IP} zostało skopiowane do schowka.`, 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = SERVER_IP;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 Skopiowano!', `IP ${SERVER_IP} zostało skopiowane.`, 'success');
    });
}

// Discord
function joinDiscord() {
    window.open('https://discord.gg/odpalamycheaterow', '_blank');
    showNotification('💬 Discord', 'Przekierowanie na serwer Discord...', 'info');
}

// Particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: rgba(${120 + Math.random() * 135},${119 + Math.random() * 136},${198 + Math.random() * 57}, ${0.3 + Math.random() * 0.4});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
            pointer-events: none;
        `;
        particlesContainer.appendChild(particle);
    }
}

// ===================== ŁADOWANIE DANYCH Z SERWERA =====================

// Funkcja do ładowania danych z serwera
async function loadDataFromServer() {
    try {
        const response = await fetch('save_data.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Błąd ładowania danych:', error);
        return null;
    }
}

// Regulamin z serwera
async function loadRules() {
    const rulesContent = document.getElementById('rules-content');
    if (!rulesContent) return;
    
    rulesContent.innerHTML = '<div class="loading">Ładowanie regulaminu...</div>';
    
    const data = await loadDataFromServer();
    
    if (data && data.rules && data.rules.length > 0) {
        rulesContent.innerHTML = data.rules.map((rule, index) => `
            <div class="rule-item">
                <span class="rule-number">${index + 1}.</span>
                <div>
                    <h4>${escapeHtml(rule.title)}</h4>
                    <p>${escapeHtml(rule.description)}</p>
                </div>
            </div>
        `).join('');
    } else {
        rulesContent.innerHTML = '<div class="changelog-empty">📜 Regulamin jest pusty. Admin wkrótce go uzupełni!</div>';
    }
}

// Changelog z serwera
async function loadChangelog() {
    const changelogContent = document.getElementById('changelog-content');
    if (!changelogContent) return;
    
    changelogContent.innerHTML = '<div class="loading">Ładowanie changelogu...</div>';
    
    const data = await loadDataFromServer();
    
    if (data && data.changelog && data.changelog.length > 0) {
        changelogContent.innerHTML = data.changelog.map(item => `
            <div class="changelog-item">
                <div class="changelog-header">
                    <span class="changelog-version">${escapeHtml(item.version)}</span>
                    <span class="changelog-date">📅 ${escapeHtml(item.date)}</span>
                </div>
                <div class="changelog-content">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    } else {
        changelogContent.innerHTML = '<div class="changelog-empty">✨ Brak wpisów. Admin wkrótce doda changelog!</div>';
    }
}

// Funkcja pomocnicza do escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Navbar scroll effect
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Parallax mouse effect
window.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero');
    if (hero) {
        const x = (e.clientX / window.innerWidth) * 20;
        const y = (e.clientY / window.innerHeight) * 20;
        hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
});

// Intersection Observer dla sekcji
function observeSections() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });
}

// ===================== USTAWIENIA, MOTYW, POWIADOMIENIA =====================

// Elementy DOM
const settingsCog = document.getElementById('settingsCog');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettings');
const themeDarkBtn = document.getElementById('themeDarkBtn');
const themeLightBtn = document.getElementById('themeLightBtn');
const notifToggle = document.getElementById('notifToggle');
const soundToggle = document.getElementById('soundToggle');
const testNotifBtn = document.getElementById('testNotificationBtn');
const toastContainer = document.getElementById('toastContainer');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');

// Zmienne stanu
let notificationsEnabled = true;
let soundEnabled = true;
let currentTheme = 'dark';
let fontSize = 100;

// --- Odczyt ustawień z localStorage ---
function loadSettings() {
    // Motyw
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        currentTheme = 'light';
        document.body.classList.add('light-theme');
        if (themeDarkBtn && themeLightBtn) {
            themeDarkBtn.classList.remove('active');
            themeLightBtn.classList.add('active');
        }
    } else {
        currentTheme = 'dark';
        document.body.classList.remove('light-theme');
        if (themeDarkBtn && themeLightBtn) {
            themeDarkBtn.classList.add('active');
            themeLightBtn.classList.remove('active');
        }
    }

    // Powiadomienia
    const savedNotif = localStorage.getItem('notifications');
    notificationsEnabled = savedNotif !== 'false';
    if (notifToggle) notifToggle.checked = notificationsEnabled;

    // Dźwięk
    const savedSound = localStorage.getItem('sound');
    soundEnabled = savedSound !== 'false';
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
        soundToggle.disabled = !notificationsEnabled;
    }
    
    // Rozmiar czcionki
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSize = parseInt(savedFontSize);
        document.body.style.fontSize = fontSize + '%';
        if (fontSizeSlider) fontSizeSlider.value = fontSize;
        if (fontSizeValue) fontSizeValue.textContent = fontSize + '%';
    }
}

// --- Zapisywanie ustawień ---
function saveSettings() {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('notifications', notificationsEnabled);
    localStorage.setItem('sound', soundEnabled);
    localStorage.setItem('fontSize', fontSize);
}

// --- Zmiana motywu ---
function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeDarkBtn && themeLightBtn) {
            themeDarkBtn.classList.remove('active');
            themeLightBtn.classList.add('active');
        }
    } else {
        document.body.classList.remove('light-theme');
        if (themeDarkBtn && themeLightBtn) {
            themeDarkBtn.classList.add('active');
            themeLightBtn.classList.remove('active');
        }
    }
    saveSettings();
}

// --- Odtwarzanie dźwięku ---
function playNotificationSound() {
    if (!soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        oscillator.frequency.value = 880;
        gain.gain.value = 0.2;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch(e) {
        console.warn("Web Audio nie wspierany");
    }
}

// --- Wyświetlanie powiadomienia (toast) ---
function showNotification(title, message, type = 'info') {
    if (!notificationsEnabled) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${escapeHtml(title)}</strong><br><small>${escapeHtml(message)}</small>`;
    if (toastContainer) toastContainer.appendChild(toast);
    playNotificationSound();
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function testNotification() {
    showNotification('🔔 Test powiadomienia', 'To jest przykładowe powiadomienie z dźwiękiem.', 'success');
}

// --- Obsługa panelu ustawień ---
if (settingsCog && settingsPanel && closeSettingsBtn) {
    settingsCog.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.toggle('active');
    });
    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsCog.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });
}

// --- Obsługa przełączników ---
if (notifToggle) {
    notifToggle.addEventListener('change', (e) => {
        notificationsEnabled = e.target.checked;
        if (soundToggle) {
            soundToggle.disabled = !notificationsEnabled;
            if (!notificationsEnabled) {
                soundEnabled = false;
                soundToggle.checked = false;
            }
        }
        saveSettings();
    });
}
if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        saveSettings();
    });
}
if (themeDarkBtn && themeLightBtn) {
    themeDarkBtn.addEventListener('click', () => setTheme('dark'));
    themeLightBtn.addEventListener('click', () => setTheme('light'));
}
if (testNotifBtn) {
    testNotifBtn.addEventListener('click', testNotification);
}

// --- Obsługa suwaka rozmiaru czcionki ---
if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', (e) => {
        fontSize = parseInt(e.target.value);
        document.body.style.fontSize = fontSize + '%';
        fontSizeValue.textContent = fontSize + '%';
        saveSettings();
    });
}

// --- Inicjalizacja wszystkiego ---
async function init() {
    console.log('🚀 OdpalamyCheaterow - Inicjalizacja...');
    createParticles();
    await loadRules();
    await loadChangelog();
    observeSections();
    loadSettings();
    
    setTimeout(() => {
        if (notificationsEnabled) {
            showNotification('🟢 Serwer online', 'Witaj na OdpalamyCheaterow! Miłej gry.', 'info');
        }
    }, 3000);
    
    console.log('✅ Strona gotowa!');
}

// Uruchom gdy DOM gotowy
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// PWA-like - obsługa offline
window.addEventListener('online', () => console.log('🌐 Online'));
window.addEventListener('offline', () => console.log('📴 Offline'));

// Error handling
window.addEventListener('error', function(e) {
    console.error('Błąd:', e.error);
});
