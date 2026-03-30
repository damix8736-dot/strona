// ============================================
// OD PALAMYCHEATEROW - PEŁNY SCRIPT.JS
// ============================================

// IP serwera
const SERVER_IP = 'odpalamycheaterow.aternos.me';

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
        // Zamknij mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Kopiuj IP - ulepszone
function copyIP() {
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        const btn = event ? event.target.closest('button') : document.querySelector('.copy-ip');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ SKOPIOWANO!';
        btn.style.background = '#10b981';
        btn.style.transform = 'scale(1.05)';
        
        // 🔔 Powiadomienie
        showNotification('📋 Skopiowano!', `IP ${SERVER_IP} zostało skopiowane do schowka.`, 'success');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.transform = '';
        }, 2000);
    }).catch(() => {
        // Fallback dla starszych przeglądarek
        const textArea = document.createElement('textarea');
        textArea.value = SERVER_IP;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('IP skopiowane: ' + SERVER_IP);
        
        // 🔔 Powiadomienie
        showNotification('📋 Skopiowano!', `IP ${SERVER_IP} zostało skopiowane (fallback).`, 'success');
    });
}

// Animacja licznika graczy
function animatePlayerCount() {
    const countEl = document.getElementById('playerCount');
    if (!countEl) return;
    
    let current = parseInt(countEl.textContent) || 0;
    const target = 30 + Math.floor(Math.random() * 30); // 30-60 graczy
    const duration = 2000;
    const startTime = performance.now();
    
    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        countEl.textContent = Math.floor(easeProgress * target);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
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

// Regulamin z localStorage
function loadRules() {
    const rulesContent = document.getElementById('rules-content');
    if (!rulesContent) return;
    
    try {
        const savedRules = localStorage.getItem('odpalamycheaterow_rules');
        const rules = savedRules ? JSON.parse(savedRules) : [
            {title: 'Zakaz używania cheatów', description: 'Automatyczny ban za KillAurę, AutoClicker, Jesus itp.'},
            {title: 'Szanuj innych graczy', description: 'Brak toksyczności i spamu na czacie'},
            {title: 'Zakaz exploitów', description: 'Brak dupowania itemów i bugów serwera'},
            {title: 'Zakaz reklamy', description: 'Promowanie innych serwerów = permaban'}
        ];
        
        rulesContent.innerHTML = rules.map((rule, index) => `
            <div class="rule-item">
                <span class="rule-number">${index + 1}.</span>
                <div>
                    <h4>${rule.title}</h4>
                    <p>${rule.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.warn('Błąd ładowania regulaminu:', error);
        rulesContent.innerHTML = '<div class="rule-item"><p>Regulamin tymczasowo niedostępny</p></div>';
    }
}

// ===================== CHANGELOG =====================

const DEFAULT_CHANGELOG = [
    {
        version: "v1.0.0",
        date: "2024-01-15",
        content: "🎉 Oficjalne uruchomienie serwera!\n- Dodano tryby PvP, SkyWars, BedWars\n- Anti-Cheat system\n- Panel administracyjny"
    },
    {
        version: "v1.1.0",
        date: "2024-02-01",
        content: "✨ Nowości:\n- Dodano tryb Duels\n- Ranking graczy\n- Poprawki wydajności"
    }
];

function loadChangelog() {
    const changelogContent = document.getElementById('changelog-content');
    if (!changelogContent) return;
    
    try {
        const savedChangelog = localStorage.getItem('odpalamycheaterow_changelog');
        const changelog = savedChangelog ? JSON.parse(savedChangelog) : DEFAULT_CHANGELOG;
        
        if (changelog.length === 0) {
            changelogContent.innerHTML = '<div class="changelog-empty">✨ Brak wpisów. Admin wkrótce doda changelog!</div>';
            return;
        }
        
        changelogContent.innerHTML = changelog.map(item => `
            <div class="changelog-item">
                <div class="changelog-header">
                    <span class="changelog-version">${item.version}</span>
                    <span class="changelog-date">📅 ${item.date}</span>
                </div>
                <div class="changelog-content">${item.content.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    } catch (error) {
        console.warn('Błąd ładowania changelogu:', error);
        changelogContent.innerHTML = '<div class="changelog-empty">⚠️ Błąd ładowania changelogu</div>';
    }
}

// Discord
function joinDiscord() {
    window.open('https://discord.gg/odpalamycheaterow', '_blank');
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

// Status bar animation
function animateStatusBar() {
    const statusFill = document.querySelector('.status-fill');
    if (!statusFill) return;
    
    let width = 0;
    const target = 0.6 + Math.random() * 0.3; // 60-90%
    const duration = 3000;
    
    const start = performance.now();
    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        width = target * progress;
        statusFill.style.width = `${width * 100}%`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Reset i powtórz
            setTimeout(() => animateStatusBar(), 1000);
        }
    }
    requestAnimationFrame(animate);
}

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

// SERWER STATUS (symulacja)
function updateServerStatus() {
    const playerCount = document.getElementById('playerCount');
    if (playerCount) {
        setInterval(() => {
            const newCount = 20 + Math.floor(Math.random() * 50);
            playerCount.textContent = newCount;
        }, 15000);
    }
}

// INIT - wszystko uruchamiane po załadowaniu
function init() {
    console.log('🚀 OdpalamyCheaterow - Inicjalizacja...');
    
    animatePlayerCount();
    createParticles();
    loadRules();
    animateStatusBar();
    observeSections();
    updateServerStatus();
    loadChangelog();
    
    // Auto-copy IP po 3s (opcjonalne)
    setTimeout(() => {
        if (document.querySelector('.server-ip code')) {
            console.log('IP serwera:', SERVER_IP);
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


// Discord Widget - AKTYWNY LICZNIK
let discordRetryCount = 0;
const MAX_RETRIES = 5;

function loadDiscordStats() {
    const guildId = '123456789'; // ← ZMIEŃ NA SWÓJ ID SERWERA!
    
    fetch(`https://discord.com/api/guilds/${guildId}/widget.json`)
        .then(response => {
            if (!response.ok) throw new Error('Widget wyłączony');
            return response.json();
        })
        .then(data => {
            document.getElementById('discordMembers').textContent = 
                data.presence_count ? data.presence_count.toLocaleString() : '0';
            document.getElementById('discordOnline').textContent = 
                data.members ? data.members.length.toLocaleString() : '0';
            
            const statusEl = document.getElementById('discordStatus');
            statusEl.textContent = '✅ Połączono z Discordem';
            statusEl.className = 'discord-status discord-online';
            
            discordRetryCount = 0; // Reset retry
        })
        .catch(error => {
            console.warn('Discord API błąd:', error);
            discordRetryCount++;
            
            if (discordRetryCount < MAX_RETRIES) {
                // Fallback dane
                document.getElementById('discordMembers').textContent = '12,547';
                document.getElementById('discordOnline').textContent = '2,847';
                document.getElementById('discordStatus').textContent = 
                    `🔄 Ładowanie... (${discordRetryCount}/${MAX_RETRIES})`;
            } else {
                document.getElementById('discordStatus').textContent = '❌ Discord offline';
                document.getElementById('discordStatus').className = 'discord-status discord-offline';
            }
        });
}

// Auto-refresh co 60s
setInterval(loadDiscordStats, 60000);

// Load przy starcie
loadDiscordStats();


// ===================== USTAWIENIA, MOTYW, POWIADOMIENIA =====================

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

// --- Wyświetlanie powiadomienia ---
function showNotification(title, message, type = 'info') {
    if (!notificationsEnabled) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${title}</strong><br><small>${message}</small>`;
    if (toastContainer) toastContainer.appendChild(toast);
    playNotificationSound();
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function testNotification() {
    showNotification('🔔 Test powiadomienia', 'To jest przykładowe powiadomienie.', 'success');
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

// --- Inicjalizacja ---
loadSettings();

// --- Powitanie ---
setTimeout(() => {
    if (notificationsEnabled) {
        showNotification('🟢 Serwer online', 'Witaj na OdpalamyCheaterow!', 'info');
    }
}, 3000);

// --- Inicjalizacja ---
loadSettings();
