# BasicCalculator

A small calculator that runs in the browser, written in plain HTML, CSS and
JavaScript with no frameworks and no build step.

## Features

- Addition, subtraction, multiplication and division with normal operator
  precedence (`12+3*4` = `24`)
- Negative numbers (`-5+3`, `2*-3`)
- **C** clears the display and **⌫** deletes the last character
- Keyboard support: `0`-`9`, `+ - * /`, `Enter` or `=` to calculate,
  `Backspace` to delete, `Escape` to clear
- Friendly errors: `Can't divide by 0` and `Error` for incomplete expressions
- Results are rounded so `10/3` shows `3.33333333333`, not
  `3.3333333333333335`
- Scales down on small phone screens

## Run it

There is nothing to install. Either:

- open `index.html` directly in a browser, or
- serve the folder locally, for example:

  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page layout: display, number keys and operator keys |
| `Calc.css` | Styling and the small-screen layout |
| `calculator.js` | Pure calculation logic (parsing, evaluating, input rules). No DOM code, so it can be tested in Node |
| `Calc.js` | Connects the buttons and keyboard to `calculator.js` and updates the display |
| `test/calculator.test.js` | Unit tests for `calculator.js` |

## How it works

`calculator.js` never uses `eval()`. It splits the expression into numbers
and operators (`tokenize`), then evaluates it in two passes: first `*` and
`/`, then `+` and `-` from left to right. This means only arithmetic is
accepted, and numbers like `010` are read as ten (`eval()` would have read
them as the octal number 8).

## Tests

The tests use Node's built-in test runner, so no packages are needed
(Node.js 18 or newer):

```bash
npm test
```
