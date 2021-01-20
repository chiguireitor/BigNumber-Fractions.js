const BigNumber = require('bignumber.js')

function bnIsNaN(a) {
	try {
		let x = new BigNumber(a)

		return x.isNaN()
	} catch (e) {
		return true
	}
}

var Fraction = function(n, d) {
	this.numerator;
	this.denominator;

	var numerator = new BigNumber(0);
	var denominator = new BigNumber(1);
	var frac;

	//If two numbers-like arguments are passed into the function
	if (typeof(arguments[0]) !== 'undefined' && typeof(arguments[1]) !== 'undefined') {
		numerator = new BigNumber(arguments[0]);
		denominator = new BigNumber(arguments[1]);

	}
	//Only a single number is present
	else if (typeof(arguments[0]) !== 'undefined') {
		if (typeof(arguments[0]) === 'string') {
			var number = arguments[0];

			if (number.indexOf('/') != -1) {
				numerator = new BigNumber(number.substring(0, number.indexOf('/')));
				denominator = new BigNumber(number.substring(number.indexOf('/') + 1, number.length));
			} else {
				numerator = new BigNumber(number);
			}
		} else {
			numerator = new BigNumber(arguments[0]);
		}
	}
	else {
		throw new Error("Arguments invalid");
	}

	if (!numerator.isInteger() || !denominator.isInteger()) {
			if (!numerator.isInteger()) { numerator = Fraction.decimalToFraction(numerator); }
			if (!denominator.isInteger()) { denominator = Fraction.decimalToFraction(denominator); }
			frac = Fraction.divide(numerator, denominator);
			numerator = frac.numerator;
			denominator = frac.denominator;
	}

	if (denominator.isZero()) {
		throw new Error("Cannot divide by zero");
	}

	this.numerator = numerator;
	this.denominator = denominator;

	this.simplify();

}

Fraction.prototype.multiply = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	return Fraction.change(this, Fraction.multiply(this, frac));
}
Fraction.prototype.divide = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	return Fraction.change(this, Fraction.divide(this, frac));
}
Fraction.prototype.add = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	return Fraction.change(this, Fraction.add(this, frac));
}
Fraction.prototype.subtract = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	return Fraction.change(this, Fraction.subtract(this, frac));
}
Fraction.prototype.simplify = function() {
	Fraction.correctArgumentLength(0, arguments.length);
	return Fraction.change(this, Fraction.simplify(this));
}
Fraction.prototype.toString = function() {
	return Fraction.toString(this);
}
Fraction.prototype.equals = function(frac) {
	return Fraction.equals(this, frac);
}
Fraction.prototype.valueOf = function() {
	return Fraction.valueOf(this);
}

Fraction.add = function(frac1, frac2) {
	Fraction.correctArgumentLength(2, arguments.length);
	frac1 = Fraction.toFraction(frac1)
	frac2 = Fraction.toFraction(frac2)

	var newFrac = frac1;
	newFrac.numerator = frac1.numerator.multipliedBy(frac2.denominator).plus(frac1.denominator.multipliedBy(frac2.numerator));
	newFrac.denominator = frac1.denominator.multipliedBy(frac2.denominator);
	return Fraction.simplify(newFrac);
}
Fraction.subtract = function(frac1, frac2) {
	Fraction.correctArgumentLength(2, arguments.length);
	frac1 = Fraction.toFraction(frac1);
	frac2 = Fraction.toFraction(frac2);

	var newFrac = frac1;
	newFrac.numerator = frac1.numerator.multipliedBy(frac2.denominator).minus(frac1.denominator.multipliedBy(frac2.numerator));
	newFrac.denominator = frac1.denominator.multipliedBy(frac2.denominator);
	return Fraction.simplify(newFrac);
}
Fraction.multiply = function(frac1, frac2) {
	Fraction.correctArgumentLength(2, arguments.length);
	frac1 = Fraction.toFraction(frac1);
	frac2 = Fraction.toFraction(frac2);

	var newFrac = frac1;
	newFrac.numerator = frac1.numerator.multipliedBy(frac2.numerator);
	newFrac.denominator = frac1.denominator.multipliedBy(frac2.denominator);
	return Fraction.simplify(newFrac);
}
Fraction.divide = function(frac1, frac2) {
	Fraction.correctArgumentLength(2, arguments.length);
	frac1 = Fraction.toFraction(frac1);
	frac2 = Fraction.toFraction(frac2);

	var newFrac = frac1;
	newFrac.numerator = frac1.numerator.multipliedBy(frac2.denominator);
	newFrac.denominator = frac1.denominator.multipliedBy(frac2.numerator);
	return Fraction.simplify(newFrac);
}

