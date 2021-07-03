'use strict';
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // BANKIST APP


// // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);


/////////////////////////////////////////////////

const account1 = {
  owner: 'Asfandyar Khan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111
}
const account2 = {
  owner: 'Abdul Samad',
  movements: [1000, 430, 400, 5000, -450, -430, -720, 1300],
  interestRate: 1.5,
  pin: 2222
}
const account3 = {
  owner: 'Waqas Bilal',
  movements: [1200, -350, 250, 2200, -950, -1130],
  interestRate: 0.7,
  pin: 3333
}
const account4 = {
  owner: 'Ahsan Naeem',
  movements: [3000, 1200, 730, 70, 470],
  interestRate: 1,
  pin: 4444
}

const accounts = [account1, account2, account3, account4];


const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner.toLowerCase()
      .split(' ')
      .map(name => name[0]).join('');

  });
}

// By using function keyword
// const user = 'Abdul Samad';
// const username = user.toLowerCase().split(' ').map(function (name) {
//   return name[0];
// }).join('');

// By using arrow function method
//const username = user.toLowerCase().split(' ').map(name => name[0]).join('');
createUserName(accounts);
console.log(accounts);



const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

//displayMovements(account1.movements);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
}

//calcPrintBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}EUR`;
}
//calcDisplaySummary(account1.movements)

//LOGIN Form
// By Default form in html reload the page.
// we don't ned to add event for enter key because by default form functionality is when you press the enter utton he sunmitted

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display Balance
  calcPrintBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);

}

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //this function used to stop reload the page while we press enter key or click submit button
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  console.log(currentAccount);
  if ((currentAccount?.pin === Number(inputLoginPin.value))) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);

  }

});
// Events Handlers


//For Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName) {
    // Doing Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
})

//For Loan Request

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 &&
    currentAccount.movements.some(mov => mov.currentAccount >= loanAmount * 0.1)) {

    //Add Movements
    currentAccount.movements.push(loanAmount);

    // Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }

})


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  inputClosePin
  inputCloseUsername
  if (inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
})
console.log(accounts);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})



/*
// CODING CHALLENGE # 1

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (data1, data2) {
  const juliaCorrection = data1;
  juliaCorrection.splice(0, 1);
  juliaCorrection.splice(-2);
  const finalData = juliaCorrection.concat(data2);
  console.log(finalData);

  finalData.forEach(function (age, i) {
    if (age > 5) {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    }
    else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  })
}
checkDogs(dogsJulia, dogsKate);
console.log('------------------------');
checkDogs(dogsJulia2, dogsKate2);
*/

/*

// ********* CODING CHALLENGE # 2 *********

const dogsJuliaHuman = [5, 2, 4, 1, 15, 8, 3];
const dogsKateHuman = [16, 6, 10, 5, 6, 1, 4];
const mainCalcAverage = function (arrAge) {
  const calcAverageHumanAge = arrAge.map(function (ages) {
    if (ages <= 2)
      return 2 * ages;
    else
      return 16 + ages * 4;

  })
  const adultAge = calcAverageHumanAge.filter(function (adult) {
    return adult > 18;
  })

  const averageAge = adultAge.reduce(function (acc, avg) {
    console.log(`${acc} and ${avg}`);
    return acc + avg;

  }, 0)

  console.log(calcAverageHumanAge);
  console.log(adultAge);
  console.log(averageAge / adultAge.length);
}
console.log(mainCalcAverage(dogsJuliaHuman));
console.log(mainCalcAverage(dogsKateHuman));

*/

/*
// ***** CODING CHALLENGE # 3 ****
const dogsJuliaHuman = [5, 2, 4, 1, 15, 8, 3];
const dogsKateHuman = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = age => age.map(ages => ages <= 2 ? ages * 2 : 16 + ages * 4)
  .filter(adult => adult > 18)
  .reduce((acc, avg, i, arr) => acc + avg / arr.length, 0);

console.log(calcAverageHumanAge(dogsJuliaHuman));
console.log(calcAverageHumanAge(dogsKateHuman));

*/


/*
//MAP METHODS (returns a new array without modrate the older one)
const eurToUsd = 1.2;
// function type method
const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd
});
// arrow function single line code but both work same
//const movementsUsd = movements.map(mov => mov * eurToUsd);
console.log(movements);
console.log(movementsUsd);

// We can also use value elements and array in map function same as use in forEach functions
const movementsDescription = movements.map(
  (mov, i) =>
    `movement ${i + 1}: You ${mov > 0 ? 'DEPOSITED' : 'WITHDRAW'} ${Math.abs(mov)} `);
console.log(movementsDescription);
*/


/*
// FILTER METHOD

const deposits = movements.filter(function (mov) {
  return mov > 0;
})
const withdrawls = movements.filter(function (mov) {
  return mov < 0;
})
console.log(deposits);
console.log(withdrawls);

*/

/*

// THE REDUCE METHOD

const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`THE ITERATION: ${i} BALANCE IS ${acc}`);
  return acc + cur;
}, 0);

// Same as for loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);
console.log(balance);

//EXAMPLE OF REDUCE METHOD
// MAX Value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//MIN Value

const min = movements.reduce((acc, mov) => {
  if (acc < mov) return acc;
  else return mov;
}, movements[0]);
console.log(min);

*/

// Chaining Methods

// const eurToUsd = 1.2;
// const totalDeposits = movements.filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov);
// console.log(totalDeposits);


