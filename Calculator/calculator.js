var addPoint = true;
var arrayOfSign = new Array("+", "-", "x", "/");
var arrayOfSymbols = new Array("(", ")", ".");

function addToInput(elementToAdd) {
    $("#expression").val(function (_, inputValue) {
        if (inputValue != "0") {
            if (inputValue[inputValue.length - 1] == ")") {
                return inputValue + "x" + elementToAdd.value;
            }
            if (!isNaN(elementToAdd.value)) {
                calculate(inputValue + elementToAdd.value);
            }
            return inputValue + elementToAdd.value;
        } else {
            if (elementToAdd.value == ".") {
                return inputValue + elementToAdd.value;
            } else {
                if (!isNaN(elementToAdd.value)) {
                    calculate(elementToAdd.value);
                }

                return inputValue = "" + elementToAdd.value;
            }
        }
    });
}

function addSignToInput(elementToAdd) {
    addPoint = true;
    $("#expression").val(function (_, inputValue) {
        if (arrayOfSign.includes(inputValue[inputValue.length - 1])) {
            if ((inputValue[inputValue.length - 1] == "x" || inputValue[inputValue.length - 1] == "/") && elementToAdd.value == "-") {
                return inputValue + elementToAdd.value;
            } else if (arrayOfSign.includes(inputValue[inputValue.length - 2])) {
                return inputValue;
            } else {
                let pos = $("#expression").val().lastIndexOf(inputValue[inputValue.length - 1]);
                return inputValue.substring(0, pos) + elementToAdd.value;
            }

        } else if (inputValue[inputValue.length - 1] == ".") {
            return inputValue + "0" + elementToAdd.value;
        } else if (inputValue[inputValue.length - 1] == "(") {

            if (elementToAdd.value == "-") {
                return inputValue + elementToAdd.value;
            } else {
                return inputValue;
            }

        } else {
            return inputValue + elementToAdd.value;
        }

    })
}

function addComma(elementToAdd) {
    let lastString = $("#expression").val().substring($("#expression").val().length - 1);
    if (!arrayOfSign.includes(lastString) && !arrayOfSymbols.includes(lastString) && addPoint == true) {
        addPoint = false;
        addToInput(elementToAdd);
    }
}

function clearOne() {
    $("#expression").val(function (_, inputValue) {
        let lastString = inputValue.substring(inputValue.length - 1);
        let expression = inputValue;
        if (expression.length > 1) {
            let expression_separe = new Array();
            let helper = "";

            for (let i = 0; i < expression.length; i++) {
                if (!arrayOfSign.includes(expression[i])) {
                    helper += expression[i];
                } else {
                    let toPutInArray = expression.substring(0, i + 1);
                    expression_separe.push(toPutInArray);
                    expression = expression.replace(toPutInArray, "");
                    i = -1;
                    helper = "";
                }
            }

            if (helper != "") {
                expression_separe.push(helper);
            }
            if (!expression_separe[expression_separe.length - 1].includes(".") || lastString == ".") {
                addPoint = true;
            } else {
                addPoint = false;
            }

            inputValue = inputValue.substring(0, inputValue.length - 1);

            if (!isNaN(lastString)) {
                calculate(inputValue);
            }
            return inputValue;
        } else {
            $("#expression, .span").each(function () {
                $(this).val("0");
            })

            return inputValue = "0";
        }
    });
}

function clearAll() {
    $("#expression, .span").val(function (_, inputValue) {
        addPoint = true;
        return inputValue = "0";
    })
}

function addParantheses(elementToAdd) {
    addPoint = true;
    $("#expression").val(function (_, inputValue) {
        let attr = elementToAdd.getAttribute("id");
        let numberOfOpens = (inputValue.match(/\(/g) || []).length - (inputValue.match(/\)/g) || []).length
        if (attr == "par2") {
            if (numberOfOpens > 0) {
                if (arrayOfSign.includes(inputValue[inputValue.length - 1])) {
                    return inputValue;
                } else {
                    return inputValue + elementToAdd.value;
                }

            } else {
                return inputValue;
            }
        } else {
            if (inputValue[inputValue.length - 1] == "(") {
                return inputValue;
            } else if (inputValue[inputValue.length - 1] == ".") {
                return inputValue + "0" + "x" + elementToAdd.value;
            } else {
                if (!isNaN(inputValue[inputValue.length - 1]) || inputValue[inputValue.length - 1] == ")") {
                    return inputValue + "x" + elementToAdd.value;
                } else {
                    return inputValue + elementToAdd.value;
                }
            }
        }
    })
}

