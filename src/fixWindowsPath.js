export default function fixWindowsPath(path) {
  if (process.platform === "win32") {
    return path.replace(/\\/g, "\\\\");
  }
  return path;
}
