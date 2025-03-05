// Calculator functionality
const display = document.getElementById('display');
let currentValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Update display
function updateDisplay() {
    display.value = currentValue;
}

// Number input handlers
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        const number = button.dataset.number;
        
        if (waitingForSecondOperand) {
            currentValue = number;
            waitingForSecondOperand = false;
        } else {
            currentValue = currentValue === '0' ? number : currentValue + number;
        }
        
        updateDisplay();
    });
});

// Decimal point handler
document.querySelector('[data-number="."]').addEventListener('click', () => {
    if (!currentValue.includes('.')) {
        currentValue += '.';
        updateDisplay();
    }
});

// Operation functions
const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    sign: a => a * -1,
    percent: a => a / 100
};

// Button action handlers
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch(action) {
            case 'clear':
                currentValue = '0';
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                break;
                
            case 'sign':
            case 'percent':
                currentValue = operations[action](parseFloat(currentValue)).toString();
                break;
                
            case 'calculate':
                if (operator && firstOperand !== null) {
                    currentValue = operations[operator](
                        firstOperand,
                        parseFloat(currentValue)
                    ).toString();
                    operator = null;
                }
                break;
                
            default:
                operator = action;
                firstOperand = parseFloat(currentValue);
                waitingForSecondOperand = true;
        }
        
        updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const keyActions = {
        'Escape': 'clear',
        'Enter': 'calculate',
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };

    if (e.key in keyActions) {
        document.querySelector(`[data-action="${keyActions[e.key]}"]`).click();
    } else if (e.key === '.') {
        document.querySelector('[data-number="."]').click();
    } else if (!isNaN(e.key)) {
        document.querySelector(`[data-number="${e.key}"]`).click();
    }
});
