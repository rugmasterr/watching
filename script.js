document.addEventListener('DOMContentLoaded', () => {
    // --- References ---
    const logo = document.querySelector('.logo');
    const hint = document.querySelector('.hint');
    const walletAddress = document.getElementById('wallet-address');
    const balanceElement = document.getElementById('wallet-balance');

    // --- Solana Connection Setup ---
    // Using Helius RPC endpoint
    const RPC_ENDPOINT = 'https://gabriella-2ovc8x-fast-mainnet.helius-rpc.com';
    let connection;
    
    function initializeConnection() {
        try {
            connection = new solanaWeb3.Connection(RPC_ENDPOINT, {
                commitment: 'confirmed',
                confirmTransactionInitialTimeout: 60000
            });
            console.log('Connected to Helius RPC endpoint');
        } catch (error) {
            console.error('Failed to initialize Solana connection:', error);
            balanceElement.textContent = 'Failed to initialize connection';
            return false;
        }
        return true;
    }

    if (!initializeConnection()) {
        return;
    }

    const LAMPORTS_PER_SOL = 1000000000;

    // Function to update wallet balance
    async function updateWalletBalance() {
        try {
            if (!walletAddress || !walletAddress.textContent) {
                balanceElement.textContent = 'Wallet address not set';
                return;
            }

            const publicKey = new solanaWeb3.PublicKey(walletAddress.textContent.trim());
            const balance = await connection.getBalance(publicKey);
            const solBalance = balance / LAMPORTS_PER_SOL;
            balanceElement.textContent = `${solBalance.toFixed(4)} SOL`;
        } catch (error) {
            console.error('Error fetching balance:', error);
            
            if (error.message.includes('Invalid public key')) {
                balanceElement.textContent = 'Invalid wallet address';
            } else if (error.message.includes('Network request failed')) {
                balanceElement.textContent = 'Network error - retrying...';
            } else {
                balanceElement.textContent = 'Error loading balance';
            }
        }
    }

    // Set up balance update interval with exponential backoff on error
    let updateInterval = 5000; // Start with 5 seconds
    const maxInterval = 30000; // Max 30 seconds

    async function updateBalanceWithBackoff() {
        try {
            await updateWalletBalance();
            // If successful, reset interval to 5 seconds
            updateInterval = 5000;
        } catch (error) {
            // If error, increase interval up to max
            updateInterval = Math.min(updateInterval * 1.5, maxInterval);
        }
        setTimeout(updateBalanceWithBackoff, updateInterval);
    }

    // Start the update cycle
    updateBalanceWithBackoff();

    // --- Generic Copy Functionality ---
    function setupCopyButton(buttonId, textElementId, feedbackElementId) {
        const copyButton = document.getElementById(buttonId);
        const textElement = document.getElementById(textElementId);
        const feedbackElement = document.getElementById(feedbackElementId);

        if (copyButton && textElement && feedbackElement) {
            copyButton.addEventListener('click', () => {
                const textToCopy = textElement.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showFeedback(feedbackElement, 'Copied!');
                }).catch(err => {
                    // Fallback for older browsers/permissions issues
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = textToCopy;
                        textArea.style.position = 'fixed';
                        textArea.style.top = '0';
                        textArea.style.left = '0';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showFeedback(feedbackElement, 'Copied!');
                    } catch (fallbackErr) {
                        showFeedback(feedbackElement, 'Failed to copy');
                        console.error('Failed to copy text: ', err);
                        console.error('Fallback copy failed: ', fallbackErr);
                    }
                });
            });
        } else {
            console.warn(`Could not find all elements for copy functionality: ${buttonId}, ${textElementId}, ${feedbackElementId}`);
        }
    }

    function showFeedback(feedbackElement, message) {
        if (!feedbackElement) return;
        feedbackElement.textContent = message;
        feedbackElement.classList.add('show');
        // Hide feedback after a delay
        setTimeout(() => {
            feedbackElement.classList.remove('show');
        }, 1500);
    }

    // Setup copy buttons
    setupCopyButton('copy-button', 'contract-address', 'copy-feedback');
    setupCopyButton('copy-wallet-button', 'wallet-address', 'wallet-copy-feedback');


    // --- Subtle Creepy Effects ---

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