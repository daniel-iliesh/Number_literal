const { log } = require("console");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

const suffixes = {
  1: [""],
  2: ["spre", "și"],
  3: ["sute", "sută"],
  4: ["mii", "mie"],
};

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

const additionals = {
  20: "int",
};

function resolveGroup(number) {
  let literalString = "";

  if (number.length == 1 && !parseInt(number)) {
    return literals[number][0];
  }
  for (let i = 0; i < number.length; i++) {
    if (number[i] == 0) {
      // handle zeros
      continue;
    }
    if (number.slice(-2) == 10 && number.length == 2) {
      // handle 10 alone
      literalString += literals[number.slice(-2)][0];
      break;
    } else if (
      number.length - i == 2 &&
      parseInt(number.slice(-2)) < 20 &&
      parseInt(number.slice(-2)) > 10
    ) {
      // handling from 11 to 19 exeption
      literalString += `${
        literals[number.slice(-2)[1]][1] || literals[number.slice(-2)[1]][0]
      }${suffixes[number.length - i][0]}${literals[10][0]}`;
      break;
    } else if (number.length - i == 2 && number.slice(i) >= 20) {
      // handling numbers between 20 and 99
      if (number.slice(i) % 10 == 0) {
        // handling round tens
        literalString += `${literals[number[i]][number[i] == 2 ? 1 : 0]}${
          literals[10][1]
        }`;
      } else if (number.slice(i) >= 60 && number.slice(i) < 70) {
        // handling 60 to 69 exeption
        literalString += `${literals[number[i]][1]}${literals[10][1]} ${
          suffixes[number.length - i][1]
        }`;
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
      }`;
    } else if (number[i] == 2 && number.length - i != 1) {
      // handle the 2 exception when not at the end of the number
      literalString += `${literals[number[i]][1]} ${
        suffixes[number.length - i][0]
      } `;
    } else {
      // in regular cases
      literalString += `${literals[number[i]][0]} ${
        suffixes[number.length - i][0]
      } `;
    }
  }

  return literalString;
}

function addSufix(groupNumber, currentGroup) {
  if (groupNumber % 2 == 1) {
    return currentGroup.length == 1 && currentGroup[0] == 1
      ? "ilion\n"
      : "ilioane\n";
  } else {
    return currentGroup.length == 1 && currentGroup[0] == 1
      ? "iliard\n"
      : "iliarde\n";
  }
}

function addPrefix(groupNumber) {
  let finalPrefix = "";

  if (groupNumber <= 22) {
    return latinPrefixes[Math.floor(((groupNumber - 1) * 3) / 6)];
  } else {
    // if there are more than 22 groups
  }
}

function generateGroupLiteral(groupNumber, currentGroup) {
  let theLiteral = "";

  if (parseInt(currentGroup) == 0) {
    return theLiteral;
  }

  if (resolveGroup(currentGroup).length == 1 || currentGroup < 20) {
    // if the number is just 1 digit or its lower than 20
    theLiteral = `${resolveGroup(currentGroup)} ${addPrefix(
      groupNumber
    )}${addSufix(groupNumber, currentGroup)} `;
  } else if (groupNumber == 2) {
    // handle thousands
    theLiteral = `${resolveGroup(currentGroup)} ${
      currentGroup >= 20 ? "de" : ""
    } ${resolveGroup(currentGroup).length == 1 ? "mie" : "mii"} `;
  } else {
    theLiteral = `${resolveGroup(currentGroup)}de ${addPrefix(
      groupNumber
    )}${addSufix(groupNumber, currentGroup)} `;
  }

  return theLiteral;
}

function resolveNumber(number) {
  const groups = BigInt(number).toLocaleString("en-US").split(",");
  let finalString = "";

  log(groups);

  for (let i = 0; i < groups.length; i++) {
    let groupNumber = groups.length - i;

    if (i != groups.length - 1) {
      // when not last
      finalString += generateGroupLiteral(groupNumber, groups[i]);
    } else {
      finalString += resolveGroup(groups[i]);
    }
  }
  return finalString;
}

function toLiteral(number) {
  if (number.length >= 5) {
    log(resolveNumber(number));
  } else {
    // if it's less than 9999
    log(resolveGroup(number));
  }
}

// todo handle when not a number is given
// todo handle when a negative number is given

rl.question("Give me a number...\n", (answer) => {
  toLiteral(answer);
  rl.close();
});
