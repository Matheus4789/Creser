// Initialize Feather Icons
feather.replace();

document.addEventListener('DOMContentLoaded', () => {
    initPlanner();
    initCounters();
    initChecklistsTabs();
    initChecklists();
    initMoodTracker();
    initBreathingWidget();
    initAnimations();
});

// --- PLANNER DIÁRIO ---
function initPlanner() {
    const timeInput = document.getElementById('planner-time');
    const typeSelect = document.getElementById('planner-type');
    const addBtn = document.getElementById('add-planner');
    const list = document.getElementById('planner-list');
    
    let plannerItems = JSON.parse(localStorage.getItem('creSerPlanner')) || [];
    
    function renderList() {
        list.innerHTML = '';
        
        // Sort by time
        plannerItems.sort((a, b) => a.time.localeCompare(b.time));
        
        if (plannerItems.length === 0) {
            list.innerHTML = '<li class="empty-state">Nenhum evento registrado hoje. Organize sua rotina!</li>';
            return;
        }

        plannerItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'planner-item';
            
            // Emoji mapping based on type
            const icons = {
                'mamada': '🍼',
                'soneca': '💤',
                'tummy': '🤸',
                'banho': '🛁',
                'outro': '✨'
            };
            
            li.innerHTML = `
                <div class="p-time">${item.time}</div>
                <div class="p-type">${icons[item.type]} ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                <button class="btn-delete" data-index="${index}"><i data-feather="x"></i></button>
            `;
            list.appendChild(li);
        });
        
        feather.replace();
        
        // Add delete listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                plannerItems.splice(idx, 1);
                saveAndRender();
            });
        });
    }

    function saveAndRender() {
        localStorage.setItem('creSerPlanner', JSON.stringify(plannerItems));
        renderList();
    }

    addBtn.addEventListener('click', () => {
        if (!timeInput.value) {
            alert('Por favor, selecione um horário.');
            return;
        }
        plannerItems.push({
            time: timeInput.value,
            type: typeSelect.value
        });
        saveAndRender();
        timeInput.value = '';
    });

    renderList();
}

// --- CONTADORES ---
function initCounters() {
    let counts = JSON.parse(localStorage.getItem('creSerCounters')) || { mamada: 0, fralda: 0 };
    
    const mamadaSpan = document.getElementById('count-mamada');
    const fraldaSpan = document.getElementById('count-fralda');
    
    function updateDisplay() {
        mamadaSpan.textContent = counts.mamada;
        fraldaSpan.textContent = counts.fralda;
        localStorage.setItem('creSerCounters', JSON.stringify(counts));
    }
    
    updateDisplay();
    
    document.getElementById('btn-mamada-plus').addEventListener('click', () => { counts.mamada++; updateDisplay(); });
    document.getElementById('btn-mamada-minus').addEventListener('click', () => { if(counts.mamada > 0) counts.mamada--; updateDisplay(); });
    
    document.getElementById('btn-fralda-plus').addEventListener('click', () => { counts.fralda++; updateDisplay(); });
    document.getElementById('btn-fralda-minus').addEventListener('click', () => { if(counts.fralda > 0) counts.fralda--; updateDisplay(); });

    document.getElementById('reset-counters').addEventListener('click', () => {
        if(confirm('Tem certeza que deseja zerar os contadores de hoje?')) {
            counts = { mamada: 0, fralda: 0 };
            updateDisplay();
        }
    });
}

// --- CHECKLISTS ---
const checklistsData = {
    'checklist-bebe': [
        { id: 'cb-1', text: 'Tummy time supervisionado' },
        { id: 'cb-2', text: 'Banho relaxante' },
        { id: 'cb-3', text: 'Passeio ou luz natural' },
        { id: 'cb-4', text: 'Massagem / Pele a pele' }
    ],
    'checklist-mae': [
        { id: 'cm-1', text: 'Bebi pelo menos 2L de água' },
        { id: 'cm-2', text: 'Fiz uma refeição nutritiva' },
        { id: 'cm-3', text: 'Descansei enquanto o bebê dormia' },
        { id: 'cm-4', text: 'Tomei um banho relaxante' }
    ],
    'checklist-marcos': [
        { id: 'cma-1', text: 'Fixou o olhar por alguns segundos' },
        { id: 'cma-2', text: 'Se acalmou com a minha voz' },
        { id: 'cma-3', text: 'Deu um sorrisinho' },
        { id: 'cma-4', text: 'Segurou meu dedo' }
    ]
};

function initChecklistsTabs() {
    const btns = document.querySelectorAll('.checklist-tabs .tab-btn');
    const panes = document.querySelectorAll('.checklists-section .tab-pane');
    
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });
}

function initChecklists() {
    const savedState = JSON.parse(localStorage.getItem('creSerChecklistsMulti')) || {};

    Object.keys(checklistsData).forEach(listId => {
        const container = document.getElementById(listId);
        if(!container) return;
        
        checklistsData[listId].forEach(item => {
            const isChecked = savedState[item.id] ? 'checked' : '';
            const label = document.createElement('label');
            label.className = 'checklist-item';
            label.innerHTML = `
                <input type="checkbox" id="${item.id}" ${isChecked}>
                <span>${item.text}</span>
            `;
            
            label.querySelector('input').addEventListener('change', (e) => {
                savedState[item.id] = e.target.checked;
                localStorage.setItem('creSerChecklistsMulti', JSON.stringify(savedState));
            });
            
            container.appendChild(label);
        });
    });
}

// --- MOOD TRACKER (Cópia da lógica original) ---
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

// --- BREATHING WIDGET ---
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
            }, 1000);
        }, 3000);
    }

    circle.addEventListener('click', () => {
        if (!isBreathing) {
            isBreathing = true;
            circle.classList.add('breathing');
            breatheCycle();
            breathInterval = setInterval(breatheCycle, 8000);
        } else {
            isBreathing = false;
            circle.classList.remove('breathing');
            clearInterval(breathInterval);
            text.textContent = "Iniciar";
        }
    });
}

function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    setTimeout(() => {
        fadeElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}
