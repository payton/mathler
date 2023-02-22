/**
 * Returns a new string with the character at the given index replaced with the given replacement string.
 * 
 * Required due to JavaScript's lack of immutable strings.
 */
export function replaceChar(
  string: string,
  index: number,
  replacement: string
) {
  return (
    string.substring(0, index) +
    replacement +
    string.substring(index + replacement.length)
  );
}

/**
 * Gets the current time in the format hh:mm:ss AM/PM
 */
export function getDisplayTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if (hh > 12) {
    session = "PM";
  }

  let time =
    (hh < 10 ? "0" + hh : hh) +
    ":" +
    (mm < 10 ? "0" + mm : mm) +
    ":" +
    (ss < 10 ? "0" + ss : ss) +
    " " +
    session;

  return time;
}
