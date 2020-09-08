## Example 1 – Green and Orange by Carmen Herrera

Original piece by [Carmen Herrera](https://en.wikipedia.org/wiki/Carmen_Herrera) (Cuba, 1915). Check out her [documentary](https://www.netflix.com/title/80106609) on Netflix.
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-01/assets/green-orange-plain.jpg" align="middle" width="80%">
</p>

### Recognizing shapes
When recreating a piece it's important to find a way to represent its content by using simple shapes. In this case we can break down the piece in two kind of shapes: triangles and rects.

#### Triangles
Two triangles can be found in the piece, the one at the left is green while the one at the right is orange, which is also inverted in respect to the first one.
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-01/assets/green-orange-triangles.jpg" align="middle" width="80%">
</p>

#### Stripes
We can also recognize five stripes that cross the canvas horizontally, three of them orange and two green.
<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-01/assets/green-orange-stripes.jpg" align="middle" width="80%">
</p>

#### Fitting a grid
In this case, since we know the piece is built from simple geometric shapes, it is very useful to find a grid system that will help us find the proportionof each shape depending on the size of the canvas. Vertically the grid is pretty obvious: the canvas can be divided into five rows.

Now, horizontally the grid can become al little tricker or arbitrary. But simply can guess in how many columns the canvas can be divided: let's stick with 14 columns.

<p align="center">
  <img src="https://github.com/guillemontecinos/itp_residency_2020_2021/blob/master/icm-workshops/session-01/assets/green-orange-grid.jpg" align="middle" width="80%">
</p>

### Let's code it up
Since we have an idea on what's the proportion of each shape based on the canvas size, the only piece of information when still need to find out is how to represent each color. To do this we can use a Chrome Extension called [ColorPick Eyedropper](https://chrome.google.com/webstore/detail/colorpick-eyedropper) that will return you an specific pixel's color, or the Apple built-in app Digital Color Meter. You can also just google "Color Picker" and will find a variety of tools.

Using any of the, we can get to the conclusion that the green color in the piece can be represented by `rgb(20, 149, 76)` whilst the orange color can be represented by `rgb(252, 108, 33)`.

#### Painting the background
Summarizing what we discussed above, the piece will be break down in the following pieces: an organice background, two green stripes drawn above the background, and two triangles drawn on top of the above mentiontes, one painted of green (on the left side of the canvas) and the other painted of orange (on the right side of the canvas).

First of all let's discuss something: as you learned in the first lesson, p5.js is composed by two main functions `setup()` and `draw()`. As the name says, `setup()` is a function meant to set up all the elements required to run your code and is executed only once at the beginning of the program (because we need to setup the elements only once). In turn, `draw()` is a time-based loop that is executed every certain amount of milliseconds. Since `draw()` is useful for animations, we are not going to use it in our example, cause the painting is static. 

Now, let's create a canvas and paint its background of the canvas inside the `setup()` function. Since the original piece is 182.9 x 152.4 cm let's create a canvas proportional to this size, let's say `w = 180 * 5` and `h = 150 * 5`: [`createCanvas(180 * 5, 150 * 5)`](https://p5js.org/reference/#/p5/createCanvas). Then, let's paint the background using the function `background(color)` that takes a color as an argument. Remember that p5.js' default `colorMode` is RGB, so the [`background(252, 108, 33)`](https://p5js.org/reference/#/p5/background) function will interpret the infor you pass as RGB.

```js
function setup(){
    createCanvas(180 * 5, 150 * 5);

    // paint the background orange
    background(252, 108, 33);
}
```