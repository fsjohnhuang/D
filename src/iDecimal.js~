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
  
  factory(function(name){return _deps[name]}
	  , window)
}(function (require, exports){
  var VERSION = "0.0.1"
  var utils = require("utils")
  var calc = require("calc")

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
    var struct = this.struct()
    var result = []
    for (var i = 0; i < struct.m.length; ++i){
      result.push(struct.m[i])
    }
    result = result.join('')
    var dVal = struct.rs - result.length
    if (dVal > 0){
      result = (0).toPrecision(dVal) + result
    }
    else{
      dVal *= -1
      result = result.substr(0, dVal) + '.' + result.substr(dVal)
    }
    if (result[0] === '.'){
      result = '0' + result
    }
    return (struct.s < 0 ? '-' : '') + result
  }

  iDecimal.add = function(opr1, opr2){
    opr1 = iDecimal(opr1).struct()
    opr2 = iDecimal(opr2).struct()

    calc.matchExp(opr1, opr2)
    var sum = calc.addSignificant(opr1, opr2)
    
    return iDecimal(sum)
  }
  iDecimal.sub = function(minuend, subtractor){}

  exports.iDecimal = iDecimal
}, 
{"utils": function(require, exports){
  var sLen = require("global").sLen

  var structure = exports.structure = function(num){
    return structure[typeof(num)](num)
  }  
  structure["number"] = function(num){
    return structure['string'](String(num))
  }
  structure["string"] = function(num){
    num = num.replace(/^[\s]u3000]*|[\s]u3000]*$/g, '')
    var pIdx = num.indexOf('.')
    var strNum = num.replace(/[-+.]/g, '')
    var m = [], 
    	times = strNum.length / 5, 
	additionE = 0,
	len = strNum.length
    for (var i = times - 1; i >= 0; ++i){
      m.push(strNum.slice(len - i*sLen, additionE > 0 ? len : (i+1)*sLen) 
		      + paddingZero(additionE))
    }
    return {
	    s: /^-/.test(num) ? -1 : 1,
	    rs: num.length - pIdx - 1 + additionE,
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

},
"calc": function(require, exports){
  var utils = require("utils")
  var sLen = require("global").sLen

  exports.matchExp = function(opr1, opr2){
    var maxRs = Math.max(opr1.rs, opr2.rs)
    if (maxRs - opr1.rs){
    	opr1.m.push(parseInt(utils.paddingZero(maxRs - opr1.rs)))
    }
    if (maxRs - opr2.rs){
    	opr2.m.push(parseInt(utils.paddingZero(maxRs - opr1.rs)))
    }
    opr1.rs = opr2.rs = maxRs
  }
  exports.addSignificant = function(opr1, opr2){
    var cf = 0, sum = [], ceil = parseInt('1' + utils.paddingZero(sLen)), floor = 0
    var s1 = opr1.s, 
	s2 = opr2.s, 
        m1 = opr1.m.reverse(),
        m2 = opr2.m.reverse()
    var l = Math.max(m1.length, m2.length)
    var m = null, s = s1
    for (var i = 0; i < l; ++i){
      if (!m1[i]) m1.push(0)
      if (!m2[i]) m2.push(0)

      if (m1[i] < (m2[i] + s2*cf) && s1 !== s2){
        cf = -1
	m = s1*Math.pow(10, sLen) + m1[i] + s2*m2[i] + s1*cf
      }
      else{
      	m = s1*m1[i] + s2*m2[i] + s2*cf
      }

      if (m >= s1*ceil){
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
	    m: m
    }
  }
}, 
"global": {
  sLen: 5
}}, ["global", "utils", "calc"]))
