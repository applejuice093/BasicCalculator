/************************************************************
 * calculator.js - pure calculation logic (no DOM access)
 * ----------------------------------------------------------
 * The UI used to pass the display text straight to eval().
 * That executes *any* JavaScript typed into the box and
 * treats numbers with a leading zero ("010") as legacy octal.
 *
 * This module parses the expression itself instead:
 *   1. tokenize()  → splits "12+3*4" into numbers and operators
 *   2. evaluate()  → applies * and / before + and - (precedence)
 *
 * It works both in the browser (window.Calculator) and in
 * Node.js (require("./calculator.js")) so it can be unit tested.
 ************************************************************/
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Calculator = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const OPERATORS = "+-*/";

  /** Thrown when an expression divides by zero (eval() returned Infinity). */
  class DivisionByZeroError extends Error {
    constructor() {
      super("Division by zero");
      this.name = "DivisionByZeroError";
    }
  }

  /**
   * Split an expression string into tokens.
   * A "-" at the start, or directly after another operator,
   * is treated as the sign of the following number.
   * @param {string} expression
   * @returns {Array<number|string>} numbers and operator characters
   */
  function tokenize(expression) {
    const tokens = [];
    let i = 0;
    const text = String(expression).replace(/\s+/g, "");

    while (i < text.length) {
      const ch = text[i];
      const prev = tokens[tokens.length - 1];
      const expectNumber = tokens.length === 0 || typeof prev === "string";

      if (/[0-9.]/.test(ch) || (ch === "-" && expectNumber)) {
        let j = i + 1;
        while (j < text.length && /[0-9.]/.test(text[j])) j++;
        const literal = text.slice(i, j);
        if (!/^-?(\d+\.?\d*|\.\d+)$/.test(literal)) {
          throw new Error("Invalid number: " + literal);
        }
        tokens.push(Number(literal)); // Number("010") === 10, not octal 8
        i = j;
      } else if (OPERATORS.includes(ch)) {
        if (expectNumber) throw new Error("Unexpected operator: " + ch);
        tokens.push(ch);
        i++;
      } else {
        throw new Error("Invalid character: " + ch);
      }
    }
    return tokens;
  }

  /**
   * Evaluate an arithmetic expression with + - * / and the
   * usual precedence (* and / before + and -).
   * @param {string} expression e.g. "12+3*4"
   * @returns {number} e.g. 24
   * @throws {DivisionByZeroError} when dividing by zero
   * @throws {Error} when the expression is empty or malformed
   */
  function evaluate(expression) {
    const tokens = tokenize(expression);
    if (tokens.length === 0) throw new Error("Empty expression");
    if (typeof tokens[tokens.length - 1] === "string") {
      throw new Error("Expression ends with an operator");
    }

    // Pass 1: fold * and / into the running term.
    const terms = [tokens[0]];
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const value = tokens[i + 1];
      if (op === "*") terms[terms.length - 1] *= value;
      else if (op === "/") {
        if (value === 0) throw new DivisionByZeroError();
        terms[terms.length - 1] /= value;
      }
      else terms.push(op, value);
    }

    // Pass 2: apply + and - from left to right.
    let result = terms[0];
    for (let i = 1; i < terms.length; i += 2) {
      result = terms[i] === "+" ? result + terms[i + 1] : result - terms[i + 1];
    }
    return result;
  }

  /**
   * Turn a result into display text, hiding binary floating-point
   * noise such as 10/3 = 3.3333333333333335 or 0.1+0.2 = 0.30000000000000004.
   * @param {number} value
   * @returns {string}
   */
  function formatResult(value) {
    return String(parseFloat(value.toPrecision(12)));
  }

  return { OPERATORS, DivisionByZeroError, tokenize, evaluate, formatResult };
});
