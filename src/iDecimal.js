/*!
 * iDecimal is a standalone decimal library which to solve the problems like 0.2 + 0.1 === 0.30000000000000004.
 * @author : fsjohnhuang
 * @version: v0.0.1
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
  var VERSION = "0.0.1"
  var utils = require("utils")
  var calc = require("calc")
  var cfg = require("global").cfg

  var iDecimal = function(num){
    if (this instanceof iDecimal);else return new iDecimal(num)
    
    if (num instanceof iDecimal) return num
    var s = utils.structure(num)
    this.struct = function(){
      return {
	    s: s.s,
	    rs: s.rs,
	    m: [].concat(s.m)
      }
    }
  }
  iDecimal.prototype.toString = function(){
    return utils.toString(this.struct())
  }
  iDecimal.prototype.valueOf = function(){
    return utils.valueOf(this.toString())
  }

  iDecimal.config = function(cfg){
    for (var k in cfg){
      require('global').cfg[k] = cfg[k]
    }
  }
  iDecimal.add = function(opr1, opr2){
    opr1 = iDecimal(opr1).struct()
    opr2 = iDecimal(opr2).struct()

    calc.matchExp(opr1, opr2)
    var sum = calc.addSignificant(opr1, opr2)
    
    return utils.normalize(sum)
  }
  iDecimal.minus = iDecimal.sub = function(minuend, subtractor){
    minuend = iDecimal(minuend).struct()
    subtractor = iDecimal(subtractor).struct()
    subtractor.s *= -1

    calc.matchExp(minuend, subtractor)
    var sum = calc.addSignificant(minuend, subtractor)
    
    return utils.normalize(sum)
  }
  iDecimal.mul = function(opr1, opr2){
    opr1 = iDecimal(opr1).struct()
    opr2 = iDecimal(opr2).struct()

    var rs = opr1.rs + opr2.rs
    var dObj = calc.mulSignificant(opr1.m, opr2.m)
    rs += (cfg.digit - (dObj.struct().rs + rs)%cfg.digit)%cfg.digit

    var struct = iDecimal({s: opr1.s*opr2.s, rs: rs, m:dObj.struct().m}).struct()

    return utils.normalize(struct)
  }
  iDecimal.div = function(dividend, divisor){
    // TODO
  }

  exports.iDecimal = iDecimal
}, 
{"utils": function(require, exports){
  var cfg = require("global").cfg

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
	    s: /^-/.test(num) ? -1 : 1,
	    rs: rs + additionalRs,
	    m: m
    }
  }
  structure["object"] = function(num){
    return {
	    s: num.s,
	    rs: num.rs,
	    m: num.m,
    }
  }

  var paddingZero = exports.paddingZero = function(count){
    if (count < 1) return ''
    return (0).toPrecision(count).replace('.', '')
  }

  var normalize = exports.normalize = function(struct){
    return iDecimal(toString(struct))
  }

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

  exports.matchExp = function(opr1, opr2){
    var maxRs = Math.max(opr1.rs, opr2.rs)
    for (var i = 0, len = arguments.length; i < len; ++i){
      for (var j = 0, append = (maxRs - arguments[i].rs) / cfg.digit; j < append; ++j){
        arguments[i].m.unshift(0)
      }
    }
    opr1.rs = opr2.rs = maxRs
  }
  var addSignificant = exports.addSignificant = function(opr1, opr2){
    return addSignificant[opr1.s*opr2.s](opr1, opr2)
  }
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
}, 
"global": {
  cfg: {
    digit: 5 // 位数
  }
}}, ["global", "utils", "calc"]))
