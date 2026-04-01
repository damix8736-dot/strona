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
    navigator.clipboard.writeText(SERVER_IP).then(() => {
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
        showNotification('📋 Skopiowano!', `IP ${SERVER_IP} zostało skopiowane.`, 'success');
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

let notificationsEnabled = true;
let soundEnabled = true;
let currentTheme = 'dark';
let fontSize = 100;

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

// ===================== INICJALIZACJA =====================

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('error', function(e) {
    console.error('Błąd:', e.error);
});
