/*!
 * iDecimal is a standalone decimal library which to solve the problems like 0.2 + 0.1 === 0.30000000000000004.
 * @author : fsjohnhuang
 * @version: v0.1.0
 * @license: MIT
 */
;(function (factory, deps, seq){
  var _deps = {}
  for (var i = 0, k; i < seq.length; ++i){
    k = seq[i]
    _deps[k] = {}
    if (typeof deps[k] === "function"){
      deps[k](function(n){return _deps[n]}, _deps[k])
    }
    else{
      _deps[k] = deps[k]
    }
  }
  
  factory(function(name){return _deps[name]}, _deps["main"] = {})
  for (var k in _deps["main"]){
    window[k] = _deps["main"][k]
  }
}(function (require, exports){
  var VERSION = "0.1.0"
  var utils = require("utils")
  var calc = require("calc")
  var cfg = require("global").cfg

  /* 构造函数
   * @constructor
   * @public
   * @param {Number|DOMString} num - The raw number value, excludes scientific notation
   * @returns {iDecimal}
   */
  var iDecimal = function(num){
    if (this instanceof iDecimal);else return new iDecimal(num)
    
    if (num instanceof iDecimal) return num
    var s = utils.structure(num)
    this.struct = function(){
      return {
	    s: s.s,
	    rs: s.rs,
	    m: [].concat(s.m),
	    r: s.r
      }
    }
  }

  /* 字符串输出
   * @method
   * @public
   * @returns {DOMString}
   */
  iDecimal.prototype.toString = function(){
    return utils.toString(this.struct())
  }
  /* 数值输出
   * @method
   * @public
   * @returns {number}
   */
  iDecimal.prototype.valueOf = function(){
    return utils.valueOf(this.toString())
  }


  /* 设置全局配置信息
   * @method
   * @public
   * @static
   * @param {POJO} - cfg
   */
  iDecimal.config = function(cfg){
    for (var k in cfg){
      require('global').cfg[k] = cfg[k]
    }
  }
  /* 加法
   * @method
   * @public
   * @static
   * @param {Number|DOMString|iDecimal|structPOJO} opr1
   * @param {Number|DOMString|iDecimal|structPOJO} opr2
   * @returns {iDecimal}
   */
  iDecimal.add = function(opr1, opr2){
    opr1 = iDecimal(opr1).struct()
    opr2 = iDecimal(opr2).struct()

    calc.matchExp(opr1, opr2)
    var sum = calc.addSignificant(opr1, opr2)
    
    return utils.normalize(sum)
  }
  /* 减法
   * @method
   * @public
   * @static
   * @param {Number|DOMString|iDecimal|structPOJO} minuend
   * @param {Number|DOMString|iDecimal|structPOJO} substractor 
   * @returns {iDecimal}
   */
  iDecimal.minus = iDecimal.sub = function(minuend, subtractor){
    minuend = iDecimal(minuend).struct()
    subtractor = iDecimal(subtractor).struct()
    subtractor.s *= -1

    calc.matchExp(minuend, subtractor)
    var sum = calc.addSignificant(minuend, subtractor)
    
    return utils.normalize(sum)
  }
  /* 乘法
   * @method
   * @public
   * @static
   * @param {Number|DOMString|iDecimal|structPOJO} opr1
   * @param {Number|DOMString|iDecimal|structPOJO} opr2 
   * @returns {iDecimal}
   */
  iDecimal.mul = function(opr1, opr2){
    opr1 = iDecimal(opr1).struct()
    opr2 = iDecimal(opr2).struct()

    var rs = opr1.rs + opr2.rs
    var dObj = calc.mulSignificant(opr1.m, opr2.m)
    rs += (cfg.digit - (dObj.struct().rs + rs)%cfg.digit)%cfg.digit

    var struct = iDecimal({s: opr1.s*opr2.s, rs: rs, m:dObj.struct().m}).struct()

    return utils.normalize(struct)
  }
  /* 除法
   * @method
   * @public
   * @static
   * @param {Number|DOMString|iDecimal|structPOJO} dividend
   * @param {Number|DOMString|iDecimal|structPOJO} divisor 
   * @returns {iDecimal}
   */
  iDecimal.div = function(dividend, divisor){
    dividend = iDecimal(dividend).struct()
    divisor = iDecimal(divisor).struct()

    var rs = dividend.rs - divisor.rs
    calc.matchExp(dividend, divisor)
    var dObj = calc.divSignificant(dividend, divisor)
    rs += (cfg.digit - (dObj.rs + rs)%cfg.digit)%cfg.digit

    var struct = iDecimal({s: dividend.s*divisor.s
	    , rs: rs
	    , m:dObj.m
	    , r: iDecimal({s: dividend.s*divisor.s
		    , rs: dObj.r.struct().rs
		    , m: dObj.r.struct().m})}).struct()

    return utils.normalize(struct)
  }

  exports.iDecimal = iDecimal
}, 
{"utils": function(require, exports){
  var cfg = require("global").cfg

  /* 构造iDecimal内部结构体实例
   * @method
   * @internal
   * @param {Number|DOMString|structPOJO} num 
   * @returns {structPOJO}
   */
  var structure = exports.structure = function(num){
    return structure[typeof(num)](num)
  }  
  structure["number"] = function(num){
    return structure['string'](String(num))
  }
  structure["string"] = function(num){
    num = num.replace(/^[0\s\u3000]*|[\s\u3000]*$/g, '')
    var pIdx = num.indexOf('.')
    var strNum = num.replace(/[-+.]/g, '').replace(/^0*/g, '')
    var rs = pIdx === -1 ? 0 : num.length - pIdx - 1
        , additionalRs = 0
    // 格式化为rs === n*cfg.digit
    strNum += paddingZero(additionalRs = (cfg.digit - rs%cfg.digit)%cfg.digit)
    strNum = strNum.split('').reverse()
    var m = [], 
    	times = strNum.length / 5, 
	len = null
    // 采用little-Endian字节序方式存储有效数
    for (var i = 0; i < times; ++i){
      m.push(parseInt(strNum.splice(0, cfg.digit).reverse().join('')))
    }
    return {
	    s: /^-/.test(num) ? -1 : 1, // 符号位
	    rs: rs + additionalRs,      // 向右移位数
	    m: m,			// 有效数序列
	    r: null                     // 余数
    }
  }
  structure["object"] = function(num){
    return {
	    s: num.s,
	    rs: num.rs,
	    m: num.m,
	    r: num.r
    }
  }

  /* 零填充
   * @method
   * @internal
   * @param {Number} count - 零的个数
   * @returns {DOMString}
   */
  var paddingZero = exports.paddingZero = function(count){
    if (count < 1) return ''
    return (0).toPrecision(count).replace('.', '')
  }

  /* 转换为规格化的iDecimal实例
   * @method
   * @internal
   * @param {structPOJO} struct
   * @returns {iDecimal}
   */
  var normalize = exports.normalize = function(struct){
    var tStruct = iDecimal(toString(struct)).struct()
    return iDecimal({s: tStruct.s, rs: tStruct.rs, m: tStruct.m, r: struct.r})
  }

  /* 字符串输出
   * @method
   * @internal
   * @param {structPOJO} struct
   * @returns {DOMString}
   */
  var toString = exports.toString = function(struct){
    var result = []
    for (var i = 0; i < struct.m.length; ++i){
      var m = struct.m[i] + ''
      result.push(paddingZero(cfg.digit - m.length) + m)
    }
    result = result.reverse().join('').replace(/^0*/g,'')
    var dVal = struct.rs - result.length
    if (dVal > 0){
      result = (0).toPrecision(dVal) + (dVal === 1 ? '.' : '') + result
    }
    else if (struct.rs){
      dVal *= -1
      result = result.substr(0, dVal) + '.' + result.substr(dVal)
    }
    if (result[0] === '.'){
      result = '0' + result
    }
    result = (struct.s < 0 ? '-' : '') + result
    return result.indexOf('.') === -1 ? result
    				      : result.replace(/0*$/g, '')
  }
  var valueOf = exports.valueOf = function(val){
    return Number(val)
  }
},
"calc": function(require, exports){
  var utils = require("utils")
  var cfg = require("global").cfg


  /* 对阶
   * @method
   * @internal
   * @param {structPOJO} opr1
   * @param {structPOJO} opr2
   */
  exports.matchExp = function(opr1, opr2){
    var maxRs = Math.max(opr1.rs, opr2.rs)
    for (var i = 0, len = arguments.length; i < len; ++i){
      for (var j = 0, append = (maxRs - arguments[i].rs) / cfg.digit; j < append; ++j){
        arguments[i].m.unshift(0)
      }
    }
    opr1.rs = opr2.rs = maxRs
  }

  /* 有效数域相加
   * @method
   * @internal
   * @param {structPOJO} opr1
   * @param {structPOJO} opr2
   * @returns {structPOJO}
   */
  var addSignificant = exports.addSignificant = function(opr1, opr2){
    return addSignificant[opr1.s*opr2.s](opr1, opr2)
  }
  /* 同号-有效数域相加 */
  addSignificant["1"] = function(opr1, opr2){
    var cf = 0, sum = [], ceil = parseInt('1' + utils.paddingZero(cfg.digit)), floor = 0
    var s1 = opr1.s,
	s2 = opr2.s,
        m1 = opr1.m,
        m2 = opr2.m
    var l = Math.max(m1.length, m2.length)
    var m = null, s = s1
    for (var i = 0; i < l; ++i){
      m = s1*(m1[i]||0) + s2*(m2[i]||0) + s2*cf

      if (Math.abs(m) >= ceil){
      	cf = 1
      }
      else if (s1*m < floor){
        cf = s1 === s2 ? 1 : -1
      }
      s = Math.abs(m) === m ? 1 : -1
      sum.push(Math.abs(m))
    }

    return {
	    s: s,
	    rs: opr1.rs,
	    m: sum
    }
  }
  /* 异号-有效数域相加 */
  addSignificant["-1"] = function(opr1, opr2){
    var s1,s2,m1,m2
    var dVal = opr1.m.length - opr2.m.length
    if (!dVal){
      dVal = opr1.m[opr1.m.length - 1] - opr2.m[opr2.m.length - 1]
    }
    s1 = arguments[dVal >= 0 ? 0 : 1].s
    m1 = arguments[dVal >= 0 ? 0 : 1].m
    m2 = arguments[dVal >= 0 ? 1 : 0].m

    var cf = 0, m = 0, sum = []
    for (var i = 0, len = m1.length; i < len; ++i){
      m = m1[i] - (m2[i]||0) + cf
      if (m < 0){
	m = Math.pow(10, cfg.digit) + m1[i] - (m2[i]||0) + cf
        cf = -1
      }
      sum.push(m)
    }

    return {
	    s: s1,
	    rs: opr1.rs,
	    m: sum
    }
  }
  /* 有效数域相乘
   * @method
   * @internal
   * @param {m} opr1
   * @param {m} opr2
   * @returns {iDecimal}
   */
  exports.mulSignificant = function(m1, m2){
    var factors = []
    for (var i = 0, l = m1.length; i < l; ++i){
      for (var j = 0, jl = m2.length; j < jl; ++j){
	var strProduct = mul(m1[i], i, m2[j], j)
 	factors.push(require("main").iDecimal(strProduct))       
      }
    }

    var sum = factors[0] || require("main").iDecimal(0)
    for (var i = 1, l = factors.length; i < l; ++i){
      sum = require("main").iDecimal.add(sum, factors[i])
    }
    return sum
  }
  var mul = function(n1, i1, n2, i2){
    return (n1 * n2).toString() + utils.paddingZero(cfg.digit*(i1 + i2))
  }

  /* 有效数域相除
   * @method
   * @internal
   * @param {structPOJO} m1
   * @param {structPOJO} m2 
   * @returns {structPOJO}
   */
  var divSignificant = exports.divSignificant = function(m1, m2){
    var iDecimal = require("main").iDecimal
    var bias = 0, // bias为正数表示m2向m1最高位对齐，为负数表示m1向m2最高位对齐
	dVal = iDecimal({s:1, rs:0, m: m1.m}),
	rem = dVal,
	origDivisor = iDecimal({s:1, rs:0, m: m2.m}),
	divisor = null,
	over = false,
	factors = []
    while (!over){
      // 高位对齐
      bias = dVal.struct().m.length - origDivisor.struct().m.length
      if (bias > 0 && dVal.struct().s !== -1){
	var struct = origDivisor.struct()
	struct.m.unshift(0)
        divisor = iDecimal(struct)
      }
      else if ((bias === 0 && dVal.struct().s !== -1) || (bias > 0 && dVal.struct().s === -1)){
	bias = 0
        divisor = origDivisor
      }
      else{
        break
      }
      // 减法
      dVal = iDecimal.sub(rem, divisor)
      if (dVal.struct().s !== -1){
        rem = dVal
	var factor = []
        for (var i = 0; i < bias; ++i){
	  factor.push([0]) 
	}
	factor.push([1])
	factors.push(factor)
      }
    }
    var sum = iDecimal(0)
    for (var i = 0, len = factors.length; i < len; ++i){
      sum = iDecimal.add(sum, {s:1,rs:0,m:factors[i]})
    }

    return {
	    s: 1,
	    rs: 0,
	    m: sum.struct().m,
	    r: rem
    }
  }
}, 
"global": {
  cfg: {
    digit: 5 // 序列单元的位数
  }
}}, ["global", "utils", "calc"]))
