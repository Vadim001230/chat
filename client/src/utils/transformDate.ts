export default function transformDate(str: string) {
  const date = new Date(str);
  const months = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Мая',
    'Июня',
    'Июля',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];
  const month = date.getMonth();
  const day = date.getDate().toString();
  const hour = date.getHours();
  let min = date.getMinutes().toString();
  min = +min < 10 ? `0${min}` : `${min}`;

  return hour <= 24
    ? `${hour}:${min}`
    : `${hour}:${min} • ${months[month]} ${day}`;
}
