JavaScript implementation of  
CoffeeScript implementation of  
Python implementation of  
Algorithm for Automatically Fitting Digitized Curves  
by Philip J. Schneider  
"Graphics Gems", Academic Press, 1990

# Usage
1. Include the JavaScript file.

If you included `fitCurves.js`

1. Call `fitCurves(a,e)` with an array of points to fit a curve to, and a number greater than 0 for how close of an approximation you want (smaller numbers giving a more accurate result).
2. The function will return an array of arrays of the four points required to plot a cubic Bézier curve.

If you included `fitCurvesAlt.js`

1. Call `fitCurves(a)` with an array of points to fit a curve to.
2. The function will return a single array of the four points required to plot a cubic Bézier curve.

A 'point' is just an array of two numbers.
