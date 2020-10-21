const keys = document.querySelector('.calculator__keys');
const keyOperators = document.querySelectorAll('.key-operator');
const display = document.querySelector('.calculator__display');
const calculator = document.querySelector('.calculator');
const operators = ['add','substract','multiply','divide'];
const decimal = 'decimal';
const clear = 'clear';
const calculate = 'calculate';

keys.addEventListener('click', printNumbers);
keyOperators.forEach(key => {
    key.addEventListener('mousedown', depressedMouseDown);
});

keyOperators.forEach(key => {
    key.addEventListener('mouseup', depressedMouseUp);
})

function printNumbers(e){
    const key = e.target.textContent;
    const action = e.target.dataset.action;
    const displayedNumber = display.textContent;
    let previousKeyType = calculator.dataset.previousKey;
    // is number
    if(!action){
        // debugger;
        if(previousKeyType === 'operator' || previousKeyType === 'calculate'){
            display.textContent = key;
        } else{
            displayNumbers(key);
        }

        calculator.dataset.previousKey = 'number';
        disablingDepressed();
    }
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
                    display.textContent = calcValue;
                    //Calc value wil be first value
                    calculator.dataset.firstValue = calcValue; 
                }else{
                    calculator.dataset.firstValue = displayedNumber;
                }
                
                e.target.classList.add('is-depressed');
                calculator.dataset.previousKey = 'operator';
               
                calculator.dataset.operation = action;

            }
        });
    }

    if(action === decimal) {
        if(!displayedNumber.includes('.')) display.textContent = displayedNumber + '.';
        if(previousKeyType === 'operator' || previousKeyType === 'calculate') display.textContent = '0.';
        calculator.dataset.previousKey = 'decimal';
        disablingDepressed();
    }
    // Clearing the display
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
        display.textContent = '0';
        calculator.dataset.previousKey = 'clear';
       
        disablingDepressed();
    } 

    if(action !== clear){
        const clearButton = document.querySelector('[data-action="clear"]');
        clearButton.textContent = 'CE';
    }

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
        calculator.dataset.previousKey = 'calculate';
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
