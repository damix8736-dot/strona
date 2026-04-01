// ============================================
// OD PALAMYCHEATEROW - PEŁNY SCRIPT.JS
// ============================================

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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Kopiuj IP
function copyIP() {
    const ip = SERVER_IP;
    
    navigator.clipboard.writeText(ip).then(() => {
        const btn = event ? event.target.closest('button') : document.querySelector('.copy-ip');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ SKOPIOWANO!';
            btn.style.background = '#10b981';
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.transform = '';
            }, 2000);
        }
        showNotification('📋 Skopiowano!', `IP ${ip} zostało skopiowane do schowka.`, 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 Skopiowano!', `IP ${ip} zostało skopiowane.`, 'success');
    });
}

// Discord
function joinDiscord() {
    window.open('https://discord.gg/Gnq4KE7tf2', '_blank');
    showNotification('💬 Discord', 'Przekierowanie na serwer Discord...', 'info');
}

// Particles
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

// ===================== FIREBASE - ŁADOWANIE DANYCH =====================

// Domyślne dane
const DEFAULT_RULES = [
    { title: 'Zakaz używania cheatów', description: 'Automatyczny ban za KillAurę, AutoClicker, Jesus itp.' },
    { title: 'Szanuj innych graczy', description: 'Brak toksyczności i spamu na czacie' },
    { title: 'Zakaz exploitów', description: 'Brak dupowania itemów i bugów serwera' },
    { title: 'Zakaz reklamy', description: 'Promowanie innych serwerów = permaban' }
];

const DEFAULT_CHANGELOG = [
    { version: 'v1.0.0', date: '2024-01-15', content: '🎉 Oficjalne uruchomienie serwera!\n- Dodano tryby PvP, SkyWars, BedWars\n- Anti-Cheat system\n- Panel administracyjny' },
    { version: 'v1.1.0', date: '2024-02-01', content: '✨ Nowości:\n- Dodano tryb Duels\n- Ranking graczy\n- Poprawki wydajności' }
];

// Ładowanie regulaminu
async function loadRules() {
    const rulesContent = document.getElementById('rules-content');
    if (!rulesContent) return;
    
    rulesContent.innerHTML = '<div class="loading">Ładowanie regulaminu...</div>';
    
    if (!window.db) {
        rulesContent.innerHTML = '<div class="changelog-empty">❌ Błąd połączenia z bazą danych</div>';
        return;
    }
    
    try {
        const snapshot = await window.db.ref('rules').once('value');
        let rules = snapshot.val();
        
        if (!rules || rules.length === 0) {
            rules = DEFAULT_RULES;
            await window.db.ref('rules').set(rules);
        }
        
        rulesContent.innerHTML = rules.map((rule, index) => `
            <div class="rule-item">
                <span class="rule-number">${index + 1}.</span>
                <div>
                    <h4>${escapeHtml(rule.title)}</h4>
                    <p>${escapeHtml(rule.description)}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania regulaminu:', error);
        rulesContent.innerHTML = '<div class="changelog-empty">❌ Błąd ładowania regulaminu</div>';
    }
}

// Ładowanie changelogu
async function loadChangelog() {
    const changelogContent = document.getElementById('changelog-content');
    if (!changelogContent) return;
    
    changelogContent.innerHTML = '<div class="loading">Ładowanie changelogu...</div>';
    
    if (!window.db) {
        changelogContent.innerHTML = '<div class="changelog-empty">❌ Błąd połączenia z bazą danych</div>';
        return;
    }
    
    try {
        const snapshot = await window.db.ref('changelog').once('value');
        let changelog = snapshot.val();
        
        if (!changelog || changelog.length === 0) {
            changelog = DEFAULT_CHANGELOG;
            await window.db.ref('changelog').set(changelog);
        }
        
        if (changelog.length === 0) {
            changelogContent.innerHTML = '<div class="changelog-empty">✨ Brak wpisów. Admin wkrótce doda changelog!</div>';
            return;
        }
        
        changelogContent.innerHTML = changelog.map(item => `
            <div class="changelog-item">
                <div class="changelog-header">
                    <span class="changelog-version">${escapeHtml(item.version)}</span>
                    <span class="changelog-date">📅 ${escapeHtml(item.date)}</span>
                </div>
                <div class="changelog-content">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Błąd ładowania changelogu:', error);
        changelogContent.innerHTML = '<div class="changelog-empty">❌ Błąd ładowania changelogu</div>';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Navbar effect
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

// Parallax
window.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero');
    if (hero) {
        const x = (e.clientX / window.innerWidth) * 20;
        const y = (e.clientY / window.innerHeight) * 20;
        hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
});

// Intersection Observer
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

// ===================== USTAWIENIA =====================

// Podstawowe elementy DOM
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

// Funkcje podstawowych ustawień
function loadSettings() {
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
    
    const savedNotif = localStorage.getItem('notifications');
    notificationsEnabled = savedNotif !== 'false';
    if (notifToggle) notifToggle.checked = notificationsEnabled;
    
    const savedSound = localStorage.getItem('sound');
    soundEnabled = savedSound !== 'false';
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
        soundToggle.disabled = !notificationsEnabled;
    }
    
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSize = parseInt(savedFontSize);
        document.body.style.fontSize = fontSize + '%';
        if (fontSizeSlider) fontSizeSlider.value = fontSize;
        if (fontSizeValue) fontSizeValue.textContent = fontSize + '%';
    }
}

