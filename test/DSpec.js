describe("D", function(){
  var expect = chai.expect
  
  describe("Internal modules", function(){
    describe("Math module", function(){
      describe("e2n", function(){
	var e2n = D["[[require]]"]("math").e2n
        it("1", function(){
	  var v1 = "10e2", e1 = "1000"
          expect(e2n(v1)).to.be.equal(e1)
        })
        it("2", function(){
	  var v2 = "1.10e2", e2 = "110"
	  expect(e2n(v2)).to.be.equal(e2)
        })
        it("3", function(){
	  var v3 = "10e-3", e3 = "0.010"
	  expect(e2n(v3)).to.be.equal(e3)
        })
      })
    })

    describe("Primitive module", function(){
      describe("ctr['1']['string']", function(){
	var ctr = D["[[require]]"]("primitive").ctr["1"]["string"]
        it("1", function(){
	  var v = "10e2"
	  var expS = 1, expRs = 0, expM = [1000], expR = null
	  var ret = ctr(v)
          expect(ret.s).to.be.equal(expS)
          expect(ret.rs).to.be.equal(expRs)
          expect(ret.m).to.deep.equal(expM)
          expect(ret.r).to.be.equal(expR)
        })
        it("2", function(){
	  var v = "0.1010e+2"
	  var expS = 1, expRs = 1, expM = [101], expR = null
	  var ret = ctr(v)
          expect(ret.s).to.be.equal(expS)
          expect(ret.rs).to.be.equal(expRs)
          expect(ret.m).to.deep.equal(expM)
          expect(ret.r).to.be.equal(expR)
        })
        it("3", function(){
	  var v = "-11111111000.101000000e-10"
	  var expS = -1, expRs = 13, expM = [11000101, 111111], expR = null
	  var ret = ctr(v)
          expect(ret.s).to.be.equal(expS)
          expect(ret.rs).to.be.equal(expRs)
          expect(ret.m).to.deep.equal(expM)
          expect(ret.r).to.be.equal(expR)
        })
      })
      describe("rs", function(){
	var rs = D["[[require]]"]("primitive").rs
        it("1", function(){
	  var v = [1101], c = 10,
	      expM = [0,110100]
	  var m = rs(v, c)
          expect(m).to.deep.equal(expM)
          expect(v).to.deep.equal([1101])
        })
        it("2", function(){
	  var v = [1101], c = 1,
	      expM = [11010]
	  var m = rs(v, c)
          expect(m).to.deep.equal(expM)
          expect(v).to.deep.equal([1101])
        })
      })
    })
  })
  describe("Public module", function(){
    describe("D module", function(){
      describe("D.add", function(){
        describe("args is Number type", function(){
          it("D.add(0.1, 0.2)", function(){
            var expM = [3], expRs = 1, expS = 1
            var d = D.add(0.1, 0.2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
          it("D.add(0.1, -0.2)", function(){
            var expM = [1], expRs = 1, expS = -1
            var d = D.add(0.1, -0.2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
        })
        describe("args contain String type", function(){
          it("D.add('0.1000000000001', 2)", function(){
            var expM = [1, 210000], expRs = 13, expS = 1
            var d = D.add("0.1000000000001", 2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
          it("D.add('-0.1000000000001', -2)", function(){
            var expM = [1, 210000], expRs = 13, expS = -1
            var d = D.add("-0.1000000000001", -2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
          it("D.add('0.1000000000001', -2)", function(){
            var expM = [99999999, 189999], expRs = 13, expS = -1
            var d = D.add("0.1000000000001", -2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
          it("D.add('-0.1000000000001', 2)", function(){
            var expM = [99999999, 189999], expRs = 13, expS = 1
            var d = D.add("-0.1000000000001", 2).struct()
            var m = d.m, rs = d.rs, s = d.s
            expect(m).to.deep.equal(expM)
            expect(rs).to.be.equal(expRs)
            expect(s).to.be.equal(s)
          })
        })
      })
    })
    describe("D.mul(opr1, opr2)", function(){
      describe("args is Number type", function(){
        it("D.mul(0.1, -0.2)", function(){
          var expM = [2], expRs = 2, expS = -1
          var d = D.mul(0.1, -0.2).struct()
          var m = d.m, rs = d.rs, s = d.s
          expect(m).to.deep.equal(expM)
          expect(rs).to.be.equal(expRs)
          expect(s).to.be.equal(s)
        })
        it("D.mul(0.7, 180)", function(){
          var expM = [1260], expRs = 1, expS = 1
          var d = D.mul(0.7, 180).struct()
          var m = d.m, rs = d.rs, s = d.s
          expect(m).to.deep.equal(expM)
          expect(rs).to.be.equal(expRs)
          expect(s).to.be.equal(s)
        })
      })
    })
	describe("D.div(dividend, divisor)", function(){
		describe("args is Number type", function(){
		  it("D.div(10, 2)", function(){
			var expM = [5], expRs = 0, expS = 1
			var d = D.div(10, 2).struct()
			var m = d.m, rs = d.rs, s = d.s
			expect(m).to.deep.equal(expM)
			expect(rs).to.be.equal(expRs)
			expect(s).to.be.equal(s)
		  })
		  it("D.div(0.02, 0.01)", function(){
			var expM = [2], expRs = 0, expS = 1
			var d = D.div(0.02, 0.01).struct()
			var m = d.m, rs = d.rs, s = d.s
			expect(m).to.deep.equal(expM)
			expect(rs).to.be.equal(expRs)
			expect(s).to.be.equal(s)
		  })
		  it("D.div(3, 0.2)", function(){
			var expM = [15], expRs = 0, expS = 1
			var d = D.div(3, 0.2).struct()
			var m = d.m, rs = d.rs, s = d.s
			expect(m).to.deep.equal(expM)
			expect(rs).to.be.equal(expRs)
			expect(s).to.be.equal(s)
		  })
		  it("D.div(-3, 2)", function(){
			var expM = [1], expRs = 0, expS = -1
			var d = D.div(-3, 2).struct()
			var m = d.m, rs = d.rs, s = d.s
			expect(m).to.deep.equal(expM)
			expect(rs).to.be.equal(expRs)
			expect(s).to.be.equal(s)
		  })
		})
	})
  })
}) 
