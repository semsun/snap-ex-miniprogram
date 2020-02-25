const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const generateId = length => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

const findIndexInArray = (array, txt) => {
  for( let i = 0; i < array.length; i++ ) {
    if(array[i] == txt) return i
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  generateId: generateId,
  findIndexInArray: findIndexInArray
}