function saveSettings() {
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('notifications', notificationsEnabled);
    localStorage.setItem('sound', soundEnabled);
    localStorage.setItem('fontSize', fontSize);
}

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

// Obsługa panelu ustawień (otwieranie/zamykanie)
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

// Obsługa podstawowych przełączników
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
if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', (e) => {
        fontSize = parseInt(e.target.value);
        document.body.style.fontSize = fontSize + '%';
        fontSizeValue.textContent = fontSize + '%';
        saveSettings();
    });
}

// ===================== NOWE USTAWIENIA =====================

// Elementy nowych ustawień
const dndMode = document.getElementById('dndMode');
const animationsToggle = document.getElementById('animationsToggle');
const accentColorSelect = document.getElementById('accentColorSelect');
const bgMusicToggle = document.getElementById('bgMusicToggle');
const musicVolume = document.getElementById('musicVolume');
const musicVolumeValue = document.getElementById('musicVolumeValue');
const musicVolumeItem = document.getElementById('musicVolumeItem');
const dataSaverToggle = document.getElementById('dataSaverToggle');
const showShortcutsBtn = document.getElementById('showShortcutsBtn');
const autoDarkModeToggle = document.getElementById('autoDarkModeToggle');
const notificationStyleSelect = document.getElementById('notificationStyleSelect');
const cursorEffectSelect = document.getElementById('cursorEffectSelect');

// Zmienne dla nowych ustawień
let bgMusic = null;
let dndTimer = null;
let autoDarkInterval = null;
let notificationStyle = 'toast';

// ========== TRYB NIE PRZESZKADZAĆ ==========
function setDNDMode(minutes) {
    if (dndTimer) clearTimeout(dndTimer);
    
    if (minutes > 0) {
        notificationsEnabled = false;
        if (notifToggle) notifToggle.checked = false;
        showNotification('🔇 Tryb Nie przeszkadzać', `Powiadomienia wyłączone na ${minutes} minut.`, 'info');
        
        dndTimer = setTimeout(() => {
            notificationsEnabled = true;
            if (notifToggle) notifToggle.checked = true;
            showNotification('🔔 Tryb Nie przeszkadzać wyłączony', 'Powiadomienia zostały włączone.', 'success');
            dndTimer = null;
        }, minutes * 60 * 1000);
    } else if (dndTimer) {
        clearTimeout(dndTimer);
        dndTimer = null;
    }
    saveSettings();
}

