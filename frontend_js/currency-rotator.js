/**
 * Currency Rotator
 * Animates currency conversions from THB to other currencies
 */

// Exchange rates (as of October 2025)
const EXCHANGE_RATES = {
    THB_TO_EUR: 0.026,  // 1 THB = 0.026 EUR
    THB_TO_USD: 0.029,  // 1 THB = 0.029 USD  
    THB_TO_GBP: 0.022,  // 1 THB = 0.022 GBP
    THB_TO_CNY: 0.21    // 1 THB = 0.21 CNY
};

// Base price in THB
const BASE_PRICE_THB = 100;

// Currencies to rotate through
const CURRENCIES = [
    {
        code: 'EUR',
        symbol: '€',
        rate: EXCHANGE_RATES.THB_TO_EUR,
        name: 'Euro'
    },
    {
        code: 'USD',
        symbol: '$',
        rate: EXCHANGE_RATES.THB_TO_USD,
        name: 'US Dollar'
    },
    {
        code: 'GBP',
        symbol: '£',
        rate: EXCHANGE_RATES.THB_TO_GBP,
        name: 'British Pound'
    },
    {
        code: 'CNY',
        symbol: '¥',
        rate: EXCHANGE_RATES.THB_TO_CNY,
        name: 'Chinese Yuan'
    }
];

let currentCurrencyIndex = 0;

/**
 * Calculate price in a specific currency
 */
function calculatePrice(currency) {
    const price = BASE_PRICE_THB * currency.rate;
    return price.toFixed(2);
}

/**
 * Format currency display
 */
function formatCurrency(currency) {
    const price = calculatePrice(currency);
    return `(~${currency.symbol}${price})`;
}

/**
 * Update the currency display with smooth transition
 */
function updateCurrency() {
    const element = document.getElementById('currencyRotation');
    if (!element) return;
    
    // Fade out
    element.classList.add('fade-out');
    
    // Wait for fade out, then change text and fade in
    setTimeout(() => {
        const currency = CURRENCIES[currentCurrencyIndex];
        element.textContent = formatCurrency(currency);
        
        // Move to next currency
        currentCurrencyIndex = (currentCurrencyIndex + 1) % CURRENCIES.length;
        
        // Fade in
        setTimeout(() => {
            element.classList.remove('fade-out');
        }, 50);
    }, 500); // Match CSS transition duration
}

/**
 * Initialize currency rotation
 */
function initCurrencyRotation() {
    const element = document.getElementById('currencyRotation');
    if (!element) return;
    
    // Set initial currency
    const currency = CURRENCIES[0];
    element.textContent = formatCurrency(currency);
    currentCurrencyIndex = 1;
    
    // Rotate every 3 seconds
    setInterval(updateCurrency, 3000);
}

// Start rotation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrencyRotation);
} else {
    initCurrencyRotation();
}

