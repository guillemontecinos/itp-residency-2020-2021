# Session 03 – Metaesquema by Hélio Oiticica

[Meataesquemas](https://en.wikipedia.org/wiki/H%C3%A9lio_Oiticica#Selected_works) is an exploratory series of more than 350 paitings by the [neo-concrete](https://en.wikipedia.org/wiki/Neo-Concrete_Movement) brazilian artist Hélio Oiticica. The series pursue to explore spatiality and dinamism on an static framework using minimal shapes and colors.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-original.png" align="middle" width="80%">
</p>

First of all, let's analyze the painting's design. It is an array of blue rects displayed as a `4 x 4` grid, where even squares on uneven rows and uneven squares on even rows are slightly rotated.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-rotated.jpg" align="middle" width="80%">
</p>

Then, in or oder to set a system that helps us find the proportions of each element in the composition, we can set a grid of 52 columns by 33 rows.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-grid.jpg" align="middle" width="80%">
</p>

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-04/assets/metaesquema-grid-dimensions.jpg" align="middle" width="80%">
</p>



```js
let rectsWidth = [13, 8.5, 8.5, 13] //applies to all columns
let rectsHeight = [8, 6, 5, 8] //applies to the first two columns, then it has to be inverted
let grid = [51, 33] //[columns, rows]
let positionX, positionY //store the center of the current rect

function setup(){
    createCanvas(64*14,55*14)
    
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
            }
            rect(0, 0, width * rectsWidth[x] / grid[0], height * yHeight / grid[1]) //draw react converting from grid to pixels
            pop()

            positionY += yHeight / 2
            counter++
        }
        positionX += rectsWidth[x] / 2
        counter-- //decrease counter in one number because every other row uneven rects get rotated
    }
}
```