if (dndMode) {
    dndMode.addEventListener('change', (e) => {
        const minutes = parseInt(e.target.value);
        setDNDMode(minutes);
    });
}

// ========== ANIMACJE STRONY ==========
function setAnimations(enabled) {
    const sections = document.querySelectorAll('.section, .hero, .feature-card, .server-card');
    if (enabled) {
        sections.forEach(s => s.style.animation = '');
        document.body.classList.remove('animations-off');
    } else {
        sections.forEach(s => s.style.animation = 'none');
        document.body.classList.add('animations-off');
    }
}

if (animationsToggle) {
    animationsToggle.addEventListener('change', (e) => {
        setAnimations(e.target.checked);
        saveSettings();
    });
}

// ========== KOLOR AKCENTU ==========
function setAccentColor(color) {
    const root = document.documentElement;
    const colors = {
        default: { primary: '#ff6b6b', secondary: '#4ecdc4' },
        green: { primary: '#10b981', secondary: '#34d399' },
        pink: { primary: '#ec489a', secondary: '#f472b6' },
        purple: { primary: '#8b5cf6', secondary: '#a78bfa' },
        orange: { primary: '#f97316', secondary: '#fb923c' },
        rainbow: { primary: 'rainbow', secondary: 'rainbow' }
    };
    
    const selected = colors[color];
    if (color === 'rainbow') {
        document.body.classList.add('rainbow-theme');
        document.querySelectorAll('.btn-primary, .btn-discord, .admin-tab.active').forEach(btn => {
            btn.classList.add('rainbow-btn');
        });
    } else {
        document.body.classList.remove('rainbow-theme');
        document.querySelectorAll('.rainbow-btn').forEach(btn => btn.classList.remove('rainbow-btn'));
        root.style.setProperty('--primary', selected.primary);
        root.style.setProperty('--secondary', selected.secondary);
    }
    saveSettings();
}

if (accentColorSelect) {
    accentColorSelect.addEventListener('change', (e) => {
        setAccentColor(e.target.value);
    });
}

// ========== MUZYKA W TLE ==========
function initBackgroundMusic() {
    if (!bgMusic) {
        bgMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        bgMusic.loop = true;
        bgMusic.volume = (musicVolume ? musicVolume.value : 30) / 100;
    }
}

if (bgMusicToggle) {
    bgMusicToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            initBackgroundMusic();
            bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
            if (musicVolumeItem) musicVolumeItem.style.display = 'flex';
        } else {
            if (bgMusic) {
                bgMusic.pause();
            }
            if (musicVolumeItem) musicVolumeItem.style.display = 'none';
        }
        saveSettings();
    });
}

if (musicVolume) {
    musicVolume.addEventListener('input', (e) => {
        const vol = e.target.value;
        if (musicVolumeValue) musicVolumeValue.textContent = vol + '%';
        if (bgMusic) bgMusic.volume = vol / 100;
        saveSettings();
    });
}

// ========== TRYB OSZCZĘDZANIA DANYCH ==========
function setDataSaver(enabled) {
    if (enabled) {
        document.body.classList.add('data-saver-active');
    } else {
        document.body.classList.remove('data-saver-active');
    }
}

if (dataSaverToggle) {
    dataSaverToggle.addEventListener('change', (e) => {
        setDataSaver(e.target.checked);
        saveSettings();
    });
}

// ========== SKRÓTY KLAWISZOWE ==========
function showShortcutsModal() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
        <h4>⌨️ Skróty klawiszowe</h4>
        <ul>
            <li><span>📋 Skopiuj IP</span><span class="shortcut-key">Ctrl + K</span></li>
            <li><span>💬 Otwórz Discord</span><span class="shortcut-key">Ctrl + D</span></li>
            <li><span>⚙️ Otwórz ustawienia</span><span class="shortcut-key">Ctrl + ,</span></li>
            <li><span>❌ Zamknij panel</span><span class="shortcut-key">Esc</span></li>
        </ul>
        <button class="close-shortcuts">Zamknij</button>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-shortcuts').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

