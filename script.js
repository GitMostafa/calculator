function operate(firstNumber, secondNumber, operator)
{
    if((firstNumber === "NAN") || (secondNumber === "NAN"))
    {
        return "NAN";
    }

    firstNumber = Number(firstNumber);
    secondNumber = Number(secondNumber);
    let result = 0;
    switch(operator)
    {
        case("+"):
            result = (firstNumber + secondNumber)
            break;
        
        case("-"):
            result = (firstNumber - secondNumber)
            break;
        
        case("*"):
            result = (firstNumber * secondNumber)
            break;

        case("/"):
            if(secondNumber === 0)
            {
                return "NAN";
            }
            result = (firstNumber / secondNumber)
            break;
    }
    if(Number.isInteger(result))
    {
        return `${result}`;
    }
    return result.toFixed(2);
}

let displayDiv = document.querySelector(".display");
let calcHistory = displayDiv.querySelector(".history_calc");
let calcResult = displayDiv.querySelector(".result_calc");
let firstNumChoice = "";
let secondNumChoice = "";
let operatorChoice = "";
let lastVarAddedToCalcResult = "";
let wasDecimalPointAdded = false;

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
    let buttonClass = button.getAttribute("class");

    button.addEventListener("mouseover", () => {
        button.style.transition = "0.2s ease";

        let isButtonDecimal = (buttonClass === "decimal_point");
        let isFirstNumDecimal = firstNumChoice.includes(".");
        let isSecondNumDecimal = secondNumChoice.includes(".");
        if(!(isButtonDecimal &&
            (((isFirstNumDecimal) && (lastVarAddedToCalcResult === "firstNum")) || ((isSecondNumDecimal) && (lastVarAddedToCalcResult === "secondNum")))))
        {
            if(calcResult.textContent.length < 25)
            {
                button.style.scale = "1.1";
            }
        }
    });

    button.addEventListener("mouseout", () => {
        button.style.scale = "1";
    });

    button.addEventListener("click", (e) => {
        if(calcResult.textContent.length < 25)
        {
            switch(buttonClass)
            {
                case "clear":
                    calcHistory.textContent = "";
                    calcResult.textContent = "";
                    firstNumChoice = "";
                    secondNumChoice = "";
                    operatorChoice = "";
                    lastVarAddedToCalcResult = "";
                    wasDecimalPointAdded = false;
                    break;

                case "delete":
                    if(calcResult.textContent !== "")
                    {
                        if(calcResult.textContent === "NAN")
                        {
                            calcHistory.textContent = "";
                            calcResult.textContent = "";
                            firstNumChoice = "";
                            lastVarAddedToCalcResult = "";
                        }
                        else
                        {
                            if(lastVarAddedToCalcResult === "operator")
                            {
                                calcResult.textContent = calcResult.textContent.slice(0, calcResult.textContent.length - 3);
                                operatorChoice = "";
                                lastVarAddedToCalcResult = "firstNum";
                            }
                            else if(lastVarAddedToCalcResult === "firstNum")
                            {
                                calcResult.textContent = calcResult.textContent.slice(0, calcResult.textContent.length - 1);
                                firstNumChoice = firstNumChoice.slice(0, firstNumChoice.length - 1);
                                if((firstNumChoice !== "") && (firstNumChoice.charAt(firstNumChoice.length - 1) === "."))
                                {
                                    wasDecimalPointAdded = true;
                                }
                                else
                                {
                                    wasDecimalPointAdded = false;
                                }

                                if(firstNumChoice === "")
                                {
                                    calcHistory.textContent = "";
                                    lastVarAddedToCalcResult = "";
                                }
                            }
                            else
                            {
                                calcResult.textContent = calcResult.textContent.slice(0, calcResult.textContent.length - 1);
                                secondNumChoice = secondNumChoice.slice(0, secondNumChoice.length - 1);
                                if((secondNumChoice !== "") && (secondNumChoice.charAt(secondNumChoice.length - 1) === "."))
                                {
                                    wasDecimalPointAdded = true;
                                }
                                else
                                {
                                    wasDecimalPointAdded = false;
                                }

                                if(secondNumChoice === "")
                                {
                                    lastVarAddedToCalcResult = "operator";
                                }
                            }
                        }
                    }
                    break;

                case "percentage":
                    if(calcResult.textContent !== "")
                    {
                        if(calcResult.textContent !== "NAN")
                        {
                            if(lastVarAddedToCalcResult === "firstNum")
                            {
                                if(wasDecimalPointAdded)
                                {
                                    calcResult.textContent += "0";
                                    firstNumChoice += "0";
                                    wasDecimalPointAdded = false;
                                }
                                calcHistory.textContent = calcResult.textContent + " / 100";
                                let calcResultNum = Number(calcResult.textContent);
                                calcResultNum /= 100;
                                if(Number.isInteger(calcResultNum))
                                {
                                    calcResult.textContent = `${calcResultNum}`;
                                }
                                else
                                {
                                    calcResult.textContent = calcResultNum.toFixed(2);
                                }
                                firstNumChoice = calcResult.textContent;
                            }
                            else if(lastVarAddedToCalcResult === "operator")
                            {
                                calcResult.textContent = "NAN";
                                firstNumChoice = calcResult.textContent;
                                operatorChoice = "";
                                secondNumChoice = "";
                                lastVarAddedToCalcResult = "firstNum";
                            }
                            else
                            {
                                if(wasDecimalPointAdded)
                                {
                                    calcResult.textContent += "0";
                                    secondNumChoice += "0";
                                    wasDecimalPointAdded = false;
                                }
                                let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                                calcHistory.textContent = initalResult + " / 100";
                                if(initalResult === "NAN")
                                {
                                    calcResult.textContent = "NAN";
                                }
                                else
                                {
                                    let currResult = Number(initalResult) / 100;
                                    if(Number.isInteger(currResult))
                                    {
                                        calcResult.textContent = `${currResult}`;
                                    }
                                    else
                                    {
                                        calcResult.textContent = currResult.toFixed(2);
                                    }
                                }
                                firstNumChoice = calcResult.textContent;
                                operatorChoice = "";
                                secondNumChoice = "";
                                lastVarAddedToCalcResult = "firstNum";
                            }
                        }
                        else
                        {
                            calcHistory.textContent = calcResult.textContent + " / 100";
                        }
                    }
                    else
                    {
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    break;

                case "decimal_point":
                    if(e.target.style.scale === "1.1")
                    {
                        if(lastVarAddedToCalcResult === "")
                        {
                            calcResult.textContent = "0.";
                            firstNumChoice = calcResult.textContent;
                            lastVarAddedToCalcResult = "firstNum";
                        }
                        else if(lastVarAddedToCalcResult === "firstNum")
                        {
                            calcResult.textContent += ".";
                            firstNumChoice = calcResult.textContent;
                            lastVarAddedToCalcResult = "firstNum";
                        }
                        else if(lastVarAddedToCalcResult === "operator")
                        {
                            calcResult.textContent += "0.";
                            secondNumChoice = "0.";
                            lastVarAddedToCalcResult = "secondNum";
                        }
                        else
                        {
                            calcResult.textContent += ".";
                            secondNumChoice += ".";
                            lastVarAddedToCalcResult = "secondNum";
                        }
                        button.style.scale = "1";
                        wasDecimalPointAdded = true;
                    }
                    break;

                case "divide_operator":
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        if(wasDecimalPointAdded)
                        {
                            firstNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcResult.textContent += " / ";
                        operatorChoice = "/";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "operator")
                    {
                        calcHistory.textContent = calcResult.textContent + "/";
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        operatorChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        if(wasDecimalPointAdded)
                        {
                            secondNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                        let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                        calcResult.textContent = initalResult + " / ";
                        firstNumChoice = initalResult;
                        operatorChoice = "/";
                        secondNumChoice = "";
                        lastVarAddedToCalcResult = "operator";
                    }
                    break;

                case "multiply_operator":
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        if(wasDecimalPointAdded)
                        {
                            firstNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcResult.textContent += " * ";
                        operatorChoice = "*";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "operator")
                    {
                        calcHistory.textContent = calcResult.textContent + "*";
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        operatorChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        if(wasDecimalPointAdded)
                        {
                            secondNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                        let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                        calcResult.textContent = initalResult + " * ";
                        firstNumChoice = initalResult;
                        operatorChoice = "*";
                        secondNumChoice = "";
                        lastVarAddedToCalcResult = "operator";
                    }
                    break;

                case "minus_operator":
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = "0 - ";
                        firstNumChoice = "0";
                        operatorChoice = "-";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        if(wasDecimalPointAdded)
                        {
                            firstNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcResult.textContent += " - ";
                        operatorChoice = "-";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "operator")
                    {
                        calcHistory.textContent = calcResult.textContent + "-";
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        operatorChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        if(wasDecimalPointAdded)
                        {
                            secondNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                        let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                        calcResult.textContent = initalResult + " - ";
                        firstNumChoice = initalResult;
                        operatorChoice = "-";
                        secondNumChoice = "";
                        lastVarAddedToCalcResult = "operator";
                    }
                    break;

                case "plus_operator":
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = "0 + ";
                        firstNumChoice = "0";
                        operatorChoice = "+";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        if(wasDecimalPointAdded)
                        {
                            firstNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcResult.textContent += " + ";
                        operatorChoice = "+";
                        lastVarAddedToCalcResult = "operator";
                    }
                    else if(lastVarAddedToCalcResult === "operator")
                    {
                        calcHistory.textContent = calcResult.textContent + "+";
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        operatorChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        if(wasDecimalPointAdded)
                        {
                            secondNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                        let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                        calcResult.textContent = initalResult + " + ";
                        firstNumChoice = initalResult;
                        operatorChoice = "+";
                        secondNumChoice = "";
                        lastVarAddedToCalcResult = "operator";
                    }
                    break;

                case "equals":
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        if(wasDecimalPointAdded)
                        {
                            firstNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                    }
                    else if(lastVarAddedToCalcResult === "operator")
                    {
                        calcHistory.textContent = calcResult.textContent + " = ";
                        calcResult.textContent = "NAN";
                        firstNumChoice = calcResult.textContent;
                        operatorChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        if(wasDecimalPointAdded)
                        {
                            secondNumChoice += "0";
                            calcResult.textContent += "0";
                            wasDecimalPointAdded = false;
                        }
                        calcHistory.textContent = calcResult.textContent;
                        let initalResult = operate(firstNumChoice, secondNumChoice, operatorChoice);
                        calcResult.textContent = initalResult;
                        firstNumChoice = initalResult;
                        operatorChoice = "";
                        secondNumChoice = "";
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    break;

                case "num":
                    let numberClicked = e.target.value;
                    let numberString = `${numberClicked}`;
                    if(wasDecimalPointAdded)
                    {
                        wasDecimalPointAdded = false;
                    }
                    if(lastVarAddedToCalcResult === "")
                    {
                        calcResult.textContent = numberString;
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else if(lastVarAddedToCalcResult === "firstNum")
                    {
                        calcResult.textContent += numberString
                        firstNumChoice = calcResult.textContent;
                        lastVarAddedToCalcResult = "firstNum";
                    }
                    else
                    {
                        calcResult.textContent += numberString;
                        secondNumChoice += numberString;
                        lastVarAddedToCalcResult = "secondNum";
                    }
                    break;
            }
        }
    });
});

