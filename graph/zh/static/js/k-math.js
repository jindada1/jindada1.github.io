/**
 * k-math.js v1.0.0
 * (c) 2021 Kris Huang
 * Released under the MIT License.
 */

/**
 * Calculate combinations count
 * 
 * @param {number} M Number of objects
 * @param {number} n Number of samples
 */
function Combination(M, n) {
    if (M < n) return 0;

    if (M === n || n === 0) return 1;

    let result = 1;

    // count M!/n!
    for (var i = n + 1; i <= M; i++)
        result *= i;

    // count 1/(M-n)!
    for (i = 2; i <= M - n; i++)
        result /= i;

    return result;
}

/**
 * Count exponentiation. (base*base*...*base)
 * 
 * @param {float} base base number
 * @param {number} exponent exponent, should be natural number
 */
function power(base, exponent) {
    if (exponent === 0) return 1;
    if (base === 0) return 0;

    let result = 1;
    for (let i = 0; i < exponent; i++)
        result *= base;

    return result;
}

/**
 * Probability mass function.
 * The probability of getting exactly k successes in n independent Bernoulli trials
 * 
 * @param {number} k Number of success times
 * @param {number} n Number of trials
 * @param {float} p Probability of success per trial
 */
function probabilityMass(k, n, p) {
    return Combination(n, k) * power(p, k) * power(1 - p, n - k);
}

/**
 * FIGURE 3. binomial distribution: X ~ B(n, p).
 * 
 * @param {number} numTrials Number of trials n
 * @param {float} propertySucc Probability of success p
 */
function binominalExperience(numTrials, propertySucc) {
    result = [];
    for (let t = 0; t <= numTrials; t++) {
        result.push(probabilityMass(t, numTrials, propertySucc));
    }
    return result;
}

/**
 * Gaussian distribution generator
 * Reference : https://stackoverflow.com/questions/35356343/html5-draw-gaussian-function-using-beziercurveto
 * 
 * @param {Float} mean 均值
 * @param {Float} std  标准差
 */
var Gaussian = function (mean, std) {
    var mean = mean;
    var std = std;
    var a = 1 / Math.sqrt(2 * Math.PI);

    return {
        get: function (x) {
            var f = a / std;
            var p = -1 / 2;
            var c = (x - mean) / std;
            c *= c;
            p *= c;
            return f * Math.pow(Math.E, p);
        }
    }
};

/**
 * Calculate definite integral of Gaussian function using gauss error function
 * Reference : https://en.wikipedia.org/wiki/Error_function
 * 
 * @param {Float} mean  均值
 * @param {Float} std   标准差
 * @param {Float} from  定积分起点
 * @param {Float} to    定积分终点
 */
function definiteIntegralofGaussian(mean, std, from, to) {
    var std_from = (from - mean) / (std * Math.sqrt(2))
    var std_to = (to - mean) / (std * Math.sqrt(2))
    return (math.erf(std_to) - math.erf(std_from)) / 2;
};