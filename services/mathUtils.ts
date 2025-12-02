/**
 * Safely evaluates a mathematical expression string.
 * Supports basic operators, trigonometry (Rad/Deg), and constants.
 */

const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

export const evaluateExpression = (expression: string, isDegree: boolean = false): string => {
  try {
    if (!expression) return '';

    // 1. Sanitize: Allow only numbers, operators, brackets, and specific Math functions
    let cleanExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/sin\(/g, 'sin(') // Use custom wrapper
      .replace(/cos\(/g, 'cos(') // Use custom wrapper
      .replace(/tan\(/g, 'tan(') // Use custom wrapper
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/\^/g, '**');

    // Handle Percentage: "50+10%" -> "50 + (50 * 0.10)" simplified to /100 for basic calc
    // If % is strictly used as operator: 100 * 10% -> 100 * 0.10
    cleanExpr = cleanExpr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    
    // Handle Factorial
    cleanExpr = cleanExpr.replace(/(\d+)!/g, 'factorial($1)');

    // 2. Security Check
    // Allowed: digits, operators, parens, points, whitespace, commas, and our function names
    if (/[^0-9+\-*/().\sMathPIEfactoriallogsinctsqrt,]+/.test(cleanExpr.replace(/factorial|Math|sin|cos|tan/g, ''))) {
       throw new Error("Invalid characters");
    }

    // 3. Define Trig helpers based on Mode
    const toRad = (n: number) => isDegree ? n * (Math.PI / 180) : n;
    
    // Custom wrapper functions injected into evaluation scope
    const sin = (n: number) => {
        const rad = toRad(n);
        // Fix floating point errors for common angles (e.g. sin(180) should be 0)
        if (isDegree && n % 180 === 0) return 0;
        return Math.sin(rad);
    };
    const cos = (n: number) => {
        const rad = toRad(n);
        if (isDegree && (n - 90) % 180 === 0) return 0;
        return Math.cos(rad);
    };
    const tan = (n: number) => {
        const rad = toRad(n);
        if (isDegree && (n - 90) % 180 === 0) return Infinity; // or huge number
        return Math.tan(rad);
    };

    // 4. Create a safe evaluation function
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const safeEval = new Function('factorial', 'sin', 'cos', 'tan', `return ${cleanExpr}`);
    
    const result = safeEval(factorial, sin, cos, tan);

    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    }

    // Smart Formatting
    // If result is huge or tiny, use exponential
    if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-9 && result !== 0)) {
       return result.toExponential(4).replace('+', '');
    }

    // Otherwise standard precision, removing trailing zeros (parseFloat handles this)
    const formatted = parseFloat(result.toPrecision(12)).toString();
    return formatted;

  } catch (error) {
    // console.error(error); // Quiet error for live preview
    return "Error";
  }
};
