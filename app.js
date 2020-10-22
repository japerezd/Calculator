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
})

const getKeyType = key => {
    const action = key.dataset.action;
    if(!action) return 'number';
    if(action === 'add' || action === 'substract' || action === 'divide' || action === 'multiply')
        return 'operator';
    // if is nothing above, return the action (clear, equal, decimal)
    return action;
}
const createResultString = (key, displayedNumber, state) => {
    const keyContent = key.textContent;
    const {previousKeyType, firstValue, modValue, operator} = state;

    // NUMBERS
    if(getKeyType === 'number'){
        return previousKeyType === 'operator' || previousKeyType === 'calculate'
            ? keyContent
            : displayNumbers(keyContent);
    }

    // DECIMAL KEY
    if(getKeyType === 'decimal') {
        if(!displayedNumber.includes('.')) return displayedNumber + '.';
        if(previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.';
        // analyze
        return displayedNumber;
    }

    // OPERATOR KEYS
        if(getKeyType === 'operator'){
            // When click second time a operation first and operation will have a value
            return firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate'
            ? result(firstValue,operator,displayedNumber)
            : displayedNumber;
        }
    

    // CLEAR KEY
    if(getKeyType === 'clear') return '0';

    // EQUAL KEY
    if(getKeyType === 'calculate'){
        return firstValue
            ? previousKeyType === 'calculate'
                ? result(displayedNumber, operator, modValue)
                : result(firstValue, operator, displayedNumber)
            : displayedNumber;
    }
};

const updateCalculatorState = (key, calculator) => {
    const keyType = getKeyType(key);
    calculator.dataset.previousKeyType = keyType;
    if(keyType === 'number') calculator.dataset.previousKeyType = 'number';
    if(keyType === 'operator') calculator.dataset.previousKeyType = 'operator';
    if(keyType === 'decimal') calculator.dataset.previousKeyType = 'decimal';
    if(keyType === 'clear') calculator.dataset.previousKeyType = 'clear';
    if(keyType === 'calculate') calculator.dataset.previousKeyType = 'calculate';
}

function printNumbers(e){
    const key = e.target;
    const action = e.target.dataset.action;
    const displayedNumber = display.textContent;

    const resultString = createResultString(key, displayedNumber, calculator.dataset);

    // NUMBER KEYS
    if(!action){

        disablingDepressed();
    }
    // OPERATOR KEYS
    if(e.target.className === 'key-operator'){
        disablingDepressed();
        operators.map(operator => {
            if(action === operator){
                const first = calculator.dataset.firstValue;
                const operation = calculator.dataset.operation;
                const second = displayedNumber;
                // When click second time a operation first and operation will have a value

                if(first && operation && previousKeyType !== 'operator' && previousKeyType !== 'calculate'){
                    const calcValue = result(first, operation, second);
                    //Calc value wil be first value
                    calculator.dataset.firstValue = calcValue; 
                }else{
                    calculator.dataset.firstValue = displayedNumber;
                }
                
                e.target.classList.add('is-depressed');
               
                calculator.dataset.operation = action;

            }
        });
    }

    // DECIMAL KEY
    if(action === decimal) {
        disablingDepressed();
    }
    // CLEAR KEY
    if(action === clear) {
        const clearButton = document.querySelector('[data-action="clear"]');
        if(clearButton.textContent === 'AC'){
            calculator.dataset.firstValue = '';
            calculator.dataset.previousKey = '';
            calculator.dataset.operation = '';
            calculator.dataset.modValue = '';
        }else{
            clearButton.textContent = 'AC';
        }
        clearButton.textContent = 'AC';
       
        disablingDepressed();
    } 

    // ALL BUTTONS(EXCEPT CLEAR)
    if(action !== clear){
        const clearButton = document.querySelector('[data-action="clear"]');
        clearButton.textContent = 'CE';
    }

    // EQUAL KEY
    if(action === calculate){
        let first = calculator.dataset.firstValue;
        const operation = calculator.dataset.operation;
        let second = displayedNumber;
      
        if(first){
            if(previousKeyType === 'calculate'){
                first = displayedNumber;
                second = calculator.dataset.modValue;
            }
            displayNumbers(result(first, operation, second));
        }
    
        // Modifier value
        calculator.dataset.modValue = second;
        disablingDepressed();
    }

}

function displayNumbers(number){
    if(display.textContent === '0') display.textContent = '';
     display.textContent += number;
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
        case 'substract':
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
