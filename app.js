const keys = document.querySelector('.calculator__keys');
const keyOperators = document.querySelectorAll('.key-operator');
const display = document.querySelector('.calculator__display');
const calculator = document.querySelector('.calculator');

keys.addEventListener('click', printNumbers);

keyOperators.forEach(key => {
    key.addEventListener('mousedown', depressedMouseDown);
});

keyOperators.forEach(key => {
    key.addEventListener('mouseup', depressedMouseUp);
});

function printNumbers(e){
    // if(!e.target.matches('button')) return;
    // debugger;
    const key = e.target;
    const displayedNumber = display.textContent;

    const resultString = createResultString(key, displayedNumber, calculator.dataset);

    // displayNumbers(resultString);
    display.textContent = resultString; 

    updateCalculatorState(key, calculator, resultString, displayedNumber);
    
    updateVisualState(key);

}

const getKeyType = key => {
    const action = key.dataset.action;
    if(!action) return 'number';
    if(action === 'add' || action === 'subtract' || action === 'divide' || action === 'multiply')
        return 'operator';
    // if is nothing above, return the action (clear, equal, decimal)
    return action;
};
// its changes all for display.textContent 
const createResultString = (key, displayedNumber, state) => {
    // debugger;
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    console.log(keyType);
    const {previousKeyType, firstValue, modValue, operator} = state;

    // NUMBERS
    if(keyType === 'number'){
        return displayedNumber === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate'
            ? keyContent
            : displayedNumber + keyContent;
    }

    // DECIMAL KEY
    if(keyType === 'decimal') {
        if(!displayedNumber.includes('.')) return displayedNumber + '.';
        if(previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.';
        // analyze
        return displayedNumber;
    }

    // OPERATOR KEYS
        if(keyType === 'operator'){
            // When click second time a operation first and operation will have a value
            return firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate'
            ? result(firstValue,operator,displayedNumber)
            : displayedNumber;
        }

    // CLEAR KEY
    if(keyType === 'clear') return '0';

    // EQUAL KEY
    if(keyType === 'calculate'){
        return firstValue
            ? previousKeyType === 'calculate'
                ? result(displayedNumber, operator, modValue)
                : result(firstValue, operator, displayedNumber)
            : displayedNumber;
    }
};

// changes attributes and visual appearence (animations)
const updateCalculatorState = (key, calculator, calcValue, displayedNumber) => {
    const keyType = getKeyType(key);
    const {firstValue, operator, previousKeyType, modValue} = calculator.dataset;
    calculator.dataset.previousKeyType = keyType;
    // if(keyType === 'number') disablingDepressed();

    if(keyType === 'operator'){
        // disablingDepressed();

        calculator.dataset.firstValue = firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate' ? calcValue : displayedNumber;
        
        calculator.dataset.operator = key.dataset.action;
               
        calculator.dataset.operator = key.dataset.action;
    }

    if(keyType === 'clear') {

        const clearButton = document.querySelector('[data-action="clear"]');
        if(clearButton.textContent === 'AC'){
            calculator.dataset.firstValue = '';
            calculator.dataset.previousKey = '';
            calculator.dataset.operation = '';
            calculator.dataset.modValue = '';
        }
    
    }

    if(keyType === 'calculate') {
        // analyze modValue 
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' ? modValue : displayedNumber ;

        // disablingDepressed();
    }
}

const updateVisualState = (key) => {
    const keyType = getKeyType(key);
    const clearButton = document.querySelector('[data-action="clear"]');
    disablingDepressed();

    if(keyType === 'operator') key.classList.add('.is-depressed');
        
    if(clearButton.textContent !== 'AC' && keyType === 'clear'){
        clearButton.textContent = 'AC';
    }
   
    // ALL BUTTONS(EXCEPT CLEAR)
    if(keyType !== 'clear'){
        clearButton.textContent = 'CE';
    }
}


function disablingDepressed(){
    const depressed = document.querySelectorAll('.is-depressed');
        [...depressed].forEach(item => {
            item.classList.remove('is-depressed');
        });
}

function result(n1, operator, n2){
    const first = parseFloat(n1);
    const second = parseFloat(n2); 
    let equal = '';
    switch(operator){
        case 'add':
            equal = first + second;
            break;
        case 'subtract':
            equal = first - second;
            break;
        case 'multiply':
            equal = first * second;
            break;
        case 'divide':
            equal = first / second;
            break;
    }
    
    display.textContent = '';
    return equal;
}

function depressedMouseDown(e){
    const keyDepressed = e.target;
    if(keyDepressed.className.includes('is-depressed'))
        keyDepressed.classList.add('is-more-depressed');
}

function depressedMouseUp(e){
    const keyDepressed = e.target;
    if(keyDepressed.className.includes('is-depressed')) keyDepressed.classList.remove('is-more-depressed');
}
