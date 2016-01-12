iDecimal v0.0.1
=======
**iDecimal** is a standalone decimal library which to solve the problems like 0.2 + 0.1 === 0.30000000000000004.

### In This Documentation
[1. API](#api)<br/>
&nbsp;[Constructor](#constructor)<br/>
&emsp;[iDecimal(num)](#idecimalnum)<br/>
&nbsp;[Function Properties](#function-properties)<br/>
&emsp;[iDecimal.add(opr1, opr2)](#idecimaladdopr1-opr2)<br/>
&emsp;[iDecimal.minus/sub(minuend, subtractor)](#idecimalminussubminuend-subtractor)<br/>
&emsp;[iDecimal.mul(opr1, opr2)](#idecimalmulopr1-opr2)<br/>
&emsp;[iDecimal.div(dividend, divisor)](#idecimaldivdividend-divisor)<br/>
## API
### Constructor
#### `iDecimal(num)`
**@description** Create new iDecimal object.<br/>
**@param** {Number|DOMString} num - The raw number value, excludes scientific notation<br/>
**@returns** {iDecimal} - The iDecimal object<br/>
````
var d1 = iDecimal(1.2)
var d2 = iDecimal("1000000000000000128.001")
````

### Function Properties
#### `iDecimal.add(opr1, opr2)`
**@description** Do addition operation.<br/>
**@param** {iDecimal|Number|DOMString} opr1 - The raw number value, excludes scientific notation<br/>
**@param** {iDecimal|Number|DOMString} opr2 - The raw number value, excludes scientific notation<br/>
**@returns** {iDecimal} - The iDecimal object<br/>
````
var d1 = iDecimal(0.2)
var sum = iDecimal.add(0.1, d1)
console.log(sum) // display 0.3
````
#### `iDecimal.minus/sub(minuend, subtractor)`
**@description** Do subtraction operation.<br/>
**@param** {iDecimal|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {iDecimal|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {iDecimal} - The iDecimal object<br/>
````
var d1 = iDecimal(0.2)
var result = iDecimal.minus(0.1, d1)
console.log(result) // display -0.1
````
#### `iDecimal.mul(opr1, opr2)`
**@description** Do multiplication operation.<br/>
**@param** {iDecimal|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {iDecimal|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {iDecimal} - The iDecimal object<br/>
````
var d1 = iDecimal(0.7)
var result = iDecimal.mul(180, d1)
console.log(result) // display 126
````
#### `iDecimal.div(dividend, divisor)`
**@description** Do division operation.<br/>
**@param** {iDecimal|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {iDecimal|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {iDecimal} - The iDecimal object<br/>
````
var d1 = iDecimal(0.2)
var result = iDecimal.minus(0.1, d1)
console.log(result) // display 0.02
````
