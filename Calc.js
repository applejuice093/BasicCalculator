/************************************************************
 * STEP 1: WAIT FOR HTML TO LOAD
 * ----------------------------------------------------------
 * The browser reads HTML from top to bottom.
 * If JavaScript runs before buttons exist in the page,
 * document.getElementById() will return null.
 *
 * DOMContentLoaded ensures:
 * → All HTML elements are available
 * → Safe to attach event listeners
 ************************************************************/
document.addEventListener("DOMContentLoaded", () => {

  /**********************************************************
   * STEP 2: GET THE DISPLAY ELEMENT
   * --------------------------------------------------------
   * This is the input box where:
   * → Numbers appear when buttons are clicked
   * → Result is shown after calculation
   *
   * It is readonly in index.html, so text can only enter it
   * through the buttons (and keyboard handler below) that
   * validate every keystroke.
   **********************************************************/
  const display = document.getElementById("res");


  /**********************************************************
   * STEP 3: GET ALL NUMBER BUTTONS
   * --------------------------------------------------------
   * We select buttons inside #keys EXCEPT Calculate, Clear
   * and Backspace.
   *
   * CSS selector explanation:
   * #keys button        → all buttons inside #keys
   * :not(#calc)         → exclude Calculate button
   * :not(.wide)         → exclude Clear and Backspace buttons
   **********************************************************/
  const numberButtons = document.querySelectorAll(
    "#keys button:not(#calc):not(.wide)"
  );


  /**********************************************************
   * STEP 4: GET OPERATOR BUTTONS (+ - * /)
   * --------------------------------------------------------
   * Each button is accessed using its unique ID
   **********************************************************/
  const addBtn   = document.getElementById("add");
  const subBtn   = document.getElementById("sub");
  const mulBtn   = document.getElementById("multi");
  const divBtn   = document.getElementById("div");


  /**********************************************************
   * STEP 5: GET THE CALCULATE BUTTON
   **********************************************************/
  const calcBtn = document.getElementById("calc");
  const clearBtn = document.getElementById("clear");
  const backBtn = document.getElementById("back");


  /**********************************************************
   * STEP 6: HANDLE NUMBER BUTTON CLICKS
   * --------------------------------------------------------
   * When a number button is clicked:
   * → Its text (1,2,3...) is appended to the display
   * → Right after a result or an error, it starts a new
   *   expression instead (see Calculator.appendDigit)
   *
   * justEvaluated remembers whether the display currently
   * shows the answer of the last calculation.
   **********************************************************/
  let justEvaluated = false;

  function addDigit(digit) {
    display.value = Calculator.appendDigit(display.value, digit, justEvaluated);
    justEvaluated = false;
  }

  numberButtons.forEach(button => {
    button.addEventListener("click", () => addDigit(button.innerText));
  });


  /**********************************************************
   * STEP 7: FUNCTION TO ADD OPERATORS SAFELY
   * --------------------------------------------------------
   * Calculator.appendOperator prevents:
   * → Starting with an operator (+12 ❌)
   * → Multiple operators in a row (12++ ❌)
   * → Operators after an error message (Error+ ❌)
   *
   * Pressing an operator after a result keeps the result,
   * so "24" then "+" continues with "24+".
   **********************************************************/
  function addOperator(operator) {
    display.value = Calculator.appendOperator(display.value, operator);
    justEvaluated = false;
  }


  /**********************************************************
   * STEP 8: ATTACH OPERATOR BUTTON EVENTS
   **********************************************************/
  addBtn.addEventListener("click", () => addOperator("+"));
  subBtn.addEventListener("click", () => addOperator("-"));
  mulBtn.addEventListener("click", () => addOperator("*"));
  divBtn.addEventListener("click", () => addOperator("/"));


  /**********************************************************
   * STEP 9: CALCULATE RESULT
   * --------------------------------------------------------
   * Calculator.evaluate() (from calculator.js) parses the
   * expression itself instead of running it through eval(),
   * so only numbers and + - * / are ever accepted.
   *
   * Example:
   * "12+3*4" → 24
   *
   * try/catch shows "Error" if the expression is invalid
   **********************************************************/
  calcBtn.addEventListener("click", () => {
    try {
      const result = Calculator.evaluate(display.value);
      display.value = Calculator.formatResult(result);
    } catch (error) {
      display.value =
        error instanceof Calculator.DivisionByZeroError
          ? "Can't divide by 0"
          : "Error";
    }
    justEvaluated = true;
  });


  /**********************************************************
   * STEP 10: CLEAR AND BACKSPACE
   * --------------------------------------------------------
   * C → empties the display
   * ⌫ → removes the last character (or clears an error)
   **********************************************************/
  function clearDisplay() {
    display.value = "";
    justEvaluated = false;
  }

  function deleteLast() {
    display.value = Calculator.backspace(display.value);
    justEvaluated = false;
  }

  clearBtn.addEventListener("click", clearDisplay);
  backBtn.addEventListener("click", deleteLast);

});