if (showShortcutsBtn) {
    showShortcutsBtn.addEventListener('click', showShortcutsModal);
}

// Obsługa skrótów klawiszowych
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        copyIP();
    }
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        joinDiscord();
    }
    if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        if (settingsPanel) settingsPanel.classList.toggle('active');
    }
    if (e.key === 'Escape') {
        if (settingsPanel && settingsPanel.classList.contains('active')) {
            settingsPanel.classList.remove('active');
        }
    }
});

// ========== AUTOMATYCZNY TRYB CIEMNY ==========
function checkAutoDarkMode() {
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 7;
    
    if (autoDarkModeToggle && autoDarkModeToggle.checked) {
        if (isNight && currentTheme !== 'dark') {
            setTheme('dark');
        } else if (!isNight && currentTheme !== 'light') {
            setTheme('light');
        }
    }
}

if (autoDarkModeToggle) {
    autoDarkModeToggle.addEventListener('change', () => {
        if (autoDarkModeToggle.checked) {
            checkAutoDarkMode();
            if (autoDarkInterval) clearInterval(autoDarkInterval);
            autoDarkInterval = setInterval(checkAutoDarkMode, 60000);
        } else {
            if (autoDarkInterval) clearInterval(autoDarkInterval);
        }
        saveSettings();
    });
}

