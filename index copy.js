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
  3: "mii",
  6: "m",
  12: "b",
  18: "tr",
  24: "cvadr",
  30: "cvint",
  36: "sext",
  42: "sept",
  48: "oct",
  54: "non",
  60: "dec",
  100: "googol",
};

const prefixeNumereMariMici = {
  66: "un",
  72: "do",
  78: "tri",
  84: "cvadri",
  90: "quin",
  96: "se",
  102: "septen",
  108: "octo",
  114: "novem",
  120: "vig",
  153: "cincizeci de quintrilioane",
};

const additionals = {
  20: "int",
};

function resolveGroup(number) {
  let literalString = "";

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
        } ${suffixes[number.length - i][1]}`;
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
      }`;
    } else {
      // in regular cases
      literalString += `${literals[number[i]][0]} ${
        suffixes[number.length - i][0]
      }`;
    }
  }

  return literalString;
}

function addSufix(numberOfZeros, currentGroup) {
  if (numberOfZeros % 2 == 0) {
    return currentGroup.length == 1 && currentGroup[0] == 1
      ? "ilion"
      : "ilionane";
  } else {
    return currentGroup.length == 1 && currentGroup[0] == 1
      ? "iliard"
      : "iliarde";
  }
}

function addPrefix(numOfZeros) {
  return latinPrefixes[numOfZeros] == undefined
    ? latinPrefixes[numOfZeros - 3]
    : latinPrefixes[numOfZeros];
}

function generateGroupLiteral(numOfZeros, currentGroup) {
  let theLiteral = "";

  if (resolveGroup(currentGroup).length == 1) {
    theLiteral = `${resolveGroup(currentGroup)} ${addPrefix(
      numOfZeros
    )}${addSufix(numOfZeros, currentGroup)}`;
  } else {
    theLiteral = `${resolveGroup(currentGroup)}de ${addPrefix(
      numOfZeros
    )}${addSufix(numOfZeros, currentGroup)}`;
  }

  return theLiteral;
}

function resolveNumber(number) {
  const groups = BigInt(number).toLocaleString("en-US").split(",");
  let numOfZeros = (groups.length - 1) * 3;
  let finalString = "";
  log(`Number of groups ${groups.length}`);
  log(
    `higher order number is ${addPrefix(numOfZeros)}${addSufix(
      numOfZeros,
      groups[0]
    )}`
  );
  log(groups);

  for (let i = 0; i < groups.length; i++) {
    if (numOfZeros > 3 && i != groups.length - 1) {
      finalString += generateGroupLiteral(numOfZeros, groups[i]);
    } else if (numOfZeros == 3) {
      finalString +=
        resolveGroup(groups[i]) + `de ${latinPrefixes[numOfZeros]}`;
    } else {
      finalString += resolveGroup(groups[i]);
    }
    if (numOfZeros > 0) {
      numOfZeros -= 3;
    } else {
      break;
    }
  }
  log(finalString);
}

function toLiteral(number) {
  if (number.length >= 5) {
    resolveNumber(number);
  } else {
    // if it's less than 9999
    resolveGroup(number);
  }
}

// todo handle when not a number is given
// todo handle when a negative number is given

rl.question("Give me a number...\n", (answer) => {
  toLiteral(answer);
  rl.close();
});