Fraction.simplify = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	frac = Fraction.toFraction(frac);

	var gcd = Fraction.greatestCommonDivisor(frac.numerator, frac.denominator);
	if (gcd.isEqualTo(1)) { return frac; }
	frac.numerator = frac.numerator.dividedBy(gcd);
	frac.denominator = frac.denominator.dividedBy(gcd);
	return frac;
}
Fraction.greatestCommonDivisor = function(num1, num2) {
	var greater;
	var lesser;

	if (!BigNumber.isBigNumber(num1)) num1 = new BigNumber(num1)
	if (!BigNumber.isBigNumber(num2)) num2 = new BigNumber(num2)

	num1 = num1.abs();
	num2 = num2.abs();
	greater = BigNumber.max(num1, num2);
	lesser = BigNumber.min(num1, num2);

	while (!lesser.isZero()) {
		var t = lesser;
		lesser = greater.modulo(lesser);
		greater = t;
	}
	return greater;
}
Fraction.toString = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	if (frac.denominator.isEqualTo(1)) { return "" + frac.numerator.toString(); }
	return "" + frac.numerator.toString() + "/" + frac.denominator.toString();
}
Fraction.equals = function(frac1, frac2) {
	Fraction.correctArgumentLength(2, arguments.length);
	frac1 = Fraction.toFraction(frac1);
	frac2 = Fraction.toFraction(frac2);

	frac1 = Fraction.simplify(frac1);
	frac2 = Fraction.simplify(frac2);
	return frac1.numerator.isEqualTo(frac2.numerator) && frac1.denominator.isEqualTo(frac2.denominator);
}
Fraction.valueOf = function(frac) {
	Fraction.correctArgumentLength(1, arguments.length);
	frac = Fraction.toFraction(frac);
	return frac.numerator.dividedBy(frac.denominator).toNumber();
}
Fraction.correctArgumentLength = function(ideal, actual) {
	if (ideal != actual) { throw new Error("" + ideal + " arguments needed"); }
}
Fraction.change = function(oldFrac, newFrac) {
	Fraction.correctArgumentLength(2, arguments.length);
	oldFrac.numerator = newFrac.numerator;
	oldFrac.denominator = newFrac.denominator;
	return oldFrac;
}
Fraction.isString = function(s) {
	return typeof(s) == "string" || (typeof(s) == 'object' && s.constructor == String)
}
Fraction.fromFraction = function(frac) {
	return typeof(frac) == 'object' && frac.constructor == Fraction;
}
Fraction.toFraction = function(x) {
	if (!Fraction.fromFraction(x)) {
		return new Fraction(x);
	}
	return x;
}
Fraction.decimalToFraction = function(x) {
	Fraction.correctArgumentLength(1, arguments.length);
	if (bnIsNaN(x)) { throw new Error("Argument invalid") }

	x = String(x);
	var decLocation = x.indexOf('.');
	if (decLocation != -1) {
		var whole = x.substring(0, decLocation);
		var isNegative = (whole.indexOf('-') != -1)? true: false;
		var remainder = x.substring(decLocation + 1, x.length);
		var nthPlace = Math.pow(10, remainder.length);
		if (isNegative) {
			return Fraction.subtract(new Fraction(Number(whole), 1), new Fraction(Number(remainder), nthPlace))
		} else {
			return Fraction.add(new Fraction(Number(whole), 1), new Fraction(Number(remainder), nthPlace))
		}
	}
	else { return new Fraction(Number(x)); }
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = Fraction;
}
