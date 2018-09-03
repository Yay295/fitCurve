JavaScript implementation of  
CoffeeScript implementation of  
Python implementation of  
Algorithm for Automatically Fitting Digitized Curves  
by Philip J. Schneider  
"Graphics Gems", Academic Press, 1990

# Usage
1. Include the JavaScript file.

If you included `fitCurves.js` or `fitCurves3D.js`

1. Call `fitCurves(a,e)` with an array of points to fit a curve to, and a number greater than 0 for how close of an approximation you want (smaller numbers giving a more accurate result).
2. The function will return an array of arrays of the four points required to plot a cubic Bézier curve.

If you included `fitCurvesAlt.js`

1. Call `fitCurves(a)` with an array of points to fit a curve to.
2. The function will return a single array of the four points required to plot a cubic Bézier curve.

A 'point' is just an array of two numbers (or three numbers for the 3D version).

# History

You might be wondering why I created this fork when it was already written in JavaScript. The thing is, the commit history of this repository up to version 3 is completely made up, and I forked from the wrong commit. I've though about going back and amending it, but it seemed easier to just make a note here.

My fork was actually made from [this commit](https://github.com/soswow/fit-curve/tree/1bc4dd6fd43e21052a0e706d5de57e801bc35085) back when there was only a CoffeeScript version, and you can see it used [in this repository](https://github.com/AniDevTwitter/animeopenings/commit/42f21b8e55d20582a958a0f43051cbd66ea47085) back on February 28, 2016 - four and a half months before [Sphinxxxx created their original JavaScript fork](https://github.com/Sphinxxxx/fit-curve/commit/fbd64e2d4237c380738eb8ca1cd1562423f8b1ec).

Back then I didn't use GitHub as much, so I didn't bother uploading it in its own repository. When I finally decided to put it in its own repository a year later, I didn't realize that any changes had been made, and I forked from the latest commit instead of the older correct commit.

Currently our forks are essentially the same. The main differences being that mine just has the JavaScript files (not having an online demo or being NPM/Bower compatible), and that I have two alternate versions. One that works in three dimensions, and one that returns the point for a single curve rather than an array of curves. Also mine is quite a bit smaller and more self-contained.
