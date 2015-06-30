var fitCurve = require('../lib/fitCurves');
var _ = require('lodash');

var expectedResult;
var actualResult;

var assertSame = function (a, b) {
    if (Math.abs(a - b) > 1.0e-6) {
        throw new Error(a + " isn't " + b);
    }
};

var verifyMatch = function(expectedResult, actualResult){
    console.log(expectedResult);
    console.log("VS");
    console.log(actualResult);
    console.log("------");
    assertSame(expectedResult.length, actualResult.length);
    expectedResult.forEach(function (expectedBezierCurve, i) {
        var actualBezierCurve = actualResult[i];
        _.zip(actualBezierCurve, expectedBezierCurve).forEach(function (pairs) {
            assertSame(pairs[0][0], pairs[1][0]);
            assertSame(pairs[0][1], pairs[1][1]);
        });
    });
};

// These ground truth results generated by Python version

expectedResult = [
    [[0, 0], [20.27317402, 20.27317402], [-1.24665147, 0], [20, 0]]
];
actualResult = fitCurve([[0, 0], [10, 10], [10, 0], [20, 0]], 50);
verifyMatch(expectedResult, actualResult);


expectedResult = [
    [[0, 0], [ 22.76142375,  22.76142375], [ 2.6429774,  7.3570226], [10,  0]],
    [[10,  0], [ 12.3570226,  -2.3570226], [ 16.66666667,   0], [20,  0]]
];
actualResult = fitCurve([[0, 0], [10, 10], [10, 0], [20, 0]], 1);
verifyMatch(expectedResult, actualResult);

expectedResult = [
    [   [ 244, 92 ],
        [ 284.2727272958473, 105.42424243194908 ],
        [ 287.98676736182495, 85 ],
        [ 297, 85 ]
    ]
];
actualResult = fitCurve([
    [244,92],[247,93],[251,95],[254,96],[258,97],[261,97],[265,97],[267,97],
    [270,97],[273,97],[281,97],[284,95],[286,94],[289,92],[291,90],[292,88],
    [294,86],[295,85],[296,85],[297,85]], 10);
verifyMatch(expectedResult, actualResult);

console.log('OK');
