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
    offerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (selectedDomains.size === 0) {
            alert('ERROR: NO ASSET SELECTED. PLEASE SELECT A DOMAIN.');
            return;
        }

        const submitBtn = offerForm.querySelector('button');
        const btnContent = submitBtn.querySelector('.btn-content');
        const originalText = btnContent.textContent;

        // Loading State
        btnContent.textContent = 'TRANSMITTING...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        // Prepare Data
        const formData = new FormData(offerForm);
        const data = Object.fromEntries(formData.entries());

        // Add selected domains explicitly as an array if needed, or keep as comma-separated string
        // The backend likely expects the fields from the form

        try {
            const response = await fetch('https://www.theagent1.com/webhook/domain-enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Success State
                const modal = document.getElementById('success-modal');
                const txIdDisplay = document.getElementById('tx-id');

                // Generate a fake TXID for effect
                txIdDisplay.textContent = 'TX-' + Math.random().toString(36).substr(2, 12).toUpperCase();

                modal.classList.add('active');

                // Reset form
                offerForm.reset();
                selectedDomains.clear();
                cards.forEach(c => {
                    c.classList.remove('selected');
                    c.querySelector('.select-indicator').textContent = 'SELECT';
                });
                updateUI();

            } else {
                throw new Error('Transmission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('TRANSMISSION ERROR: UNABLE TO REACH SECURE SERVER. PLEASE TRY AGAIN.');
        } finally {
            // Reset Button
            btnContent.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }
    });

    // Modal Close
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('active');
    });
});
