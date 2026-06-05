// Initialize Feather Icons
feather.replace();

// Data for the Timeline Marcos
const marcosData = [
    {
        id: '01',
        title: 'O que esperar do recém-nascido',
        desc: 'O RN (0 a 28 dias) não é uma "tábula rasa": ele já chega com redes funcionais organizadas. É altamente sensível a experiências: toque, voz e olhar moldam a arquitetura cerebral de forma duradoura.'
    },
    {
        id: '02',
        title: 'Crescimento e plasticidade',
        desc: 'O cérebro cresce cerca de 1% por dia nos primeiros meses, formando mais de 1 milhão de novas conexões neurais por segundo. Alta plasticidade significa que as experiências moldam o cérebro rapidamente.'
    },
    {
        id: '03',
        title: 'Sono e ciclos',
        desc: 'O bebê dorme de 16 a 18 horas por dia, em ciclos de 2 a 4 horas. O ritmo circadiano (dia/noite) está se formando. Luz natural e vozes de dia ajudam a organizar esse ritmo.'
    },
    {
        id: '04',
        title: 'Visão e processamento',
        desc: 'A visão é limitada: o bebê enxerga melhor a 20-30 cm de distância, preferindo contrastes e rostos humanos. Bases para organizar o mundo visual já estão se formando rapidamente.'
    },
    {
        id: '05',
        title: 'Audição e linguagem',
        desc: 'A audição é muito desenvolvida: reconhece a voz da mãe desde a gestação. A exposição à fala dos pais estimula diretamente áreas de linguagem e cognição futura.'
    },
    {
        id: '06',
        title: 'Motricidade e reflexos',
        desc: 'Movimentos são predominantemente reflexos (Moro, sucção, preensão). O controle de cabeça é mínimo. O "tummy time" (de bruços, supervisionado) ajuda a fortalecer a musculatura desde cedo.'
    },
    {
        id: '07',
        title: 'Emocional e social',
        desc: 'O contato pele a pele, olhar e voz carinhosa ativam o sistema de recompensa e regulam o estresse (cortisol). As interações precoces constroem conexões fundamentais para a regulação emocional.'
    },
    {
        id: '08',
        title: 'Marcos típicos do 1º mês',
        desc: 'No final do mês, observe: fixação breve de olhar em rostos, resposta a sons, momentos de alerta calmo aumentando, e início de sorrisos sociais (em torno de 4 a 6 semanas).'
    },
    {
        id: '09',
        title: 'Fatores que mais influenciam',
        desc: 'O mais importante: seu bebê precisa de presença, carinho e atenção. Interações afetivas e um ambiente responsivo fortalecem sinapses, enquanto o estresse crônico pode alterá-las.'
    }
];

// DOM Elements
const timelineTrack = document.getElementById('timeline-track');
const timelineTitle = document.getElementById('td-title');
const timelineDesc = document.getElementById('td-desc');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initialize Timeline
function initTimeline() {
    marcosData.forEach((marco, index) => {
        const item = document.createElement('div');
        item.className = `timeline-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="chapter-num">${marco.id}</div>
            <h4>${marco.title}</h4>
        `;
        
        item.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
            // Add active class to clicked
            item.classList.add('active');
            // Update display
            updateTimelineDisplay(marco);
            
            // Scroll item into view gently
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        
        timelineTrack.appendChild(item);
    });
    
    // Set initial content
    if (marcosData.length > 0) {
        updateTimelineDisplay(marcosData[0]);
    }
}

function updateTimelineDisplay(marco) {
    // Add subtle fade out/in effect
    const display = document.getElementById('timeline-display');
    display.style.opacity = '0';
    
    setTimeout(() => {
        timelineTitle.textContent = `${marco.id}. ${marco.title}`;
        timelineDesc.textContent = marco.desc;
        display.style.opacity = '1';
    }, 200);
}

// Initialize Tabs
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked button
            btn.classList.add('active');
            
            // Show corresponding pane
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Intersection Observer for Fade-in Animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Run initializers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    initTabs();
    initAnimations();
    initChecklist();
    initMoodTracker();
    initBreathingWidget();
    
    // Set initial visible state for elements already in viewport
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

// --- INTERACTIVE ACTIVITIES LOGIC ---

// 1. Daily Checklist
const checklistItems = [
    { id: 'chk-1', text: 'Tummy time supervisionado (1 a 3 min)' },
    { id: 'chk-2', text: 'Conversamos ou cantamos juntos' },
    { id: 'chk-3', text: 'Contato pele a pele hoje' },
    { id: 'chk-4', text: 'Respondi aos sinais do bebê' },
    { id: 'chk-5', text: 'Lembrei de beber água' }
];

function initChecklist() {
    const container = document.getElementById('daily-checklist');
    const resetBtn = document.getElementById('reset-checklist');
    
    // Load from local storage
    const savedState = JSON.parse(localStorage.getItem('creSerChecklist')) || {};

    checklistItems.forEach(item => {
        const isChecked = savedState[item.id] ? 'checked' : '';
        const label = document.createElement('label');
        label.className = 'checklist-item';
        label.innerHTML = `
            <input type="checkbox" id="${item.id}" ${isChecked}>
            <span>${item.text}</span>
        `;
        
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', (e) => {
            savedState[item.id] = e.target.checked;
            localStorage.setItem('creSerChecklist', JSON.stringify(savedState));
        });
        
        container.appendChild(label);
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('creSerChecklist');
        container.querySelectorAll('input').forEach(input => input.checked = false);
    });
}

// 2. Mood Tracker
const moodMessages = {
    'calma': 'Que ótimo! Aproveite esse estado de presença para se conectar com seu bebê.',
    'cansada': 'O cansaço é real. Tente dormir quando o bebê dormir. Peça ajuda, você merece.',
    'sobrecarregada': 'Respire fundo. Não exija perfeição de si mesma. Você está fazendo um ótimo trabalho.',
    'feliz': 'Guarde esse sentimento! As pequenas conquistas do dia a dia são o que mais importam.',
    'chorosa': 'O baby blues é comum. Está tudo bem chorar. Acolha suas emoções e procure conversar com alguém de confiança.'
};

function initMoodTracker() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const responseBox = document.getElementById('mood-response');

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mood = btn.getAttribute('data-mood');
            responseBox.textContent = moodMessages[mood];
            responseBox.classList.add('visible');
        });
    });
}

// 3. Breathing Widget
function initBreathingWidget() {
    const circle = document.getElementById('b-circle');
    const text = document.getElementById('b-text');
    let isBreathing = false;
    let breathInterval;

    function breatheCycle() {
        text.textContent = "Inspire...";
        setTimeout(() => {
            if(!isBreathing) return;
            text.textContent = "Segure...";
            setTimeout(() => {
                if(!isBreathing) return;
                text.textContent = "Expire...";
            }, 1000); // Hold for 1s
        }, 3000); // Inspire for 3s
    }

    circle.addEventListener('click', () => {
        if (!isBreathing) {
            isBreathing = true;
            circle.classList.add('breathing');
            breatheCycle();
            breathInterval = setInterval(breatheCycle, 8000); // 8s total cycle (4s in/hold, 4s out)
        } else {
            isBreathing = false;
            circle.classList.remove('breathing');
            clearInterval(breathInterval);
            text.textContent = "Iniciar";
        }
    });
}
