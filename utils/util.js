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
  for (let i = 0; i < array.length; i++) {
    if (array[i] == txt) return i
  }
}

function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || "ceil"; //"ceil","floor","round"
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {

      var k = Math.pow(10, prec);
      console.log();

      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function easy_number_format(number) {
  if(typeof(number)== typeof(undefined)){
    return '0.00'
  }
  if (number.toString().includes(',')){
    return number
  }
  return number_format(number, 2, ".", ",",'floor')
}


function delcommafy(num) {
  if (typeof(num) != typeof(undefined)) {
    var x = num.toString().split(',');
    return parseFloat(x.join(""));
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  generateId: generateId,
  formatAmount: number_format,
  formatAmountEasy: easy_number_format,
  findIndexInArray: findIndexInArray,
  removeNumberFormat: delcommafy,
}