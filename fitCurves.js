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
	- The math.js library is no longer required.
	- Some bugs were fixed.
*/

/*
	points - An array of points (ex. [[0,0],[1,5],[3,7]]) that reside on the
	curve to fit.

	maxError - How closely the returned Cubic Bezier Curve should fit to the
	given points. This should be a number greater than 0, with a lesser number
	giving a closer fit.

	return - An array of arrays of the four points required for a Cubic Bezier Curve.
*/
function fitCurve(points,maxError) {
	// math.js functions used in this file
	var add = (A,B) => [A[0]+B[0],A[1]+B[1]];
	var subtract = (A,B) => [A[0]-B[0],A[1]-B[1]];
	var multiply = (A,B) => [A[0]*B,A[1]*B];
	var divide = (A,B) => [A[0]/B,A[1]/B];
	var dot = (A,B) => A[0]*B[0]+A[1]*B[1];
	var sum = A => A[0]+A[1];
	var norm = A => Math.sqrt((A[0]*A[0])+(A[1]*A[1]));
	var normalize = v => divide(v,norm(v));

	// native js implementations of 'lodash' functions
	let last = A => A[A.length-1];
	function zip(A,B) {
		var ret = [];
		for (var i = 0, len = A.length; i < len; ++i)
			ret.push([A[i],B[i]]);
		return ret;
	}


	var bezier = {
		q: (ctrlPoly,t) => add(add(add(multiply(ctrlPoly[0], Math.pow(1-t,3)), multiply(ctrlPoly[1], 3 * Math.pow(1-t,2) * t)), multiply(ctrlPoly[2], 3 * (1 - t) * Math.pow(t,2))), multiply(ctrlPoly[3], Math.pow(t,3))),
		qprime: (ctrlPoly,t) => add(add(multiply(subtract(ctrlPoly[1], ctrlPoly[0]), 3 * Math.pow(1-t,2)), multiply(subtract(ctrlPoly[2], ctrlPoly[1]), 6 * (1 - t) * t)), multiply(subtract(ctrlPoly[3], ctrlPoly[2]), 3 * Math.pow(t,2))),
		qprimeprime: (ctrlPoly,t) => add(multiply(add(subtract(ctrlPoly[2], multiply(ctrlPoly[1], 2)), ctrlPoly[0]), 6 * (1-t)), multiply(add(subtract(ctrlPoly[3], multiply(ctrlPoly[2], 2)), ctrlPoly[1]), 6 * t))
	};

	function fitCubic(points, leftTangent, rightTangent, error) {
		if (points.length == 2) {
			var dist = norm(subtract(points[0], points[1])) / 3;
			return [[points[0], add(points[0], multiply(leftTangent, dist)), add(points[1], multiply(rightTangent, dist)), points[1]]];
		}


		function generateBezier(points, parameters, leftTangent, rightTangent) {
			var bezCurve = [points[0], null, null, last(points)];
			var A = Array(parameters.length).fill([[0,0],[0,0]]);

			for (var i = 0, len = parameters.length; i < len; ++i) {
				var u = parameters[i];
				A[i][0] = multiply(leftTangent, 3 * (1 - u) * (1 - u) * u);
				A[i][1] = multiply(rightTangent, 3 * (1 - u) * u * u);
			}

			var C = [[0,0],[0,0]];
			var X = [0,0];
			var ref = zip(points, parameters);

			for (var i = 0, len = ref.length; i < len; ++i) {
				C[0][0] += dot(A[i][0],A[i][0]);
				C[0][1] += dot(A[i][0],A[i][1]);
				C[1][0] += dot(A[i][0],A[i][1]);
				C[1][1] += dot(A[i][1],A[i][1]);

				var tmp = subtract(ref[i][0], bezier.q([points[0], points[0], last(points), last(points)], ref[i][1]));

				X[0] += dot(A[i][0],tmp);
				X[1] += dot(A[i][1],tmp);
			}

			var det_C0_C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
			var det_C0_X = C[0][0] * X[1] - C[1][0] * X[0];
			var det_X_C1 = X[0] * C[1][1] - X[1] * C[0][1];
			var alpha_l = det_C0_C1 === 0 ? 0 : det_X_C1 / det_C0_C1;
			var alpha_r = det_C0_C1 === 0 ? 0 : det_C0_X / det_C0_C1;
			var segLength = norm(subtract(points[0], last(points)));
			var epsilon = 1.0e-6 * segLength;

			if (alpha_l < epsilon || alpha_r < epsilon) {
				bezCurve[1] = add(bezCurve[0], multiply(leftTangent, segLength / 3));
				bezCurve[2] = add(bezCurve[3], multiply(rightTangent, segLength / 3));
			} else {
				bezCurve[1] = add(bezCurve[0], multiply(leftTangent, alpha_l));
				bezCurve[2] = add(bezCurve[3], multiply(rightTangent, alpha_r));
			}

			return bezCurve;
		}

		var u = [0];
		for (var i = 1, len = points.length; i < len; ++i)
			u.push(u[i-1] + norm(subtract(points[i],points[i-1])));
		for (var i = 0, len = u.length; i < len; ++i)
			u[i] /= last(u);


		function computeMaxError(points, bez, parameters) {
			var maxDist = 0;
			var splitPoint = points.length / 2;
			var ref = zip(points,parameters);

			for (var i = 0, len = ref.length; i < len; ++i) {
				var dist = Math.pow(norm(subtract(bezier.q(bez,ref[i][1]),ref[i][0])),2);
				if (dist > maxDist) {
					maxDist = dist;
					splitPoint = i;
				}
			}

			return [maxDist, splitPoint];
		}

		var bezCurve = generateBezier(points, u, leftTangent, rightTangent);
		var ref = computeMaxError(points, bezCurve, u);
		var maxError = ref[0];
		var splitPoint = ref[1];

		if (maxError < error) return [bezCurve];


		function reparameterize(points, parameters) {
			var ref = zip(points, parameters);
			var results = [];

			function newtonRaphsonRootFind(point,u) {
				// Newton's root finding algorithm calculates f(x)=0 by reiterating x_n+1 = x_n - f(x_n)/f'(x_n)
				// We are trying to find curve parameter u for some point p that minimizes
				// the distance from that point to the curve. Distance point to curve is d=q(u)-p.
				// At minimum distance the point is perpendicular to the curve.
				// We are solving f = q(u)-p * q'(u) = 0 with f' = q'(u) * q'(u) + q(u)-p * q''(u)
				// gives u_n+1 = u_n - |q(u_n)-p * q'(u_n)| / |q'(u_n)**2 + q(u_n)-p * q''(u_n)|

				var d = subtract(bezier.q(bezCurve,u),point);
				var qprime = bezier.qprime(bezCurve,u);
				var numerator = sum(multiply(d,qprime));
				var denominator = sum(add([qprime[0]*qprime[0],qprime[1]*qprime[1]],multiply(bezier.qprimeprime(bezCurve,u),d)));

				return (!denominator ? 0 : (u - numerator / denominator));
			}

			for (var i = 0, len = ref.length; i < len; ++i)
				results.push(newtonRaphsonRootFind(ref[i][0], ref[i][1]));

			return results;
		}

		if (maxError < error*error) {
			for (var i = 0; i < 20; ++i) {
				var uPrime = reparameterize(points, u);
				bezCurve = generateBezier(points, uPrime, leftTangent, rightTangent);
				var temp = computeMaxError(points, bezCurve, uPrime);
				maxError = temp[0], splitPoint = temp[1];

				if (maxError < error) return [bezCurve];

				u = uPrime;
			}
		}

		var centerTangent = normalize(subtract(points[splitPoint-1], points[splitPoint+1]));

		var beziers = [].concat(fitCubic(points.slice(0,splitPoint+1), leftTangent, centerTangent, error));
		return beziers.concat(fitCubic(points.slice(splitPoint), multiply(centerTangent,-1), rightTangent, error));
	}

	var leftTangent = normalize(subtract(points[1],points[0]));
	var rightTangent = normalize(subtract(points[points.length-2],last(points)));
	return fitCubic(points,leftTangent,rightTangent,maxError);
}
