// Unit tests for calculator.js using Node's built-in test runner.
// Run with: npm test   (or: node --test test/)
const test = require("node:test");
const assert = require("node:assert/strict");
const { tokenize, evaluate } = require("../calculator.js");

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