// THE FIND METHOD
// Find method is same as filter but fundamental difference is that filter returns the array of all true conditions 
// however find method only return the very first value of the array where condition is true

/*
const firstwithdrawal = movements.find(mov => mov < 0);
console.log(firstwithdrawal);

const account = accounts.find(acc => acc.owner === 'Ahsan Naeem');
console.log(account);
*/


/*
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
//SLICE METHOD

// From where array should be slice
console.log(arr.slice(2));

//From Where to there array should be slice
console.log(arr.slice(1, 4));

//Negetive sign shows decendding order of array
console.log(arr.slice(-1)); //last index of the array

console.log(arr.slice(2, -1));

//spread operator is also make the shadow copy
console.log(...arr);


// SPLICE METHOD
//it delete the index from the actual array
//splice used usally remove elements from array
console.log(arr.splice(-1));
arr.splice(1, 2);
console.log(arr);

// REVERSE METHOD
//it does mutate the array
arr = ['a', 'b', 'c', 'd', 'e', 'f'];
let arr2 = ['k', 'j', 'i', 'h', 'g']
arr2.reverse();
console.log(arr2)

//CONCAT METHOD
//it used to merge two arrays
const letters = arr.concat(arr2);
console.log(letters);

// We do the same by using spread operator
console.log(...arr, ...arr2);

//JOIN METHOD
console.log(letters.join('-'));
*/




/*
//FOREACH METHOD
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`MOVEMENT ${i + 1} : YOU DEPOSITED ${movement}`);
  }
  else {
    console.log(`MOVEMENT ${i + 1} : YOU WITHDRAW ${Math.abs(movement)}`); //absoluty the value without any sign
  }
}

console.log('======== FOREACH METHOD======')
//How to use foreach method
//it is always required call back function, we are not calling it by itself

movements.forEach(function (movement, i, arr) // IN for each method always frst the current index and then element {
  if (movement > 0) {
  console.log(`MOVEMENT ${i + 1} : YOU DEPOSITED ${movement}`);
}
else {
  console.log(`MOVEMENT ${i + 1} : YOU WITHDRAW ${Math.abs(movement)}`); //absoluty the value without any sign
}
})
*/


/*
// Some And Every
console.log(movements);
//This method shows only equality
console.log(movements.includes(-130));

//This methods shows conditions
// Some: Condition Method
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// Every: Condition Method

console.log(movements.every(acc => acc > 0));
//In Account 4 there is no negetive value so the every method returns true
console.log(account4.movements.every(acc => acc > 0));

//Separte Call Back Functions

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

*/


/*
//Flat And FlatMAp Method

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
//this method shows all the indexes together which is in nested array
console.log(arr.flat()); //empty argument of flat method shows the single stage of nested array.

const arrDeeper = [[[1, 2], 3], 4, [5, 6], 7, 8];
console.log(arrDeeper.flat(2)); // number in argumnets btyga k kitny level of nested array tk jana hy.

const accountsMovements = accounts.map(acc => acc.movements);
console.log(accountsMovements.flat());

const allMovements = accountsMovements.flat();
console.log(allMovements);

const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);

// Chaining Method
const overalBalance = accounts.map(acc => acc.movements)
  .flat().reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);


// FlatMap Method
// it is directly do flat after map the function
const overalBalance2 = accounts.flatMap(acc => acc.movements)// But flatmap only one level deep in nested array
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

*/

/*

//Sorting Arrays

//String Sorts
const owners = ['waqas', 'saad', 'fahad', 'ahsan', 'samad', 'asfandyar'];
console.log(owners.sort());

//Number Sorts
console.log(movements);
console.log(movements.sort()); //This function is not valid for numbers so we need a call back function

// //Ascending
// movements.sort((a, b) => {
//   if (a > b)
//     return 1;
//   if (a < b)
//     return -1;
// })

// console.log(movements);

// //Desending
// movements.sort((a, b) => {
//   if (a > b)
//     return -1;
//   if (a < b)
//     return 1;
// })
// console.log(movements);

//simplest way to sort number in ascending and decending order

//for ascending
movements.sort((a, b) => a - b);
console.log(movements);
//for descending
movements.sort((a, b) => b - a);
console.log(movements);

*/

//More Ways Of Creating And Filling Arrays

console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//Empty Array + Fill Method

const x = new Array(7); //The arguments shows the length of array
console.log(x);
x.fill(1);// this fill entire array with 1
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7];
arr.fill(1, 4); //this show fill 1 in the array to index 4
console.log(arr);
arr.fill(1, 2, 5);// from where to where index will fill
console.log(arr);


//Array.from
const x2 = Array.from({ length: 7 }, () => 1); //fill empty array with 1
console.log(x2);

const y = Array.from({ length: 5 }, (_, i) => i + 1); //apply map method on empty array also 
//we don't need of first argument so we asign it _ so other programmers undersstan this also this is the standard 

console.log(y);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('EUR', '')));

  console.log(movementUI);
})

/***** CODING CHALLENGE # 4 ****** */


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];



dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);


// const account = accounts.find(acc => acc.owner === 'Ahsan Naeem');
// console.log(account);


const dogsOwner = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogsOwner)

if (dogsOwner.recFood < dogsOwner.curFood && dogsOwner.owners.includes('Sarah')) {
  console.log(`It's Eating Too Little`);
}
else {
  console.log(`It's Eating Too Much`);
}

