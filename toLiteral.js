const { log } = require("console");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// romanian literals
const literals = {
  0: ["zero"],
  1: ["unu", "un", "o"],
  2: ["doi", "două"],
  3: ["trei"],
  4: ["patru", "pai"],
  5: ["cinci"],
  6: ["șase", "șai"],
  7: ["șapte"],
  8: ["opt"],
  9: ["nouă"],
  10: ["zece", "zeci"],
};
// romanian suffixes
const suffixes = {
  1: [""],
  2: ["spre", "și"],
  3: ["sute", "sută"],
  4: ["mii", "mie"],
};
// big numbers base prefixes
const latinPrefixes = {
  1: "m",
  2: "b",
  3: "tr",
  4: "cvadr",
  5: "cvint",
  6: "sext",
  7: "sept",
  8: "oct",
  9: "non",
  10: "dec",
  11: "un",
  12: "do",
  13: "tri",
  14: "cvadri",
  15: "quin",
  16: "sex",
  17: "septen",
  18: "octo",
  19: "novem",
  20: "vig",
  100: "googol",
};
// resolve 1 group of numbers ( 1 group is a number with 10^3 zeros)
function resolveGroup(number) {
  let literalString = "";

  if (number.length == 1 && !parseInt(number)) {
    // handle zero only
    return literals[number][0];
  }

  for (let i = 0; i < number.length; i++) {
    if (number[i] == 0) {
      // handle zeros
      continue;
    }

    if (number.slice(-2) == 10) {
      // handle 10s at the end

      if (parseInt(number) == 10) {
        literalString += "zece ";
        break;
      }

      if (number.slice(-3)[0] == 2) {
        literalString += `${literals[number[i]][1]} ${
          suffixes[number.length - i][0] + " zece "
        }`;
      } else if (number.slice(-3)[0] == 1) {
        literalString += `${literals[number[i]][2]} ${
          suffixes[number.length - i][1] + " zece "
        }`;
      } else {
        literalString += `${literals[number[i]][0]} ${
          suffixes[number.length - i][0] + " zece "
        }`;
      }
      break;
    } else if (
      number.length - i == 2 &&
      parseInt(number.slice(-2)) < 20 &&
      parseInt(number.slice(-2)) > 10
    ) {
      // handling from 11 to 19 exeption
      literalString += `${
        literals[number.slice(-2)[1]][1] || literals[number.slice(-2)[1]][0]
      }${suffixes[number.length - i][0]}${literals[10][0]} `;
      break;
    } else if (number.length - i == 2 && number.slice(i) >= 20) {
      // handling numbers between 20 and 99
      if (number.slice(i) >= 60 && number.slice(i) < 70) {
        // handling 60 to 69 exeption
        literalString += `${literals[number[i]][1]}${literals[10][1]}${
          number.slice(i) != 60 ? " " + suffixes[number.length - i][1] : ""
        } `;
      } else if (number.slice(i) % 10 == 0) {
        // handling round tens
        literalString += `${literals[number[i]][number[i] == 2 ? 1 : 0]}${
          literals[10][1]
        } `;
      } else {
        // handle the rest of 20 to 99
        literalString += `${literals[number[i]][number[i] == 2 ? 1 : 0]}${
          literals[10][1]
        } ${suffixes[number.length - i][1]} `;
      }
    } else if (number.length - i >= 3 && number[i] == 1) {
      // handle hundreds and thousands begining with 1

      literalString += `${literals[number[i]][2]} ${
        suffixes[number.length - i][1]
      } `;
    } else if (number[i] == 2 && number.length - i != 1) {
      // handle the 2 exception when not at the end of the number

      literalString += `${literals[number[i]][1]} ${
        suffixes[number.length - i][0]
      } `;
    } else {
      // in regular cases

      literalString += `${literals[number[i]][0]} ${
        suffixes[number.length - i][0] + " "
      }`;
    }
  }

  return literalString;
}
// generating a prefix based on the base prefixes from latinPrefixes map
function generateBigPrefix(groupNumber) {
  let finalPrefix = "";
  let numOfZeros = (groupNumber - 1) * 3;
  let position = Math.floor(numOfZeros / 6);

  if (position.toString().length >= 2) {
    // handle positions with 2 digits or higher

    if (position.toString()[0] == 1) {
      // handle from 10 to 19

      if (position.toString()[1] != 0) {
        // handle from 11 to 19

        finalPrefix = `${latinPrefixes[position]}${
          latinPrefixes[position.toString()[0] + "0"]
        }`;
      } else {
        // handle only 10

        finalPrefix = `${latinPrefixes[position]}`;
      }
    } else if (position.toString()[0] == 2) {
      // handle from 20 to 29

      if (position.toString()[1] == 0) {
        // handle 20 only

        finalPrefix = `${latinPrefixes[position.toString()[0] + "0"]}int`;
      } else {
        // handle from 21 to 29

        finalPrefix = `${latinPrefixes["1" + position.toString()[1]]}${
          latinPrefixes[position.toString()[0] + "0"]
        }int`;
      }
    } else {
      // handle higher than 29

      if (position.toString()[1] == 0) {
        // handle round position numbers till 100

        finalPrefix = `${latinPrefixes["1" + position.toString()[0]]}${
          latinPrefixes[20]
        }int`;
      } else {
        // handle the rest of numbers
        finalPrefix = `${latinPrefixes["1" + position.toString()[1]]}${
          latinPrefixes["1" + position.toString()[0]]
        }${latinPrefixes[20]}`;
      }
    }
  } else {
    // handle positions from 1 to 9
    finalPrefix = `${latinPrefixes[position]}`;
  }

  return finalPrefix;
}
// generating suffix ( ex. milion / miliard )
function generateBigSufix(groupNumber, currentGroup) {
  if ((groupNumber - 1) * 3 != 100) {
    if (groupNumber % 2 == 1) {
      return parseInt(currentGroup) == 1 ? "ilion " : "ilioane ";
    } else {
      return parseInt(currentGroup) == 1 ? "iliard " : "iliarde ";
    }
  } else {
    return " ";
  }
}
// join the bigPrefix and bigSufix results with logic for correct grammar
function generateBigLiteral(groupNumber, currentNumber) {
  let theLiteral = "";

  if (parseInt(currentNumber) == 0) {
    return theLiteral;
  } else if (groupNumber <= 2) {
    // handle thousands

    theLiteral = `${resolveGroup(currentNumber)}${
      currentNumber.slice(-2) >= 20 ? "de " : ""
    }${currentNumber.length == 1 ? "mie" : "mii"} `;
  } else if (currentNumber.length == 1 || currentNumber < 20) {
    // if the number is just 1 digit OR its lower than 20

    if (currentNumber == 1 || currentNumber == 2) {
      // when the number is 1 or 2 in the beginning
      theLiteral = `${literals[parseInt(currentNumber)][1]} ${generateBigPrefix(
        groupNumber
      )}${generateBigSufix(groupNumber, currentNumber)}`;
    } else {
      // for the rest of numbers from 1 to 20

      theLiteral = `${resolveGroup(currentNumber)} ${generateBigPrefix(
        groupNumber
      )}${generateBigSufix(groupNumber, currentNumber)}`;
    }
  } else {
    // handle default big prefixes with "de"

    theLiteral = `${resolveGroup(currentNumber)}${
      currentNumber.slice(-2) >= 20 ? "de " : ""
    }${generateBigPrefix(groupNumber)}${generateBigSufix(
      groupNumber,
      currentNumber
    )}`;
  }

  return theLiteral;
}
// join all number groups for the final answer
function generateFullLiteral(number) {
  const groups = BigInt(number).toLocaleString("en-US").split(",");
  let finalString = "";

  log(groups);

  for (let i = 0; i < groups.length; i++) {
    let groupNumber = groups.length - i;

    if (i != groups.length - 1) {
      // when not last
      finalString += generateBigLiteral(groupNumber, groups[i]);
    } else {
      finalString += resolveGroup(groups[i]);
    }
  }
  return finalString;
}
// main function, if number is just 1 group we call the function to solve the group - resolveGroup()
function toLiteral(number) {
  if (number.length >= 5) {
    log(generateFullLiteral(number));
  } else {
    // if it's less than 9999
    log(resolveGroup(number));
  }
}
// read from console the number
rl.question("Give me a number...\n", (answer) => {
  toLiteral(answer);
  rl.close();
});
