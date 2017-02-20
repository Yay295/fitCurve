JavaScript implementation of  
CoffeeScript implementation of  
Python implementation of  
Algorithm for Automatically Fitting Digitized Curves  
by Philip J. Schneider  
"Graphics Gems", Academic Press, 1990

The alternate version is just something I made for my own use. It assumes the input only has five points and that the first point is (0,0) and the last point is (1,1).

#Usage
1. Include the JavaScript file.
2. Call `fitCurves()` with an array of points to fit a curve to.
3. Depending on which file you are using:
  * `fitCurves.js`
  The function will return an array of arrays of the four points required to plot a cubic Bézier curve.
  * `fitCurvesAlt.js` The function will return a single array of the four points required to plot a cubic Bézier curve.

A 'point' is just an array of two numbers.
