export default function transformJoinedDate(str: string) {
  const date = new Date(str);
  const months = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
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
    ? `${day} ${months[month]} в ${hour}:${min} `
    : `Сегодня в ${hour}:${min}`;
}
