document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const themeSelect = document.getElementById('themeSelect');
    const scientificModeBtn = document.getElementById('scientificMode');
    const standardModeBtn = document.getElementById('standardMode');
    const scientificButtonsContainer = document.getElementById('scientificButtons');
    const display = document.getElementById('display');
    const historyDisplay = document.getElementById('historyDisplay');
    const defaultModeSelect = document.getElementById('defaultModeSelect');
    const decimalPrecisionSelect = document.getElementById('decimalPrecisionSelect');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');

    // --- State Variables ---
    let currentInput = '0';
    let operator = '';
    let previousInput = '';
    let memory = 0;
    let settings = {
        theme: 'light',
        defaultMode: 'standard',
        decimalPrecision: 4,
    };

    // --- Settings Management ---
    const applyTheme = (theme) => {
        console.log(`Applying theme: ${theme}`);
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        if (themeSelect) themeSelect.value = theme;
        settings.theme = theme; // Also update setting state immediately
    };

    const applySettings = () => {
        applyTheme(settings.theme);
        setCalculatorMode(settings.defaultMode === 'scientific');
        if (defaultModeSelect) defaultModeSelect.value = settings.defaultMode;
        if (decimalPrecisionSelect) decimalPrecisionSelect.value = settings.decimalPrecision;
    };

    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
        if (savedSettings) {
            settings = { ...settings, ...savedSettings };
        }
        applySettings();
    };

    const saveSettings = () => {
        // Update settings object from UI before saving
        settings.theme = themeSelect.value;
        settings.defaultMode = defaultModeSelect.value;
        settings.decimalPrecision = decimalPrecisionSelect.value;
        localStorage.setItem('calculatorSettings', JSON.stringify(settings));
        alert('Settings saved!');
        applySettings();
    };

    const resetSettings = () => {
        localStorage.removeItem('calculatorSettings');
        settings = { theme: 'light', defaultMode: 'standard', decimalPrecision: 4 };
        applySettings();
        alert('Settings have been reset.');
    };

    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    if (resetSettingsBtn) resetSettingsBtn.addEventListener('click', resetSettings);
    if (themeSelect) themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));


    // --- Navigation Logic ---
    const navigateTo = (hash) => {
        sections.forEach(s => s.style.display = 'none');
        navLinks.forEach(l => l.classList.remove('active'));
        const targetSection = document.querySelector(hash);
        const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (targetSection) targetSection.style.display = 'flex';
        if (targetLink) targetLink.classList.add('active');
    };

    navLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(e.currentTarget.getAttribute('href'));
    }));
    document.querySelectorAll('a.btn[href="#calculator"], a.btn[href="#settings"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.currentTarget.getAttribute('href'));
        });
    });
    document.querySelectorAll('.back-btn').forEach(btn => btn.addEventListener('click', () => navigateTo('#home')));

    // --- Theme Management (Button in header) ---
    if (themeToggle) themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- Calculator Mode ---
    const setCalculatorMode = (isScientific) => {
        if (scientificButtonsContainer) scientificButtonsContainer.style.display = isScientific ? 'grid' : 'none';
        if (standardModeBtn) standardModeBtn.classList.toggle('active', !isScientific);
        if (scientificModeBtn) scientificModeBtn.classList.toggle('active', isScientific);
    };

    if (scientificModeBtn) scientificModeBtn.addEventListener('click', () => setCalculatorMode(true));
    if (standardModeBtn) standardModeBtn.addEventListener('click', () => setCalculatorMode(false));

    // --- Calculator Core Functions ---
    const updateDisplay = () => {
        display.value = currentInput;
    };

    const appendToDisplay = (value) => {
        if (currentInput === '0' && value !== '.') currentInput = '';
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
        updateDisplay();
    };

    const clearDisplay = () => {
        currentInput = '0';
        previousInput = '';
        operator = '';
        historyDisplay.textContent = '';
        updateDisplay();
    };

    const clearEntry = () => {
        currentInput = '0';
        updateDisplay();
    };

    const backspace = () => {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') currentInput = '0';
        updateDisplay();
    };

    const setOperation = (op) => {
        if (currentInput === '0' && previousInput === '') return;
        if (previousInput !== '' && currentInput !== '0') {
            calculateResult();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '0';
        historyDisplay.textContent = `${previousInput} ${op}`;
    };

    const calculateResult = () => {
        if (previousInput === '' || operator === '') return;
        let result;
        const prev = parseFloat(previousInput);
        const curr = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(curr)) return;

        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/':
                if (curr === 0) { alert("Cannot divide by zero"); return; }
                result = prev / curr;
                break;
            case 'power': result = Math.pow(prev, curr); break;
            default: return;
        }

        historyDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
        const precision = parseInt(settings.decimalPrecision, 10);
        currentInput = String(parseFloat(result.toFixed(precision)));
        operator = '';
        previousInput = '';
        updateDisplay();
    };

    const handleUnaryOperation = (func) => {
        const val = parseFloat(currentInput);
        if(isNaN(val)) return;
        let result;
        historyDisplay.textContent = `${func}(${currentInput}) =`;
        switch(func) {
            case '√': result = Math.sqrt(val); break;
            case 'x²': result = Math.pow(val, 2); break;
            case 'x!':
                if (val < 0 || val % 1 !== 0) { alert("Factorial for non-negative integers only"); return; }
                let fact = 1;
                for (let i = 2; i <= val; i++) fact *= i;
                result = fact;
                break;
            case 'sin': result = Math.sin(val * Math.PI / 180); break;
            case 'cos': result = Math.cos(val * Math.PI / 180); break;
            case 'tan': result = Math.tan(val * Math.PI / 180); break;
            case 'log': result = Math.log10(val); break;
            case '%': result = val / 100; break;
            case '1/x': result = val === 0 ? 'Infinity' : 1 / val; break;
            case '|x|': result = Math.abs(val); break;
            case 'π': currentInput = String(Math.PI); updateDisplay(); return;
        }
        const precision = parseInt(settings.decimalPrecision, 10);
        currentInput = String(parseFloat(result.toFixed(precision)));
        updateDisplay();
    };

    const memoryClear = () => { memory = 0; };
    const memoryRecall = () => { currentInput = String(memory); updateDisplay(); };
    const memoryAdd = () => { memory += parseFloat(currentInput) || 0; };
    const memorySubtract = () => { memory -= parseFloat(currentInput) || 0; };

    // --- Event Delegation ---
    document.querySelector('.calculator-container').addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;
        const btn = e.target.closest('button');
        const btnText = btn.textContent.trim();

        if (btn.classList.contains('number-btn')) appendToDisplay(btnText);
        else if (btn.classList.contains('operator-btn')) setOperation(btnText === '×' ? '*' : btnText === '÷' ? '/' : btnText === '−' ? '-' : btnText);
        else if (btn.classList.contains('equals-btn')) calculateResult();
        else if (btn.classList.contains('function-btn')) {
            if (btnText === 'C') clearDisplay();
            else if (btnText === 'CE') clearEntry();
            else if (btn.querySelector('i.fa-backspace')) backspace();
        }
        else if (btn.classList.contains('memory-btn')) {
            if (btnText === 'MC') memoryClear();
            else if (btnText === 'MR') memoryRecall();
            else if (btnText === 'M+') memoryAdd();
            else if (btnText === 'M-') memorySubtract();
        }
        else if (btn.classList.contains('scientific-btn')) {
            if(btnText === 'xʸ') setOperation('power');
            else handleUnaryOperation(btnText);
        }
    });

    // --- Initialize ---
    loadSettings();
    navigateTo('#home');
    updateDisplay();
});
