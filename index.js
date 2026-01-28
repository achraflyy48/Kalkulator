const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator_keys');
const display = document.querySelector('.calculator_display');

//Fungsi Calculate
const calculate = (n1, operator, n2) => {
    let result = '';
    const firstNum = parseFloat(n1);
    const secondNum = parseFloat(n2);

    //parseFloat = Mengubah data tipe string menjadi Angka Desimal
    if (operator === 'add') {
        result = firstNum + secondNum;
    } else if (operator === 'subtract') {
        result = firstNum - secondNum;
    } else if (operator === 'multiply') {
        result = firstNum * secondNum;
    } else if (operator === 'divide') {
        result = firstNum / secondNum;
    }

    return result;
};

keys.addEventListener ('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;
        const previousKeyType = calculator.dataset.previousKeyType;

        // Setelah menekan tombol sebuah operator, angka sebelumnya akan hilang.
        Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

        // Jika tampilan kalkulator menampilkan angka 0, kita ingin mengganti tampilan dengan angka tombol yang diklik. Sebaliknya, jika tampilan kalkulator bukan angka 0, kita ingin menambahkan angka di belakangnya.
        if (!action) {
            if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = keyContent;
            } else {
                display.textContent = displayedNum + keyContent;
            }
            calculator.dataset.previousKeyType = 'number';
        }

        //Jika pengguna mengklik tombol operator (+, -, x, :), pengguna harus tahu bahwa tombol operator telah disorot.
        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            const firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = displayedNum;

            //Jika sudah ada angka pertama dan kalkulator, lakukan kalkulasi berantai.
            if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
                const calcValue = calculate (firstValue, operator, secondValue);
                display.textContent = calculateValue;
                calculator.dataset.firstValue = calcValue;
            } else {
                calculator.dataset.firstValue = displayedNum;
            }

            key.classList.add('is-depressed');
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.operator = action;
        }

        //Jika pengguna menekan tombol desimal, simbol titik (.) harus muncul setelah angka.
        if ( action === 'decimal') {
            if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = '0.';
            } else if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.';
            }
            calculator.dataset.previousKeyType = 'decimal';
        }

        //Logika Clear
        if ( action === 'clear' ) {
            display.textContent = '0';
            delete calculator.dataset.firstValue;
            delete calculator.dataset.operator;
            delete calculator.dataset.previousKeyType;
            calculator.dataset.previousKeyType = 'clear';
        }

        //Logika hasil / samadengan
        if ( action === 'calculate' ) {
            //Menyimpan Nilai Kedua sebelum pengguna mengklik tombol sama dengan
            let firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = displayedNum;

            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum;
                }
                display.textContent = calculate(firstValue, operator, secondValue);
            }
            calculator.dataset.modValue = secondValue;
            calculator.dataset.previousKeyType = 'calculate';
        }
    }   
});