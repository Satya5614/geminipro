document.addEventListener('DOMContentLoaded', () => {
    // Session ID Generation
    document.getElementById('session-id').textContent = 'SES-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 3D Tilt Effect
    const cards = document.querySelectorAll('.card-3d');
    const container = document.querySelector('.scene-3d');

    if (window.matchMedia("(min-width: 1025px)").matches) {
        container.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            cards.forEach(card => {
                // Add slight offset for parallax between cards
                const speed = card.dataset.domain.includes('3') ? 1.2 : 1;
                card.style.transform = `rotateY(${xAxis * speed}deg) rotateX(${yAxis * speed}deg)`;
            });
        });

        container.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.transform = `rotateY(0deg) rotateX(0deg)`;
            });
        });
    }

    // Selection Logic
    const selectedDomainsInput = document.getElementById('selected-domains-input');
    const selectionDisplay = document.getElementById('selection-display');
    const selectedList = document.querySelector('.selected-list');
    const offerForm = document.getElementById('offer-form');

    let selectedDomains = new Set();

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const domain = card.dataset.domain;

            if (selectedDomains.has(domain)) {
                selectedDomains.delete(domain);
                card.classList.remove('selected');
                card.querySelector('.select-indicator').textContent = 'SELECT';
            } else {
                selectedDomains.add(domain);
                card.classList.add('selected');
                card.querySelector('.select-indicator').textContent = 'SELECTED';
            }

            updateUI();
        });
    });

    function updateUI() {
        // Update hidden input
        const domainsArray = Array.from(selectedDomains);
        selectedDomainsInput.value = domainsArray.join(', ');

        // Update Visual Display
        selectedList.innerHTML = '';

        if (domainsArray.length === 0) {
            selectionDisplay.classList.add('empty');
        } else {
            selectionDisplay.classList.remove('empty');
            domainsArray.forEach(domain => {
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.textContent = domain;
                selectedList.appendChild(tag);
            });
        }
    }

    // Form Submission
    offerForm.addEventListener('submit', (e) => {
        if (selectedDomains.size === 0) {
            e.preventDefault();
            alert('ERROR: NO ASSET SELECTED. PLEASE SELECT A DOMAIN.');
            return;
        }

        if (offerForm.getAttribute('action') === '#') {
            e.preventDefault();
            alert('DEMO MODE: Form submission simulated.\n\nConnect to backend to finalize.');
        }
    });
});
