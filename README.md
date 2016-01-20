D v0.2.0
=======
**D** is a standalone decimal library which to solve the problems like 0.2 + 0.1 === 0.30000000000000004.

### In This Documentation
[1. API](#api)<br/>
&nbsp;[Constructor](#constructor)<br/>
&emsp;[D(num)](#Dnum)<br/>
&nbsp;[Function Properties](#function-properties)<br/>
&emsp;[D.add(opr1, opr2)](#Daddopr1-opr2)<br/>
&emsp;[D.minus/sub(minuend, subtractor)](#Dminussubminuend-subtractor)<br/>
&emsp;[D.mul(opr1, opr2)](#Dmulopr1-opr2)<br/>
&emsp;[D.div(dividend, divisor)](#Ddivdividend-divisor)<br/>
## API
### Constructor
#### `D(num)`
**@description** Create new D object.<br/>
**@param** {Number|DOMString} num - The raw number value, excludes scientific notation<br/>
**@returns** {D} - The D object<br/>
````
var d1 = D(1.2)
var d2 = D("1000000000000000128.001")
````

### Function Properties
#### `D.add(opr1, opr2)`
**@description** Do addition operation.<br/>
**@param** {D|Number|DOMString} opr1 - The raw number value, excludes scientific notation<br/>
**@param** {D|Number|DOMString} opr2 - The raw number value, excludes scientific notation<br/>
**@returns** {D} - The D object<br/>
````
var d1 = D(0.2)
var sum = D.add(0.1, d1)
console.log(sum) // display 0.3
````
#### `D.minus/sub(minuend, subtractor)`
**@description** Do subtraction operation.<br/>
**@param** {D|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {D|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {D} - The D object<br/>
````
var d1 = D(0.2)
var result = D.minus(0.1, d1)
console.log(result) // display -0.1
````
#### `D.mul(opr1, opr2)`
**@description** Do multiplication operation.<br/>
**@param** {D|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {D|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {D} - The D object<br/>
````
var d1 = D(0.7)
var result = D.mul(180, d1)
console.log(result) // display 126
````
#### `D.div(dividend, divisor)`
**@description** Do division operation.<br/>
**@param** {D|Number|DOMString} minuend - The raw number value, excludes scientific notation<br/>
**@param** {D|Number|DOMString} subtracto - The raw number value, excludes scientific notation<br/>
**@returns** {D} - The D object<br/>
````
var d1 = D(0.2)
var result = D.minus(0.1, d1)
console.log(result) // display 0.02
````

## Changelog
### v0.3.0
实现带余数的加减乘除
### v0.2.0
重构代码结构
### v0.1.0
尝试实现整数加减乘和整除