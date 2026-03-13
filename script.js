document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. SAUDAÇÃO DINÂMICA ---
    function setDynamicGreeting() {
        const hour = new Date().getHours();
        let greeting = hour >= 5 && hour < 12 ? "Bom dia" : hour >= 12 && hour < 19 ? "Boa tarde" : "Boa noite";
        const el = document.getElementById('dynamic-greeting');
        if (el) el.innerText = greeting + ",";
    }
    setDynamicGreeting();

    // --- 1. HAPTIC FEEDBACK (Vibração) ---
    const triggerHaptic = (pattern = 15) => {
        if ('vibrate' in navigator) navigator.vibrate(pattern);
    };

    document.querySelectorAll('a, button, .hover-copy, .qr-trigger').forEach(el => {
        el.addEventListener('click', () => triggerHaptic(20));
    });

    // --- 2. GESTÃO DO SPLASH SCREEN E ANIMAÇÕES ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if(splash) splash.classList.add('hidden');
            
            setTimeout(() => {
                document.querySelectorAll('.fade-up, .reveal-blur').forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), i * 120);
                });
            }, 300);
        }, 1500);
    });

    // --- 3. EFEITO SPOTLIGHT ---
    const contentBox = document.querySelector('.spotlight-target');
    if (contentBox) {
        contentBox.addEventListener('mousemove', (e) => {
            const rect = contentBox.getBoundingClientRect();
            contentBox.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            contentBox.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    }

    // --- 4. RIPPLE EFFECT ---
    document.querySelectorAll('.ripple-effect').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX ? e.clientX - e.target.getBoundingClientRect().left : e.target.offsetWidth / 2;
            let y = e.clientY ? e.clientY - e.target.getBoundingClientRect().top : e.target.offsetHeight / 2;
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px'; ripples.style.top = y + 'px'; ripples.classList.add('ripple');
            this.appendChild(ripples);
            setTimeout(() => ripples.remove(), 600);
        });
    });

    // --- 5. ALTERNÂNCIA DE TEMA (DARK/LIGHT MODE) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Verifica se o utilizador já escolheu um tema antes, ou usa o do sistema por padrão
        const currentTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Se já tinha escolhido escuro, ou se é a primeira vez e o telemóvel está escuro
        if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        // Ação do clique no botão
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 6. PARTICLES.JS (Rede Neuronal) ---
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 45, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": true },
                "size": { "value": 2.5, "random": true },
                "line_linked": {
                    "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.2, "width": 1
                },
                "move": {
                    "enable": true, "speed": 1.5, // Movimento lento (calma)
                    "direction": "none", "random": true, "straight": false,
                    "out_mode": "out", "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" }, // Linhas ligam-se ao rato
                    "onclick": { "enable": true, "mode": "push" }, // Clique cria novos pontos
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.5 } },
                    "push": { "particles_nb": 3 }
                }
            },
            "retina_detect": true
        });
    }

    // --- 7. POP-UP DE INTENÇÃO DE SAÍDA / INATIVIDADE ---
    let exitPopupShown = sessionStorage.getItem('exitPopupShown');
    
    function openExitPopup() {
        if (!exitPopupShown) {
            document.getElementById('exitBackdrop').classList.add('show');
            document.getElementById('exitPopup').classList.add('show');
            sessionStorage.setItem('exitPopupShown', 'true'); // Garante que só aparece 1x por visita
            exitPopupShown = true;
            if ('vibrate' in navigator) navigator.vibrate(20);
        }
    }
    
    // Função para fechar acessível globalmente
    window.closeExitPopup = function() {
        document.getElementById('exitBackdrop').classList.remove('show');
        document.getElementById('exitPopup').classList.remove('show');
    };

    // Detetar se o rato sai pela parte de cima do ecrã (Desktop)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) { openExitPopup(); }
    });

    // Detetar inatividade (Mobile e Desktop) - Se a pessoa ficar 40 segundos sem fechar
    setTimeout(() => { openExitPopup(); }, 40000); 

});

// --- FUNÇÕES DE NEGÓCIO ---

function copyText(texto, msg) {
    navigator.clipboard.writeText(texto).then(() => showToast(msg)).catch(err => console.error(err));
}

function shareCard() {
    if (navigator.share) {
        navigator.share({
            title: 'Sérgio Cardoso | Psicólogo Clínico',
            text: 'Conheça o cartão digital do Psicólogo Sérgio Cardoso:',
            url: window.location.href
        });
    } else {
        copyText(window.location.href, "Link copiado!");
    }
}

/**
 * vCARD PREMIUM: Guarda o contacto completo com links e notas.
 */
function downloadVCard() {
    const info = {
        name: "Sérgio Cardoso",
        title: "Psicólogo Clínico",
        phone: "+5512982651845",
        email: "sergiohacardoso@gmail.com",
        url: window.location.href,
        insta: "https://www.instagram.com/sergiohacardoso",
        note: "CRP 08/IS-625 - Atendimento especializado online."
    };

    const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${info.name}`,
        `N:Cardoso;Sérgio;;;`,
        `ORG:${info.title}`,
        `TITLE:${info.title}`,
        `TEL;TYPE=CELL;TYPE=VOICE;TYPE=pref:${info.phone}`,
        `EMAIL;TYPE=INTERNET;TYPE=WORK:${info.email}`,
        `URL;TYPE=WORK:${info.url}`,
        `X-SOCIALPROFILE;TYPE=instagram:${info.insta}`,
        `NOTE:${info.note}`,
        "REV:" + new Date().toISOString().replace(/[:.-]/g, ""),
        "END:VCARD"
    ].join("\n");

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.style.display = 'none';
    a.href = url;
    a.download = 'Sergio_Cardoso_Psicologo.vcf';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast("Contato pronto a guardar!");
    }, 100);
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.className = "show";
    setTimeout(() => { toast.className = ""; }, 3000);
}

/**
 * QR CODE INTELIGENTE E DINÂMICO
 */
function openQR() {
    const qrImage = document.getElementById('qrImageElement');
    const currentURL = window.location.href;
    
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentURL)}&margin=10`;
    
    document.getElementById('qrBackdrop').classList.add('show');
    document.getElementById('qrBottomSheet').classList.add('show');
    
    if ('vibrate' in navigator) navigator.vibrate(30);
}

function closeQR() {
    document.getElementById('qrBackdrop').classList.remove('show');
    document.getElementById('qrBottomSheet').classList.remove('show');
}