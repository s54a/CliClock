import chalk from "chalk";

export default function parseTimeInput(input) {
  input = input.toLowerCase(); // Convert input to lowercase
  const matches = input.match(/(\d+)\s*(h|m|s)(\s|$)?/g);
  if (!matches) {
    console.error(
      chalk.red("Invalid time format. Please use the format like '1h42m30s'.")
    );
    process.exit(1);
  }

  let totalSeconds = 0;
  const timeComponents = [];
  matches.forEach((match) => {
    const [value, unit] = match.split(/\s*(h|m|s)\s*/).filter(Boolean);

    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      console.error(
        chalk.red("Invalid time format. Please use numbers for time values.")
      );
      process.exit(1);
    }

    switch (unit) {
      case "h":
        totalSeconds += intValue * 3600;
        timeComponents.push(`${intValue} Hour${intValue !== 1 ? "s" : ""}`);
        break;
      case "m":
        totalSeconds += intValue * 60;
        timeComponents.push(`${intValue} Minute${intValue !== 1 ? "s" : ""}`);
        break;
      case "s":
        totalSeconds += intValue;
        timeComponents.push(`${intValue} Second${intValue !== 1 ? "s" : ""}`);
        break;
      default:
        console.error(
          chalk.red(
            "Invalid time format. Use 'h' for hours, 'm' for minutes, and 's' for seconds."
          )
        );
        process.exit(1);
    }
  });

  const formattedTime = formatTimeComponents(timeComponents);

  return { totalSeconds, formattedTime, input };
}

function formatTimeComponents(components) {
  let formattedString = "";
  for (let i = 0; i < components.length; i++) {
    if (i > 0) {
      if (i === components.length - 1) {
        formattedString += " and ";
      } else {
        formattedString += ", ";
      }
    }
    formattedString += components[i];
  }
  return formattedString;
}
