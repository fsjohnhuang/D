/*!
 * D is a standalone decimal library which to solve the problems like 0.2 + 0.1 === 0.30000000000000004.
 * @author : fsjohnhuang
 * @version: v0.3.0
 * @license: MIT
 */
;(function(m/*odules*/, o/*rder*/, e/*xport*/, n/*ame*/){
  var VERSION = "0.3.0"
  var _m = {}, l = o.length
  for (var i = 0, k; i < o.length; ++i){
    k = o[i]
    _m[k] = {}
    if ("function" === typeof m[k]){
      m[k](function(n){if (!_m[n]) throw Error("module *" + n + "* is not loaded!"); return _m[n]}, _m[k])
    }
    else{
      _m[k] = m[k]
    }
  }
  var cmp = e[n || o[l-1]] = _m[o[l-1]][o[l-1]]
  // 暴露内部模块和方法，用于开发调试
  cmp["[[require]]"] = function(n){return _m[n]}
}({
  "global": function(r/*equire*/, e/*xport*/){
    var cfg = {
	    digits: 8   // 存储单位的位数
    	} 
    var config = e.config = function(val){
      return config[val && typeof val === "object" ? "set" : "get"](val)
    }
    config["set"] = function(val){
        for (var k in val){
          cfg[k] = val[k]
        }
    }
    config["get"] = function(val){
	return r("util").cp(cfg)
    }
  },
  "D": function(r/*equire*/, e/*xport*/){
    var global    = r("global"),
        primitive = r("primitive"),
        math      = r("math"),
        util      = r("util")

    function D(val){
      if (!(this instanceof D)) return new D(val)

      var structure = primitive.ctr(val)
      this.struct = function(){
        return util.cp(structure)
      }
    }
    D.prototype.toString = function(fmt){
      return primitive.structure2str(this.struct(), fmt)
    }

    D.config = function(cfg){
      return global.config(cfg)
    }
    D.add = function(opr1, opr2){
      var s1 = primitive.ctr(opr1),
          s2 = primitive.ctr(opr2)

      var s = math.add(s1, s2)
      return D(s)
    }
    D.minus = D.sub = function(opr1, opr2){
      var s1 = primitive.ctr(opr1),
          s2 = primitive.ctr(opr2)

      var s = math.sub(s1, s2)
      return D(s)
    }
    D.mul = function(opr1, opr2){
      var s1 = primitive.ctr(opr1),
          s2 = primitive.ctr(opr2)

      var s = math.mul(s1, s2)

      return D(s)
    }
    D.div = function(opr1, opr2){
      var s1 = primitive.ctr(opr1),
          s2 = primitive.ctr(opr2)

      var s = math.div(s1, s2)

      return D(s)
    }

    e.D = D
  },
  "primitive": function(r/*equire*/, e/*xport*/){
    var global = r("global"),
        util   = r("util")

    /* 构建内部表示数据结构体
     * @method1
     * @param {String|Number|POJO} [val=0] - 原始数值字面量
     * @returns {POJO}
     * @method2
     * @param {Number} [s=1] - 符号位. 1正,-1为负
     * @param {Number} [rs=0] - 小数点右移偏移量
     * @param {Number|Array.<Number>} [m=[]] - 有效数编码字节或字节序列
     * @param {POJO} [r=null] - 余数. null表示余数为0
     * @returns {POJO}
     */
    var ctr = e.ctr = function(){
      var doCtr = ctr[arguments.length <= 1 ? arguments.length : "o"]
      return doCtr.apply(null, arguments)
    }
    ctr["0"] = function(){
      return struct()
    }
    ctr["1"] = function(val){
      return ctr["1"][util.type(val)](val)
    }
    ctr["o"] = function(/*args...*/){
      return struct.apply(null, arguments)
    }
    ctr["1"]["number"] = function(val){
      return ctr["1"]["string"](val + '')
    }
    ctr["1"]["object"] = function(val){
      var s = val['s'], rs = val['rs'], m = val['m'], r = val['r']
      return struct(s, rs, m, r)
    }
    ctr["1"]["d"] = function(val){
      return val.struct()
    }
    ctr["1"]["string"] = function(val){
      // 将形如1.0123000e-2转换为0.010123000
      val = r("math").e2n(util.trim(val))

      var dpIdx = ~val.indexOf('.')
      if (dpIdx){
        val = val.replace(/0*$/g, '')
      }
      else{
        dpIdx = -val.length	
      }

      var s,rs,m = []
      s = '-' === val[0] ? -1 : 1
      rs = val.length + dpIdx
      val = val.replace(/^0*/g, '').replace(/[+-.]/g, '')

      m = str2m(val)
      
      return struct(s, rs, m)
    }
    var struct = function(s/*ign*/, rs/*right shift*/, m/*antissa*/, r/*eminder*/){
      return {s: s || 1,
	      rs: rs || 0,
	      m: util.isArray(m) ? m : (util.isNum(m) ? [m] : []),
	      r: r || null}
    }
    var str2m = function(val){
      var digits = global.config().digits
      var t = Math.floor(val.length/digits) + (val.length%digits === 0 ? 0 : 1)
      val = val.split('').reverse()
      var m = []
      for (var i = 0; i < t; ++i){
        var b = parseInt(val.splice(0, digits).reverse().join(''))
	m.push(b)
      }
      return m
    }
    var m2str = function(m){
      var digits = global.config().digits
      var b, str = []
      for (var i = 0, len = m.length; i < len; ++i){
	b = m[i] + ''
        if (i + 1 < len){
          b = util.paddingZero(digits - b.length) + b
	}
        str.push(b)
      }
      return str.reverse().join('')
    }
    
    var structure2str = e.structure2str = function(s, o){
      var doStructure2strs = ["fraction", "mixed-fraction", "decimal"]
      var idx = hasRem(s) ? 0 : 2
      if (util.isNum(o)){
        idx = 2
      }
      else if (/mixed/.test(o)){
        idx = 1
      }
      return structure2str[doStructure2strs[idx]](s, o)
    }
    // 真/假分数
    // 123/2 或 1/2
    structure2str["fraction"] = function(s){
      var tpl = "${sign}${numerator}/${denominator}"

      var math = r("math")
      var p = math.mul({s: 1, m: s.m, rs: 0}, {s: 1, m: s.r.d, rs:0})
      var numerator = m2str(math.add(p, {s: 1, m: s.r.n, rs:0}).m).replace(/^0*/g, '')
      var denominator = m2str(s.r.d).replace(/^0*/g, '')

      var vals = {sign: s.s === 1 ? '' : '-', numerator: numerator, denominator: denominator}
      return util.fmt(tpl, vals)
    }
    // 带分数
    // 2+1/5 或 -(2+1/5)
    structure2str["mixed-fraction"] = function(s){
      var tpl = ["${num}+${numerator}/${denominator}", "-(${num}+${numerator}/${denominator})"]

      var num = m2str(s.m)
      var numerator = m2str(s.r.n).replace(/^0*/g, '')
      var denominator = m2str(s.r.d).replace(/^0*/g, '')

      var vals = {num: num, numerator: numerator, denominator: denominator}
      return util.fmt(tpl[s.s>>>31], vals)
    }
    // 存在bug
    structure2str["decimal"] = function(s, f/*ractionDigits*/){
      var isUndefined = typeof f === 'undefined'
      f = f|0
      
      var tpl = ["${sign}${decimal}", "${sign}${decimal}.${fraction}"]
      var tplIdx = 0
      var decimal = '0',fraction,sign = s.s === 1 ? '' : '-'
      var dVal4F = s.rs - f
      if (dVal4F>>>31 && hasRem(s)){
        // 当要求的小数位数大于数值自带的小数位数才计算余数
	dVal4F *= -1
	var n = rs(s.r.n, dVal4F)
	var d = s.r.d
        var quotient = r("math").div({s: 1, m: n, rs: 0}, {s: 1, m: d, rs: 0}, false)
	var ret = r("math").round(quotient, dVal4F)
	var retM = ls(ret.m, ret.rs)
        var f = m2str(retM)
        var strM = m2str(s.m)

        if (s.rs){
          strM = (strM.slice(0, -s.rs) || '0') + '.' + util.paddingZero(s.rs - strM.length) + strM
          strM = strM.split('')
          decimal = strM.splice(0, strM.indexOf('.')).join('')
	  fraction = strM.splice(1, isUndefined ? strM.length : f).join('') + f.replace(/^0*/g, '')
        }
        else{
  	  decimal = strM.replace(/^0*/g, '') || '0'
          fraction = f
        }
	tplIdx = fraction ? 1 : 0
      }
      else{
	var s = r("math").round(s, f)
        var strM = m2str(s.m)
        if (s.rs){
          strM = (strM.slice(0, -s.rs) || '0') + '.' + util.paddingZero(s.rs - strM.length) + strM
          strM = strM.split('')
          decimal = strM.splice(0, strM.indexOf('.')).join('')
	  fraction = strM.splice(1, isUndefined ? strM.length : f).join('')
	  tplIdx = fraction ? 1 : 0
        }
        else{
  	  decimal = strM.replace(/^0*/g, '') || '0'
        }
      }
      
      return util.fmt(tpl[tplIdx], {sign: sign, decimal: decimal, fraction: fraction})
    }

    // 小数点右移
    var rs = e.rs = function(m/*antissa*/, c/*ount*/){
      var digits = global.config().digits
      var bCount = Math.floor(c/digits), 
	  rem = c%digits
      var ret = null
      if (rem){
        ret = str2m(m2str(m) + util.paddingZero(rem))
      }
      else{
	ret = [].concat(m)
      }
      for (var i = 0; i < bCount; ++i){
        ret.unshift(0)
      }
      return ret
    }
    // 小数点左移
    var ls = e.ls = function(m/*antissa*/, c/*ount*/){
      var digits = global.config().digits
      var bCount = c/digits|0, 
	  rem = c%digits
      var ret = null
      if (rem){
        ret = m2str(m).split('')
        ret.splice(ret.length - rem, rem)
        ret = str2m(ret.join(''))
      }
      else{
	ret = [].concat(m)
      }
      ret.splice(0, bCount)
      return ret.length && ret || [0]
    }

    var structureRem = e.structureRem = function(n/*umerator*/, d/*enominator*/, g/*cd*/){
      var rem = {
	      n: n || [0],
	      d: d || [1]
      }
      if (g){
        var math = r("math")
        var numerator = {s: 1, m: rem.n, rs:0}
        var denominator = {s: 1, m: rem.d, rs:0}
        var gcd = math.gcd(numerator, denominator)
        numerator = math.div(numerator, gcd, false)
        denominator = math.div(denominator, gcd, false)
        rem = {
	      n: numerator.m,
	      d: denominator.m
        }
      }
      return rem
    }
    var hasRem = e.hasRem = function(s){
      return !(!s || !s.r || !s.r.n || /^[\s\u3000]*0?[\s\u3000]*$/.test(s.r.n + ''))
    }
    var isZero = e.isZero = function(s){
      return !hasRem(s) && /^[\s\u3000]*0[\s\u3000]*$/.test(s.m)
    }
  },
  "math": function(r/*equire*/, e/*xport*/){
    var global = r("global"),
        util   = r("util"),
	primitive = r("primitive")

    e.e2n = function(val){
      val = '' + val

      var mE = val.split(/e/i)
      if (mE.length > 1){
	val = mE[0]
	var dpIdx = val.indexOf('.')
        if (dpIdx === -1){
	  dpIdx = val.length
	}
	val = val.replace('.', '')

        var e = parseInt(mE[1])
	dpIdx += e
        val += util.paddingZero(dpIdx - val.length)
        
        if (dpIdx <= 0){
          val = '0.' + util.paddingZero(-1*dpIdx) + val
	}
	else if (dpIdx !== val.length){
	  val = val.slice(0, dpIdx) + '.' + val.slice(dpIdx)
	}
      }
      return val
    }

    var matchRs = e.matchRs = function(s1/*tructure*/,s2/*tructure*/){
      var digits = global.config().digits
      var dVal = 0, maxRs = Math.max(s1.rs, s2.rs)
      if (dVal = maxRs - s1.rs){
        s1.m = primitive.rs(s1.m, dVal)
      }
      if (dVal = maxRs - s2.rs){
        s2.m = primitive.rs(s2.m, dVal)
      }
      s1.rs = s2.rs = maxRs
    }

    var add = e.add = function(s1, s2){
      matchRs(s1, s2)
      return _add(s1, s2)
    }
    var sub = e.sub = function(s1, s2){
      s2.s *= -1
      return add(s1, s2)
    }
    var _add = function(s1/*tructure*/,s2/*tructure*/){
      if (primitive.hasRem(s1) || primitive.hasRem(s2)){
        return _add[s1.s*s2.s]["hasRem"](s1, s2)
      }
      else{
        return _add[s1.s*s2.s](s1, s2)
      }
    }
    /*同号-有效数域相加*/
    _add["1"] = function(opr1, opr2){
      var digits = global.config().digits
      var cf = 0, sum = [], ceil = parseInt('1' + util.paddingZero(digits)), floor = 0
      var s1 = opr1.s,
  	  s2 = opr2.s,
          m1 = opr1.m,
          m2 = opr2.m
      var l = Math.max(m1.length, m2.length)
      var m = null, absM = null, s = s1
      for (var i = 0; i < l; ++i){
        m = s1*(m1[i]||0) + s2*(m2[i]||0) + s2*cf
        absM = Math.abs(m)
        if (absM >= ceil){
      	  cf = 1
        }
        else if (s1*m < floor){
          cf = s1 === s2 ? 1 : -1
        }
        s = absM === m ? 1 : -1
        sum.push(absM)
      }
  
      return {
  	    s: s,
  	    rs: opr1.rs,
  	    m: sum
      }
    }
    /*异号-有效数域相加*/
    _add["-1"] = function(opr1, opr2){
      var digits = global.config().digits
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
  	  m = Math.pow(10, digits) + m1[i] - (m2[i]||0) + cf
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
    _add["1"]["hasRem"] = function(opr1, opr2){
      // 整数部分计算
      var integer = add({s: opr1.s, rs: opr1.rs, m: opr1.m}, 
		      {s: opr2.s, rs: opr2.rs, m: opr2.m})
      // 分数部分计算
      var f1n, f2n, fn, fd
      f1n = mul({s: 1, rs: 0, m: opr1.r && opr1.r.n || [0]}, {s: 1, rs: 0, m: opr2.r && opr2.r.d || [1]})
      f2n = mul({s: 1, rs: 0, m: opr2.r && opr2.r.n || [0]}, {s: 1, rs: 0, m: opr1.r && opr1.r.d || [1]})
      fn = add(f1n, f2n)
      fd = mul({s: 1, rs: 0, m: opr1.r && opr1.r.d || [1]}, {s: 1, rs: 0, m: opr2.r && opr2.r.d || [1]})
      var q = div(fn, fd)
      var tmpInt = add({s: 1, rs: 0, m: integer.m}, {s: 1, rs: 0, m: q.m})
      return {
	      s: opr1.s,
	      rs: integer.rs,
	      m: tmpInt.m,
	      r: q.r
      }
    }
    _add["-1"]["hasRem"] = function(opr1, opr2){
      var s1,s2,m1,m2
      var dVal = opr1.m.length - opr2.m.length
      if (!dVal){
        dVal = opr1.m[opr1.m.length - 1] - opr2.m[opr2.m.length - 1]
      }
      s1 = arguments[dVal >= 0 ? 0 : 1].s
      m1 = arguments[dVal >= 0 ? 0 : 1].m
      m2 = arguments[dVal >= 0 ? 1 : 0].m
      r1 = arguments[dVal >= 0 ? 0 : 1].r
      r2 = arguments[dVal >= 0 ? 1 : 0].r
      // 整数部分计算
      var cf = 0, m = 0, sum = []
      for (var i = 0, len = m1.length; i < len; ++i){
        m = m1[i] - (m2[i]||0) + cf
        if (m < 0){
  	m = Math.pow(10, digits) + m1[i] - (m2[i]||0) + cf
          cf = -1
        }
        sum.push(m)
      }
      // 分数部分计算
      var f1n, f2n, fn, fd
      f1n = mul({s: 1, rs: 0, m: r1 && r1.n || [0]}, {s: 1, rs: 0, m: r2 && r2.d || [1]})
      f2n = mul({s: 1, rs: 0, m: r2 && r2.n || [0]}, {s: 1, rs: 0, m: r1 && r1.d || [1]})
      fd = mul({s: 1, rs: 0, m: r1 && r1.d || [1]}, {s: 1, rs: 0, m: r2 && r2.d || [1]})
      var fn = sub(f1n, f2n)
      if (fn.s === -1){
        f1n = add(f1n, fd)
        fn = sub(f1n, {s: 1, m: f2n.m, rs: f2n.rs})
	sum = sub({s:1, m: sum, rs: 0}, {s:1, m: [1], rs: 0}).m
      }

      return {
  	    s: s1,
  	    rs: opr1.rs,
  	    m: sum,
	    r: {n: fn.m, d: fd.m}
      }
    }

    var mul = e.mul = function(s1, s2){
      var rs = s1.rs + s2.rs
      var sign = s1.s * s2.s
      var s = _mul(s1, s2)
      return {
	      s: sign,
	      rs: s.rs + rs,
	      m: s.m && s.m.length && s.m || [0],
	      r: s.r
      }
    }
    var _mul = function(s1, s2){
      var digits = global.config().digits
      var factors = [], m1 = s1.m, m2 = s2.m
      for (var i = 0, l = m1.length; i < l; ++i){
        for (var j = 0, jl = m2.length; j < jl; ++j){
  	  var strProduct = (m1[i] * m2[j]) + '' + util.paddingZero(digits*(i + j))
   	  factors.push(primitive.ctr(strProduct))
        }
      }
  
      var sum = factors[0] || primitive.ctr(0)
      for (var i = 1, l = factors.length; i < l; ++i){
        sum = add(sum, factors[i])
      }
      return sum
    }

    var div = e.div = function(s1, s2, gcd){
      matchRs(s1, s2)
      var sign = s1.s * s2.s
      var s = _div(s1, s2, gcd)
      return {
	      s: sign,
	      rs: 0,
	      m: s.m && s.m.length && s.m || [0],
	      r: s.r
      }
    }
    var _div = function(s1, s2, gcd){
      gcd = typeof gcd === "undefined" ? true : gcd
      var bias = 0, // bias为正数表示m2向m1最高位对齐，为负数表示m1向m2最高位对齐
  	dVal = {s: 1, m: util.cp(s1.m), rs: 0},
  	rem = dVal,
  	origDivisor = {s: 1, m: util.cp(s2.m), rs: 0},
  	divisor = null,
  	over = false,
  	factors = []
      while (!over){
     	divisor = util.cp(origDivisor)
        // 高位字节对齐
        bias = dVal.m.length - origDivisor.m.length
        if (bias > 0 && dVal.s !== -1){
  	  divisor.m.unshift(0)
        }
        else if ((bias === 0 && dVal.s !== -1) || (bias > 0 && dVal.s === -1)){
  	  bias = 0
        }
        else if (dVal.s === -1){
          break
        }
        // 减法
        dVal = sub(rem, divisor)
        if (dVal.s !== -1){
          rem = dVal
  	  var factor = []
          for (var i = 0; i < bias; ++i){
  	    factor.push(0) 
  	  }
  	  factor.push(1)
  	  factors.push(primitive.ctr({s:1,rs:0,m:factor}))
        }
      }
      var sum = primitive.ctr()
      for (var i = 0, len = factors.length; i < len; ++i){
        sum = add(sum, factors[i])
      }
  
      return {
  	    s: 1,
  	    rs: 0,
  	    m: sum.m,
  	    r: primitive.structureRem(rem.m, origDivisor.m, gcd)
      }
    }

    // 求最大公约数
    // http://www.cnblogs.com/visayafan/archive/2011/08/11/2135345.html
    e.gcd = function(s1, s2){
      return _gcd(true, {m: s1.m}, {r:{n:s2.m}})
    }
    var _gcd = function(isFirst, s1, s2){
      return !primitive.hasRem(s2) && !isFirst 
	      ? s1 
	      : _gcd(false, {m: s2.r.n}, div({s:1, rs: 0, m: s1.m},{s:1, rs: 0, m: s2.r.n}, false))
    }

    // 四舍五入
    e.round = function(s1, f/*ractionDigits*/){
      f = ((f>>31)+1)*f|0 
      f = (f ? f : s1.rs) + 1
      var s2 = {s: s1.s, m: [5], rs: f}
      var s = add(s1, s2)
      var dVal = s.rs - f + 1
      dVal = ((dVal>>31)+1)*dVal
      var m = primitive.ls(s.m, dVal)
      return {s: s.s, m: m, rs: s.rs - dVal}
    }
  },
  "util": function(r/*equire*/, e/*xport*/){
    var type = e.type = function(obj){
      var t = typeof obj
      if ("object" === t){
        t = Object.prototype.toString.call(obj).replace(/\s*\[\s*object\s*/,'').replace(/\s*\]\s*$/,'')
	if (obj === null){
	    t = "null"
	}
	else if ("function" === typeof obj.constructor){
          var ctorName = obj.constructor.toString()
		  .replace(/\s*function\s*/, '')
		  .replace(/\s*/g,'')
		  .replace(/\s*\(.*/,'')
	  if (ctorName){
            t = ctorName
          }
	}
      }
      return t.toLowerCase()
    }
    var isArray = e.isArray = function(obj){
      return "array" === type(obj)
    }
    var isNum = e.isNum = function(obj){
      return "number" === type(obj)
    }

    e.trim = function(obj, reg){
      return ('' + obj).replace(reg && RegExp("^" + reg + "|" + reg + "$") || /^[\s\u3000]*|[\s\u3000]*$/g, '')
    }
    e.paddingZero = function(count){
      if (1 > count) return ''
      return (0).toPrecision(count).replace('.', '')
    }
    e.fmt = function(tpl, vals){
      for (var k in vals){
        tpl = tpl.replace(RegExp("\\$\\{" + k + "\\}", 'g'), vals[k])
      }
      return tpl
    }

    var cp = e.cp = function(orig){
      var ret = isArray(orig) ? [] : {} 
      for (var k in orig){
	if ("object" === typeof orig[k]){
	  ret[k] = cp(orig[k])
	}
	else{
          ret[k] = orig[k]
	}
      }

      return ret
    }
  }
}
, ["global", "util", "primitive", "math", "D"], window))
