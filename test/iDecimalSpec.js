describe("iDecimal", function(){
  var expect = chai.expect

  describe("iDecimal(num)", function(){
    describe("num is Number type", function(){
      it("iDecimal(12345678).struct()", function(){
        var expM = [45678, 123], expRs = 0, expS = 1
        var d = iDecimal(12345678).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal(1234.5678000).struct()", function(){
        var expM = [56780, 1234], expRs = 5, expS = 1
        var d = iDecimal(1234.5678000).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal(-1234.0005678).struct()", function(){
        var expM = [78000, 56, 1234], expRs = 10, expS = -1
        var d = iDecimal(-1234.0005678).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal(0.001).struct()", function(){
        var expM = [100], expRs = 5, expS = 1
        var d = iDecimal(0.001).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
  })


  describe("iDecimal.add(opr1, opr2)", function(){
    describe("args is Number type", function(){
      it("iDecimal.add(0.1, 0.2)", function(){
        var expM = [30000], expRs = 5, expS = 1
        var d = iDecimal.add(0.1, 0.2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.add(0.1, -0.2)", function(){
        var expM = [10000], expRs = 5, expS = -1
        var d = iDecimal.add(0.1, -0.2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
    describe("args contain String type", function(){
      it("iDecimal.add('0.1000000000001', 2)", function(){
        var expM = [100, 0, 10000, 2], expRs = 15, expS = 1
        var d = iDecimal.add("0.1000000000001", 2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.add('-0.1000000000001', -2)", function(){
        var expM = [100, 0, 10000, 2], expRs = 15, expS = -1
        var d = iDecimal.add("-0.1000000000001", -2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.add('0.1000000000001', -2)", function(){
        var expM = [99900, 99999, 89999, 1], expRs = 15, expS = -1
        var d = iDecimal.add("0.1000000000001", -2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.add('-0.1000000000001', 2)", function(){
        var expM = [99900, 99999, 89999, 1], expRs = 15, expS = 1
        var d = iDecimal.add("-0.1000000000001", 2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
  })

  describe("iDecimal.sub(minuend, substractor)", function(){
    describe("args is Number type", function(){
      it("iDecimal.sub(0.1, -0.2)", function(){
        var expM = [30000], expRs = 5, expS = 1
        var d = iDecimal.sub(0.1, -0.2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.sub(0.1, 0.2)", function(){
        var expM = [10000], expRs = 5, expS = -1
        var d = iDecimal.sub(0.1, 0.2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
    describe("args contain String type", function(){
      it("iDecimal.sub('0.1000000000001', -2)", function(){
        var expM = [100, 0, 10000, 2], expRs = 15, expS = 1
        var d = iDecimal.sub("0.1000000000001", -2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.sub('-0.1000000000001', 2)", function(){
        var expM = [100, 0, 10000, 2], expRs = 15, expS = -1
        var d = iDecimal.sub("-0.1000000000001", 2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.sub('0.1000000000001', 2)", function(){
        var expM = [99900, 99999, 89999, 1], expRs = 15, expS = -1
        var d = iDecimal.sub("0.1000000000001", 2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.sub('-0.1000000000001', -2)", function(){
        var expM = [99900, 99999, 89999, 1], expRs = 15, expS = 1
        var d = iDecimal.sub("-0.1000000000001", -2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
  })
  describe("iDecimal.mul(minuend, substractor)", function(){
    describe("args is Number type", function(){
      it("iDecimal.mul(0.1, -0.2)", function(){
        var expM = [20000], expRs = 5, expS = -1
        var d = iDecimal.mul(0.1, -0.2).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
      it("iDecimal.mul(0.7, 180)", function(){
        var expM = [126], expRs = 0, expS = 1
        var d = iDecimal.mul(0.7, 180).struct()
        var m = d.m, rs = d.rs, s = d.s
        expect(m).to.deep.equal(expM)
        expect(rs).to.be.equal(expRs)
        expect(s).to.be.equal(s)
      })
    })
  })
}) 
