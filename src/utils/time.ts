//封装一个函数，判断时间
export const getTime = () => {
  //通过内置构造函数Date
  const hours = new Date().getHours()
  let message = ''
  if (hours >= 6 && hours < 9) {
    message = '早上'
  } else if (hours >= 9 && hours < 12) {
    message = '上午'
  } else if (hours >= 12 && hours < 14) {
    message = '中午'
  } else if (hours >= 14 && hours < 18) {
    message = '下午'
  } else if (hours >= 18 && hours < 22) {
    message = '晚上'
  } else {
    message = '深夜'
  }
  return message
}
