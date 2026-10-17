// Unit tests for calculator.js using Node's built-in test runner.
// Run with: npm test   (or: node --test test/)
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  tokenize,
  evaluate,
  formatResult,
  appendDigit,
  appendOperator,
  DivisionByZeroError,
} = require("../calculator.js");

test("tokenize splits numbers and operators", () => {
  assert.deepEqual(tokenize("12+3*4"), [12, "+", 3, "*", 4]);
});

test("tokenize treats a leading minus as a sign", () => {
  assert.deepEqual(tokenize("-5+3"), [-5, "+", 3]);
  assert.deepEqual(tokenize("2*-3"), [2, "*", -3]);
});

test("evaluate respects operator precedence", () => {
  assert.equal(evaluate("12+3*4"), 24);
  assert.equal(evaluate("20-6/2"), 17);
});

test("evaluate is left-associative for - and /", () => {
  assert.equal(evaluate("10-2-3"), 5);
  assert.equal(evaluate("8/2/2"), 2);
});

test("numbers with leading zeros are decimal, not octal", () => {
  // eval("010+1") returns 9 because 010 is legacy octal.
  assert.equal(evaluate("010+1"), 11);
  assert.equal(evaluate("08"), 8);
});

test("evaluate rejects malformed expressions", () => {
  for (const bad of ["", "12+", "*3", "1..2", "alert(1)", "2**3"]) {
    assert.throws(() => evaluate(bad), Error, `expected "${bad}" to throw`);
  }
});

test("dividing by zero throws instead of returning Infinity", () => {
  assert.throws(() => evaluate("5/0"), DivisionByZeroError);
  assert.throws(() => evaluate("1+8/0*2"), DivisionByZeroError);
  assert.equal(evaluate("0/5"), 0);
});

test("formatResult hides floating-point noise", () => {
  assert.equal(formatResult(evaluate("10/3")), "3.33333333333");
  assert.equal(formatResult(0.1 + 0.2), "0.3");
  assert.equal(formatResult(evaluate("1/3*3")), "1");
  assert.equal(formatResult(-42), "-42");
});

test("appendDigit builds numbers and restarts after results or errors", () => {
  assert.equal(appendDigit("12", "3"), "123");
  assert.equal(appendDigit("24", "5", true), "5");
  assert.equal(appendDigit("Error", "5"), "5");
  assert.equal(appendDigit("Can't divide by 0", "7"), "7");
});

test("appendOperator blocks invalid operator placement", () => {
  assert.equal(appendOperator("", "+"), "");
  assert.equal(appendOperator("12", "+"), "12+");
  assert.equal(appendOperator("12+", "+"), "12+");
  assert.equal(appendOperator("Error", "*"), "Error");
});
