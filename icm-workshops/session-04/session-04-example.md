# Session 03 – Metaesquema by Hélio Oiticica

[Meataesquemas](https://en.wikipedia.org/wiki/H%C3%A9lio_Oiticica#Selected_works) is an exploratory series of more than 350 paitings by the [neo-concrete](https://en.wikipedia.org/wiki/Neo-Concrete_Movement) brazilian artist [Hélio Oiticica](https://en.wikipedia.org/wiki/H%C3%A9lio_Oiticica). The series pursue to explore spatiality and dinamism on a static framework using repetitive basic geometric shapes and plain colors. In this tutorial you will learn how to interpret this piece in code and replicate it on your browser.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-original.png" align="middle" width="80%">
</p>

## Looking for patterns in the piece
First of all, let's analyze the composition of the piece. It can be break down as an array of blue rects displayed as a `4 x 4` grid, where even squares on uneven rows (2, 4, 10 & 12) and uneven squares on even rows (5, 7, 13 & 15) are slightly rotated. Note that all rects that are not rotated touch their borders with the next one, for example rect 1 and 6 touch their vertices, an so on. We can also note that rect's sizes can be paired: 1 & 16, 2 & 15, 3 & 14, 4 & 13, 5 & 12, 6 & 11, 7 & 10 and 8 & 9. We can also note that the rotated rects are slightly smaller than we could expect them to be, for example rect 2 is smaller than rect 3, while rect 15 is smaller than the negative space among rects 11, 14 and 16.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-rotated.jpg" align="middle" width="80%">
</p>

Then, in or oder to set a system that helps us find the proportions of each element in the composition, we can set a grid of 52 columns by 33 rows. Based on this system we can estimate the size of each element. For example, in terms of width we can appreciate that the width of each rect depends on what column it's placed, being 13 for column 1, 8.5 for columns 2 and 3, and 13 for column 4 (we said rect 2 was slightly smaller than rect 3, but let's assume for now its width is 8 units). Based on this, we can declare an array `rectsWidth = [13, 8.5, 8.5, 13]`.

On the other hand, we can note that rect's height is also consistent, being 8 for row 1, 6 for row 2, 5 for row 3 and 8 for row 4. This is applicable for columns 1 & 2, but if we look with attention heights on columns 3 & 4 are the same of columns 1 & 2, but inverted. Then, we can declare an array `const rectsHeight = [8, 6, 5, 8]` that can be used as it is on columns 1 & 2, and in opposite direction on columns 3 & 4.

<!-- <p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-grid.jpg" align="middle" width="80%">
</p> -->

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-grid-dimensions.jpg" align="middle" width="80%">
</p>

Considering the above, we can start our sketch by declaring the two arrays previously mentioned, plus an array that stores the grid size for future calculation purposes. Note that all these arrays are declared as `const`, since they are thought as elements that won't change over time.

```js
const rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
const rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
const grid = [51, 33] //represents the system grid [columns, rows]

function setup(){

}
```

Now, let's create a canvas of the paiting's size. Since the original piece is 640 mm x 550 mm, let's create a p5.js canvas of 64 * 14 by 55 * 14 pixels in order to maintain the proportion. Then, let's paint the background's color of the original canvas color, which is `rgb(169, 153, 110)` (for more information on how to pick the color, take a look of Session 01's example).

```js
const rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
const rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
const grid = [51, 33] //represents the system grid [columns, rows]

function setup(){
    createCanvas(64 * 14, 55 * 14)
    background(169, 153, 110)
}
```

## Using a `for` loop to draw four squares
As a first attempt to recreate the piece, let's draw a simplification of the first row of squares centered in the vertical middle of the canvas. To do that, let's create a variable called `positionX` that will store the position of the center of each rect. Then, let's setup the rects features, like [`noStroke()`](https://p5js.org/reference/#/p5/noStroke), [`fill(0, 31, 132)`](https://p5js.org/reference/#/p5/fill) and [`rectMode(CENTER)`](https://p5js.org/reference/#/p5/rectMode).

The easiest way to perform a series of operations, like drawing rects, is by calling a `for` loop that iterates over certain kind of dat. For example, since we want to draw 4 rectangles, we can declare a `for` that iterates an index `x` from 0 to 3, by saying: `for(let x = 0; x < 4; x++)`. Having this, we can say, for example:

```js
for (let x = 0; x < 4; x++){
    console.log('x: ' + x)
}
```

That will print `x: 0, x: 1, x: 2, x: 3`. Now, in order to draw the rects in the x-coordinate it corresponds in the painting, we need variable that stores the position of the rect before and gets updated on every iteration. For example, if we think in terms of columns of the system grid, the first rect hast to be drawn on `4 + 13 / 2`, since `4` is the left margin and `13` is the rect's width. Let's create then, a variable called `positionX` that gets initialized with the value `4` right before the `for` loop that iterates over the columns is called. Then, inside the loop let's update that value by increasing it in the half of the rect's width, so we can make `positionX` to correspond with the first rect's center when `x = 0`.

