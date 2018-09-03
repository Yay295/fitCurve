/*
	JavaScript implementation of
	CoffeeScript implementation of
	Python implementation of
	Algorithm for Automatically Fitting Digitized Curves
	by Philip J. Schneider
	"Graphics Gems", Academic Press, 1990

	CoffeeScript Source: https://github.com/soswow/fit-curves/blob/master/src/fitCurves.coffee
	JavaScript Implementation by Yay295
	V1 Changes:
	- The lodash library is no longer required.
	- The math.js library is still required.
	- Much better scoping.
	- It's not CoffeeScript.
	V2 Changes:
	- `points.length == 5`, `points[0] == [0,0]`, and `points[4] == [1,1]` because that's all I need.
	- All lodash functions have been removed.
	- The math.js library is no longer required.
	- `maxError` was removed becuase my testing gave the same result for any
		value, until it got too small and the function just failed.
	V3 Changes:
	- Added strict mode.
	- Unrolled some loops.
	- "Inlined" some functions that were only called once.
	Note: None of the V4 changes in the full version affected this version.
	V5 Changes:
	- Rebuilt from V4 of the main code. Restrictions on `points` input lifted.
	- Simplified loops and other things in generateBezier().
	- `maxError` was again removed for the same reason as before.
	- Removed now unused math.js function sum().
	- Inlined fitCubic() and generateBezier() because there's no recursion in this version.
	- Removed unused functions bezier.qprime() and bezier.qprimeprime().
	- Renamed bezier.q() to just bezier().
	- Created local var `len` and removed now unneeded lodash function last().
	- Calculate `len` _after_ duplicate points have been removed.
	V6 Changes:
	- Fixed some spelling and grammar inconsistencies.
*/

/*
	points - An array of points (ex. [[0,0],[1,5],[3,7]]) that reside on the curve to fit.
	return - An array of the four points required for a Cubic Bezier Curve.
*/
function fitCurve(points) {
	"use strict";


	// Simplified math.js functions used in this file.
	var add = (A,B) => [A[0]+B[0],A[1]+B[1]];
	var subtract = (A,B) => [A[0]-B[0],A[1]-B[1]];
	var multiply = (A,B) => [A[0]*B,A[1]*B];
	var divide = (A,B) => [A[0]/B,A[1]/B];
	var dot = (A,B) => A[0]*B[0]+A[1]*B[1];
	var norm = A => Math.sqrt((A[0]*A[0])+(A[1]*A[1]));
	var normalize = v => divide(v,norm(v));

	// Evaluates a cubic bezier at t. Returns a point.
	function bezier(ctrlPoly,t) {
		let tx = 1 - t;
		return	add(add(multiply(ctrlPoly[0], tx * tx * tx), multiply(ctrlPoly[1], 3 * tx * tx * t)), add(multiply(ctrlPoly[2], 3 * tx * t * t), multiply(ctrlPoly[3], t * t * t)));
	}


	// Remove duplicate points and sanitize input.
	points = points.filter((point,i) => (i === 0 || !(point[0] === points[i-1][0] && point[1] === points[i-1][1])));
	var len = points.length;
	if (len < 2) return [];

	var leftTangent = normalize(subtract(points[1],points[0]));
	var rightTangent = normalize(subtract(points[len-2],points[len-1]));
	if (len === 2) {
		var dist = norm(subtract(points[0], points[1])) / 3;
		return [points[0], add(points[0], multiply(leftTangent, dist)), add(points[1], multiply(rightTangent, dist)), points[1]];
	}


	// Assign parameter values to digitized points using relative distances between points.
	var u = [0];
	for (let i = 1; i < len; ++i)
		u.push(u[i-1] + norm(subtract(points[i],points[i-1])));
	for (let i = 0; i < len; ++i)
		u[i] /= u[len-1];


	var bezCurve = [points[0], points[0], points[len-1], points[len-1]];
	var C = [0,0,0,0];
	var X = [0,0];

	for (let i = 0; i < len; ++i) {
		var ui = u[i];
		var ux = 1 - ui
		var A = multiply(leftTangent, 3 * ux * ux * ui);
		var B = multiply(rightTangent, 3 * ux * ui * ui);

		C[0] += dot(A,A);
		C[1] += dot(A,B);
		C[2] += dot(A,B);
		C[3] += dot(B,B);

		var tmp = subtract(points[i],bezier(bezCurve,ui));
		X[0] += dot(A,tmp);
		X[1] += dot(B,tmp);
	}


	var det_C0_C1 = (C[0] * C[3]) - (C[2] * C[1]);
	var det_C0_X  = (C[0] * X[1]) - (C[2] * X[0]);
	var det_X_C1  = (X[0] * C[3]) - (X[1] * C[1]);
	var alpha_l = det_C0_C1 === 0 ? 0 : det_X_C1 / det_C0_C1;
	var alpha_r = det_C0_C1 === 0 ? 0 : det_C0_X / det_C0_C1;
	var segLength = norm(subtract(points[0], points[len-1]));
	var epsilon = 1.0e-6 * segLength;

	if (alpha_l < epsilon || alpha_r < epsilon)
		alpha_l = alpha_r = segLength / 3;
	bezCurve[1] = add(bezCurve[0], multiply(leftTangent, alpha_l));
	bezCurve[2] = add(bezCurve[3], multiply(rightTangent, alpha_r));


	return bezCurve;
}
