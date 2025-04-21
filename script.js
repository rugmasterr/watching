document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy-button');
    const contractAddress = document.getElementById('contract-address');
    const copyFeedback = document.getElementById('copy-feedback');

    // --- Copy to Clipboard Functionality ---
    if (copyButton && contractAddress && copyFeedback) {
        copyButton.addEventListener('click', () => {
            const addressText = contractAddress.innerText;
            navigator.clipboard.writeText(addressText).then(() => {
                // Success feedback
                showFeedback('Copied!');
            }).catch(err => {
                // Error feedback (fallback for older browsers/permissions issues)
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = addressText;
                    textArea.style.position = 'fixed'; // Prevent scrolling to bottom
                    textArea.style.top = '0';
                    textArea.style.left = '0';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showFeedback('Copied!');
                } catch (fallbackErr) {
                    showFeedback('Failed to copy');
                    console.error('Failed to copy text: ', err);
                    console.error('Fallback copy failed: ', fallbackErr);
                }
            });
        });
    }

    function showFeedback(message) {
        if (!copyFeedback) return;
        copyFeedback.textContent = message;
        copyFeedback.classList.add('show');
        // Hide feedback after a delay
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 1500);
    }

    // --- Subtle Creepy Effects ---
    const logo = document.querySelector('.logo');
    const hint = document.querySelector('.hint');

    // Optional: Random character flicker in hint text
    function flickerHint() {
        if (!hint) return;
        const originalText = hint.textContent;
        const chars = originalText.split('');
        const flickerIndex = Math.floor(Math.random() * chars.length);
        const originalChar = chars[flickerIndex];
        const glitchChars = '█▓▒░'; // Block characters for glitch effect

        // Only flicker non-space characters
        if (originalChar !== ' ') {
            chars[flickerIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            hint.textContent = chars.join('');

            // Revert after a short delay
            setTimeout(() => {
                // Ensure the hint element still exists
                const currentHint = document.querySelector('.hint');
                if (currentHint && currentHint.textContent === chars.join('')) { // Check if text hasn't changed elsewhere
                   currentHint.textContent = originalText;
                }
            }, Math.random() * 80 + 50); // 50-130ms duration
        }

        // Schedule next flicker
        setTimeout(flickerHint, Math.random() * 5000 + 3000); // Every 3-8 seconds
    }

    // Start hint flickering after initial delay
    setTimeout(flickerHint, 4000);

    // Optional: Slight random jitter on logo hover (less intense than animation)
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
        });
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'translate(0, 0)';
        });
    }

});

