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
   **********************************************************/
  const display = document.getElementById("res");


  /**********************************************************
   * STEP 3: GET ALL NUMBER BUTTONS
   * --------------------------------------------------------
   * We select buttons inside #keys EXCEPT the Calculate button.
   *
   * CSS selector explanation:
   * #keys button        → all buttons inside #keys
   * :not(#calc)         → exclude Calculate button
   **********************************************************/
  const numberButtons = document.querySelectorAll(
    "#keys button:not(#calc)"
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


  /**********************************************************
   * STEP 6: HANDLE NUMBER BUTTON CLICKS
   * --------------------------------------------------------
   * When a number button is clicked:
   * → Its text (1,2,3...) is appended to the display
   **********************************************************/
  numberButtons.forEach(button => {
    button.addEventListener("click", () => {
      display.value += button.innerText;
    });
  });


  /**********************************************************
   * STEP 7: FUNCTION TO ADD OPERATORS SAFELY
   * --------------------------------------------------------
   * This function prevents:
   * → Starting with an operator (+12 ❌)
   * → Multiple operators in a row (12++ ❌)
   **********************************************************/
  function addOperator(operator) {

    // Do nothing if display is empty
    if (display.value === "") return;

    // Get the last character from the display
    const lastChar = display.value.slice(-1);

    // Prevent adding operator after another operator
    if ("+-*/".includes(lastChar)) return;

    // Add operator to the display
    display.value += operator;
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
   * eval() evaluates the math expression as JavaScript.
   *
   * Example:
   * "12+3*4" → 24
   *
   * try/catch prevents the app from crashing if input is invalid
   **********************************************************/
  calcBtn.addEventListener("click", () => {
    try {
      display.value = eval(display.value);
    } catch (error) {
      display.value = "Error";
    }
  });

});