function calculate(inputValue) {
    $(".span").val(function (_, inputValue2) {
        while (arrayOfSign.includes(inputValue[inputValue.length - 1]) || inputValue[inputValue.length - 1] == "(" || inputValue[inputValue.length - 1] == ".") {
            inputValue = inputValue.substring(0, inputValue.length - 1);
        }

        let calculated = "";
        while (inputValue.includes(")")) {
            let stringOnLeft = inputValue.substring(0, inputValue.indexOf(")"))
            let correspondingOpen = stringOnLeft.lastIndexOf("(");
            let expressionWithParentheses = inputValue.substring(correspondingOpen, inputValue.indexOf(")") + 1);
            let expressionInParentheses = expressionWithParentheses.substring(1, expressionWithParentheses.length - 1);
            calculated = calculateAll(expressionInParentheses);
            inputValue = inputValue.replace(expressionWithParentheses, calculated);
        }

        while (inputValue.includes("(")) {
            let expressionRigthParentheses = inputValue.substring(inputValue.lastIndexOf("("));
            let expressionRigthWithoutParentheses = inputValue.substring(inputValue.lastIndexOf("(") + 1);
            calculated = calculateAll(expressionRigthWithoutParentheses);

            let last = inputValue.lastIndexOf(expressionRigthParentheses);
            inputValue = inputValue.substring(0, last) + calculated + inputValue.substring(last + expressionRigthParentheses.length);
        }

        for (let i = 0; i < inputValue.length; i++) {
            if (arrayOfSign.includes(inputValue[i])) {
                calculated = calculateAll(inputValue);
                inputValue = inputValue.replace(inputValue, calculated);
                break;
            }
        }

        inputValue = replacer(inputValue, "", "");
        if (inputValue[0] == "+")
            inputValue = inputValue.replace("+", "");
        return inputValue2 = inputValue;
    });
}

function calculateAll(expression) {

    let add, sub, div, mul, toBack, toFront, symbol;

    while (expression.includes("x") || expression.includes("/")) {
        mul = expression.indexOf("x");
        div = expression.indexOf("/");

        if (mul == -1 || (mul > div && div != -1)) {
            toBack = expression.substring(0, div);
            toFront = expression.substring(div + 1, expression.length);
            symbol = "/";

        }

        if (div == -1 || (div > mul && mul != -1)) {
            toBack = expression.substring(0, mul)
            toFront = expression.substring(mul + 1, expression.length);
            symbol = "x";
        }
        expression = divMul(toBack, toFront, symbol, expression);

    }

    while (expression.includes("+") || expression.includes("-")) {
        if (expression[0] == "+" || expression[0] == "-") {
            if (expression.substring(1, expression.length).includes("+") || expression.substring(1, expression.length).includes("-")) {
                add = expression.substring(1, expression.length).indexOf("+") + 1;
                sub = expression.substring(1, expression.length).indexOf("-") + 1;

                if (sub == 0 || (sub > add && add != 0)) {
                    toBack = expression.substring(0, add);
                    toFront = expression.substring(add + 1, expression.length);
                    symbol = "+"
                }

                if (add == 0 || (add > sub && sub != 0)) {
                    toBack = expression.substring(0, sub);
                    toFront = expression.substring(sub + 1, expression.length);
                    symbol = "-"
                }
            } else {
                break;
            }
        } else {
            add = expression.substring(0, expression.length).indexOf("+");
            sub = expression.substring(0, expression.length).indexOf("-");

            if (sub == -1 || (sub > add && add != -1)) {
                toBack = expression.substring(0, add);
                toFront = expression.substring(add + 1, expression.length);
                symbol = "+"
            }

            if (add == -1 || (add > sub && sub != -1)) {
                toBack = expression.substring(0, sub);
                toFront = expression.substring(sub + 1, expression.length);
                symbol = "-"
            }
        }
        expression = addSub(toBack, toFront, symbol, expression);
    }
    return expression;
}

