# Conditional Statements
*by Guillermo Montecinos*

## Operators
An operator is a construct defined within a programming language that performs an operation with the values passed to it. Javascript has a variety of operators that include the assignment operator `=` and arithmetic operators like `+`, `-`, `*` and `/`, among others.
### Relational operators
A relational operator compares its operands and returns a boolean value based on whether the comparison is true.

#### less than `<` and greather than `>`
When comparing numbers, the operator returns a boolean based on the mathematical comparition.

```js
// less than
2 < 3 //returns true 

3 < 2 //returns false 

// greather than
2 > 3 //returns false 

3 > 2 //returns true 
```

When comparing strings, the operator compares chracter by character based on their alphabetical order.
```js
'b' < 'a' //returns false

'b' < 'c' //returns true

'abc' < 'aaa' //returns false because 'b' is not less than 'a'

'abc' < 'abd' // returns true because 'c' is less than 'd'
```
Some examples were taken from [stack overflow](https://stackoverflow.com/questions/10863092/why-is-string-11-less-than-string-3).

#### less or equal than: `<=` and greather or equal than: `>=`
Similar to `<` and `>` but also returns `true` when both values are equal.
```js
1 < 1 //returns false

1 <= 1 //returns true
```
#### `in` 
#### `instanceof`

## Sources
* [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)