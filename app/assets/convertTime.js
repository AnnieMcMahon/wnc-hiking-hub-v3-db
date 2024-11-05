export default function convertTime(time) {
  let hh = parseInt(time.slice(0, 2));
  let mm = time.slice(3, 5);
  let ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  hh = hh ? hh : 12;
  const formattedTime = hh + ":" + mm + " " + ampm;
  return formattedTime;
}
