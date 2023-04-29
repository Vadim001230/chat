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
  const day = date.getDate();
  const hour = date.getHours();
  let min = date.getMinutes().toString();
  min = +min < 10 ? `0${min}` : `${min}`;

  const now = new Date();
  const nowDay = now.getDate();
  const diff = now.getTime() - date.getTime();
  const diffInHours = diff / (1000 * 60 * 60);

  return diffInHours > 24 || nowDay !== day
    ? `${hour}:${min} ${months[month]} ${day}`
    : `${hour}:${min}`;
}