```js
positionX = 4
//iterates over columns
for (let x = 0; x < 4; x++) { 
    positionX += rectsWidth[x] / 2 //update positionX as the number of the column before plus the current rect's width / 2
}
```

After that, let's call the function rect to draw the shape in the position `(positionX, height / 2)`, with a size of 50 pixels. There is one more thing we need to make in order to draw the 4 rects in their actual position, which is updating `positionX` to the half of the current rect's width after it gets drawn. If we don't do that we'll see an overlap of shapes, bacuse we will be always shifted 1 / 2 of the width before.


```js
const rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
const rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
const grid = [51, 33] //represents the system grid [columns, rows]
let positionX //store the center of the current rect

function setup(){
    createCanvas(64 * 14, 55 * 14)
    background(169, 153, 110)
    noStroke()
    fill(0, 31, 132)
    rectMode(CENTER)

    // set initial positionX as the left margin accordin to the grid
    positionX = 4
    //iterates over columns
    for (let x = 0; x < 4; x++) { 
        positionX += rectsWidth[x] / 2 //update positionX as the number of the column before plus the current rect's width / 2
        rect(width * positionX / grid[0], height / 2, 50, 50)
        positionX += rectsWidth[x] / 2
    }
}
```

Note that each rect's x position is not just equals to `positionX`, because that parameter is defined in columns of the grid system. Then we have to convert it into pixels by the following operation: `width * positionX / grid[0]`. After all this, the sketch should look like follows.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/first-row.png" align="middle" width="80%">
</p>

Then, If we'd like to draw the first row in the actual y-coordinate, we should do similar of what we did with `positionX` and declare a variable called `positionY` that takes `3 + rectsHeight[0] / 2` as value. We should also modify the rect's y position to `height * positionY / grid[1]`.

```js
const rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
const rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
const grid = [51, 33] //represents the system grid [columns, rows]
let positionX, positionY //store the center of the current rect
let sizeScale = 1

function setup(){
    createCanvas(64 * 14, 55 * 14)
    
    randomSeed(100)
    background(169, 153, 110)
    noStroke()
    fill(0, 31, 132)
    rectMode(CENTER)

    // set initial positionX as the left margin accordin to the grid
    positionX = 4
    //iterates over columns
    for (let x = 0; x < 4; x++) { 
        positionX += rectsWidth[x] / 2 //update positionX as the number of the column before plus the current rect's width / 2
        positionY = 3 + rectsHeight[0] / 2
        rect(width * positionX / grid[0], height * positionY / grid[1], 50, 50)
        positionX += rectsWidth[x] / 2
    }
}
```

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/first-row-right-position.png" align="middle" width="80%">
</p>

## Using nested `for` loops to draw a `4 x 4` grid of squares
* draw the grid in small squares
* draw the actual sizes
* add rotation stuff / explain random and random seed


## final code

```js
const rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
const rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
const grid = [51, 33] //[columns, rows]
let positionX, positionY //store the center of the current rect
let sizeScale = 1

function setup(){
    createCanvas(64 * 14, 55 * 14)
    
    randomSeed(100)
    background(169, 153, 110)
    noStroke()
    fill(0, 31, 132)
    rectMode(CENTER)

    // set initial positionX as the left margin accordin to the grid
    positionX = 4
    let counter = 0 // counts the rect's number
    //iterates over columns
    for (let x = 0; x < 4; x++) { 
        positionX += rectsWidth[x] / 2 //update positionX as the number of the column before plus the current rect's width / 2
        positionY = 3 //set initial positionY every time the y-for loop is called
        // iterates over rows
        for (let y = 0; y < 4; y++) {
            let yHeight //stores the height of each rect depending on the y position.
            if (x < 2) { //the two first columns read rectsHeight as it is
                yHeight = rectsHeight[y]
            }
            else { //the two last columns read rectsHeight inversely
                yHeight = rectsHeight[3 - y]
            }
            positionY += yHeight / 2 //update positionY to the current rect's height

            push()
            translate(width * positionX / grid[0], height * positionY / grid[1]); //translate the system to the center of the current rect
            if (counter % 2 != 0) { //if the rect is even, rotate it
                rotate(random(-PI/20,0))
                if(y == 0 || y == 3){
                    sizeScale = .95
                }
                else{
                    sizeScale = 1
                }
            }
            rect(0, 0, sizeScale * width * rectsWidth[x] / grid[0], sizeScale * height * yHeight / grid[1]) //draw react converting from grid to pixels
            pop()

            positionY += yHeight / 2
            counter++
        }
        positionX += rectsWidth[x] / 2
        counter-- //decrease counter in one number because every other row uneven rects get rotated
    }
}
```