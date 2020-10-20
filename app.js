const keys = document.querySelector('.calculator__keys');
const keyOperators = document.querySelectorAll('.key-operator');
const display = document.querySelector('.calculator__display');
const operators = ['add','substract','multiply','divide'];
const calculator = document.querySelector('.calculator');
let firstValue = '';
let operation = '';
let secondValue = '';

// const pressedNumbers = [];
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
        if(previousKeyType === 'operator'){
            display.textContent = key;
            calculator.dataset.previousKey = 'number';
        } else{
            displayNumbers(key);
        }
        disablingDepressed();
    }
    if(e.target.className === 'key-operator'){
        disablingDepressed();
        operators.map(operator => {
            action === operator;
            e.target.classList.add('is-depressed');
            calculator.dataset.previousKey = 'operator';
            firstValue = display.textContent;
            operation = action;
        });
    }

    if(action === decimal) {
        calculator.dataset.previousKey = 'decimal';
        if(!displayedNumber.includes('.')) display.textContent = displayedNumber + '.';
        if(previousKeyType === 'operator') display.textContent = '0.';
        disablingDepressed();
    }
    // Clearing the display
    if(action === clear) {
        calculator.dataset.previousKey = 'clear';
        display.textContent = '0';
        disablingDepressed();
    } 

    if(action === calculate){
        calculator.dataset.previousKey = 'calculate'
        secondValue = display.textContent;
        console.log('Second', secondValue);
        disablingDepressed();
        result(firstValue, operation, secondValue);
    }


}

function displayNumbers(number){
    if(display.textContent === '0') display.textContent = '';
     display.textContent += number;
}

// function gettingParsedNumbers(){
//     const parsedNumber = parseFloat(display.textContent);
//     return parsedNumber;
// }

// function lengthOfDisplay(){
//     if(display.textContent.length > 13){
//         alert('You can´t type 14 numbers length in the calculator display');
//     } 
// }

function disablingDepressed(){
    const depressed = document.querySelectorAll('.is-depressed');
        [...depressed].forEach(item => {
            item.classList.remove('is-depressed');
            // item.style.opacity = 1;
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
    displayNumbers(equal);
    if(first && operation) result(first, operation, second);
}

function depressedMouseDown(e){
    const keyDepressed = e.target;
    if(keyDepressed.className.includes('is-depressed'))
        keyDepressed.style.opacity = 0.5;
}

function depressedMouseUp(e){
    const keyDepressed = e.target;
    if(keyDepressed.className.includes('is-depressed')) keyDepressed.style.opacity = 0.75;
}
// function decimalPressed(){
//     if(decimal){
//         console.log('hola');
//     }
// }
// decimalPressed();