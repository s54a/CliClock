function exitCliClock(interval) {
  const stopHandler = (key) => {
    if (key === "\u001B") {
      // Escape key
      clearInterval(interval);
      console.log("CLI Clock Stopped.");
      process.stdin.removeListener("data", stopHandler); // Remove the event listener
      process.exit();
    }
  };

  // Listen for "keypress" event on stdin
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", stopHandler);
}

export default exitCliClock;
