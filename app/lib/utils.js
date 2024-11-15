import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const convertDate = (origDate) => {
  const date = dayjs(origDate).tz("America/New_York");
  const yyyy = date.year();
  const dddd = date.format("ddd");
  const mm = date.format("MM"); 
  const dd = date.format("DD");
  return `${dddd}, ${mm}/${dd}/${yyyy}`;
};

const convertTime = (time) => {
  let hh = parseInt(time.slice(0, 2));
  let mm = time.slice(3, 5);
  let ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  hh = hh ? hh : 12;
  const formattedTime = hh + ":" + mm + " " + ampm;
  return formattedTime;
};

export { convertDate, convertTime };