// ========== RODZAJE POWIADOMIEŃ ==========
function showNotificationStyled(title, message, type = 'info') {
    if (!notificationsEnabled) return;
    
    const style = notificationStyle;
    
    if (style === 'soundonly') {
        playNotificationSound();
        return;
    }
    
    if (style === 'modal') {
        const modal = document.createElement('div');
        modal.className = 'notification-modal';
        modal.innerHTML = `
            <strong style="color: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#ffd93d'}">${escapeHtml(title)}</strong>
            <br><small>${escapeHtml(message)}</small>
            <br><button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; background: #ff6b6b; border: none; border-radius: 15px; padding: 0.2rem 0.8rem; cursor: pointer;">OK</button>
        `;
        document.body.appendChild(modal);
        playNotificationSound();
        setTimeout(() => modal.remove(), 5000);
    } else {
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
}

if (notificationStyleSelect) {
    notificationStyleSelect.addEventListener('change', (e) => {
        notificationStyle = e.target.value;
        saveSettings();
    });
}

// Zastąp starą showNotification nową
window.showNotification = showNotificationStyled;

// ========== EFEKTY KURSORA ==========
function initCursorEffect(type) {
    const oldRing = document.querySelector('.cursor-ring');
    if (oldRing) oldRing.remove();
    
    if (type === 'none') return;
    
    const ring = document.createElement('div');
    ring.className = `cursor-ring cursor-${type}`;
    document.body.appendChild(ring);
    
    const mouseMoveHandler = (e) => {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    
    if (type === 'sparks') {
        const sparkHandler = (e) => {
            const spark = document.createElement('div');
            spark.className = 'cursor-spark';
            spark.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 3px;
                height: 3px;
                background: #ff6b6b;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                animation: sparkFade 0.5s ease-out forwards;
            `;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 500);
        };
        document.addEventListener('mousemove', sparkHandler);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkFade {
                to {
                    opacity: 0;
                    transform: scale(2);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    if (type === 'ring') {
        const mouseOverHandler = (e) => {
            if (e.target.closest('button')) {
                ring.classList.add('hover');
            }
        };
        const mouseOutHandler = (e) => {
            if (e.target.closest('button')) {
                ring.classList.remove('hover');
            }
        };
        document.addEventListener('mouseover', mouseOverHandler);
        document.addEventListener('mouseout', mouseOutHandler);
    }
}

if (cursorEffectSelect) {
    cursorEffectSelect.addEventListener('change', (e) => {
        initCursorEffect(e.target.value);
        saveSettings();
    });
}

// ========== ŁADOWANIE NOWYCH USTAWIEN Z localStorage ==========
function loadNewSettings() {
    // Animacje
    const savedAnimations = localStorage.getItem('animationsEnabled');
    if (savedAnimations !== null && animationsToggle) {
        animationsToggle.checked = savedAnimations === 'true';
        setAnimations(animationsToggle.checked);
    }
    
    // Kolor akcentu
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor && accentColorSelect) {
        accentColorSelect.value = savedColor;
        setAccentColor(savedColor);
    }
    
    // Muzyka
    const savedMusic = localStorage.getItem('bgMusic');
    if (savedMusic === 'true' && bgMusicToggle) {
        bgMusicToggle.checked = true;
        if (musicVolumeItem) musicVolumeItem.style.display = 'flex';
        initBackgroundMusic();
        setTimeout(() => bgMusic?.play().catch(e => console.log('Autoplay blocked')), 1000);
    }
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume && musicVolume) {
        musicVolume.value = savedVolume;
        if (musicVolumeValue) musicVolumeValue.textContent = savedVolume + '%';
        if (bgMusic) bgMusic.volume = savedVolume / 100;
    }
    
    // Oszczędzanie danych
    const savedDataSaver = localStorage.getItem('dataSaver');
    if (savedDataSaver !== null && dataSaverToggle) {
        dataSaverToggle.checked = savedDataSaver === 'true';
        setDataSaver(dataSaverToggle.checked);
    }
    
    // Auto dark mode
    const savedAutoDark = localStorage.getItem('autoDarkMode');
    if (savedAutoDark !== null && autoDarkModeToggle) {
        autoDarkModeToggle.checked = savedAutoDark === 'true';
        if (autoDarkModeToggle.checked) checkAutoDarkMode();
    }
    
    // Styl powiadomień
    const savedNotifStyle = localStorage.getItem('notificationStyle');
    if (savedNotifStyle && notificationStyleSelect) {
        notificationStyleSelect.value = savedNotifStyle;
        notificationStyle = savedNotifStyle;
    }
    
    // Efekt kursora
    const savedCursorEffect = localStorage.getItem('cursorEffect');
    if (savedCursorEffect && cursorEffectSelect) {
        cursorEffectSelect.value = savedCursorEffect;
        initCursorEffect(savedCursorEffect);
    }
}

// Nadpisz saveSettings aby zapisywać nowe ustawienia
const originalSaveSettings = saveSettings;
saveSettings = function() {
    originalSaveSettings();
    if (animationsToggle) localStorage.setItem('animationsEnabled', animationsToggle.checked);
    if (accentColorSelect) localStorage.setItem('accentColor', accentColorSelect.value);
    if (bgMusicToggle) localStorage.setItem('bgMusic', bgMusicToggle.checked);
    if (musicVolume) localStorage.setItem('musicVolume', musicVolume.value);
    if (dataSaverToggle) localStorage.setItem('dataSaver', dataSaverToggle.checked);
    if (autoDarkModeToggle) localStorage.setItem('autoDarkMode', autoDarkModeToggle.checked);
    if (notificationStyleSelect) localStorage.setItem('notificationStyle', notificationStyleSelect.value);
    if (cursorEffectSelect) localStorage.setItem('cursorEffect', cursorEffectSelect.value);
};

// ===================== INICJALIZACJA =====================

async function init() {
    console.log('🚀 OdpalamyCheaterow - Inicjalizacja...');
    createParticles();
    await loadRules();
    await loadChangelog();
    observeSections();
    loadSettings();
    loadNewSettings();
    
    setTimeout(() => {
        if (notificationsEnabled) {
            showNotification('🟢 Serwer online', 'Witaj na OdpalamyCheaterow! Miłej gry.', 'info');
        }
    }, 3000);
    
    console.log('✅ Strona gotowa!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('error', function(e) {
    console.error('Błąd:', e.error);
});