function divMul(toBack, toFront, symbol, expression) {
    let numberone = "", numbertwo = "", calcule = "", formula = "";

    if (toBack.includes("+") || arrayOfSign.includes("-")) {
        let add = toBack.lastIndexOf("+");
        let sub = toBack.lastIndexOf("-");
        if (sub > add) {
            numberone = toBack.substring(sub, toBack.length);
        } else {
            numberone = toBack.substring(add + 1, toBack.length);
        }
    } else {
        numberone = toBack;
    }

    numbertwo = processToFront(toFront);

    if (numbertwo == "") {
        if (parseFloat(numberone) >= 0) {
            calcule = "+" + numberone;
        }
    } else {
        if (symbol == "/") {
            formula = numberone + "/" + numbertwo;
            calcule = doDecimalSafeMath(numberone, symbol, numbertwo).toString();
        } else {
            formula = numberone + "x" + numbertwo;
            calcule = doDecimalSafeMath(numberone, symbol, numbertwo).toString();
        }

        if (parseFloat(calcule) >= 0) {
            calcule = "+" + calcule;
        }
    }
    return expression = replacer(expression, formula, calcule);
}

function addSub(toBack, toFront, symbol, expression) {
    let numberone = "", numbertwo = "", calcule = "", formula = "";
    numberone = toBack;
    numbertwo = processToFront(toFront);
    if (numbertwo == "") {
        if (parseFloat(numberone) >= 0) {
            calcule = "+" + numberone;
        }
    } else {

        if (symbol == "+") {
            formula = numberone + "+" + numbertwo;
            calcule = doDecimalSafeMath(numberone, symbol, numbertwo).toString();
        } else {
            formula = numberone + "-" + numbertwo;
            calcule = doDecimalSafeMath(numberone, symbol, numbertwo).toString();
        }

        if (parseFloat(calcule) >= 0) {
            calcule = "+" + calcule;
        }

    }

    return expression = replacer(expression, formula, calcule);
}

function processToFront(toFront) {
    let numbertwo = "";
    for (let i = 0; i < toFront.length; i++) {
        if (i != 0 && arrayOfSign.includes(toFront[i])) {
            break;
        } else {
            numbertwo += toFront[i];
        }
    }
    return numbertwo;
}

function doDecimalSafeMath(a, operation, b, precision) {
    function decimalLength(numStr) {
        var pieces = numStr.toString().split(".");
        if (!pieces[1]) return 0;
        return pieces[1].length;
    }

    precision = precision || Math.pow(10, Math.max(decimalLength(a), decimalLength(b)));

    a = a * precision;
    b = b * precision;

    var operator;
    switch (operation.toLowerCase()) {
        case '-':
            operator = function (a, b) { return a - b; }
            break;
        case '+':
            operator = function (a, b) { return a + b; }
            break;
        case 'x':
            precision = precision * precision;
            operator = function (a, b) { return a * b; }
            break;
        case '/':
            precision = 1;
            operator = function (a, b) { return a / b; }
            break;

        default:
            operator = operation;
    }

    var result = operator(a, b);
    return result / precision;
}

function replacer(expression, formula, calcule) {
    if (!formula == "") {
        expression = expression.replace(formula, calcule);
    }

    if (expression.includes("--")) {
        expression = expression.replace("--", "+");
    }

    if (expression.includes("+-")) {
        expression = expression.replace("+-", "-");
    }

    if (expression.includes("-+")) {
        expression = expression.replace("-+", "-");
    }

    if (expression.includes("++")) {
        expression = expression.replace("++", "+");
    }
    return expression;
}

function equals() {
    $("#expression").val(function (_, inputValue) {
        if (($(".span").val() != "Infinity")) {
            if ($(".span").val().includes("."))
                addPoint = false;
            else
                addPoint = true;
            return inputValue = $(".span").val();
        } else {
            return inputValue;
        }
    })
}