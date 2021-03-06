'use strict';

const Logger = require('../lib/logger');
const expect = require('chai').expect;

function TestRawStream() {}
TestRawStream.prototype.write = function (data) {
	if (typeof data.afterLog === 'function') {
		data.afterLog.call(null, data);
	}
};

describe('Initial test',function(){
	before(function() {
		this.logger = Logger({
			name: 'TestLogger',
			streams: [
				{
					stream: new TestRawStream(),
					type: 'raw'
				}
			],
			level: Logger.TRACE,
			deepLevel: 2
		});
	});

	it('should output valid success params',function(){
		this.logger.info({
			opType: Logger.OP_TYPE.SUCCESS,
			afterLog: function(data) {
				expect(data.name).equal('TestLogger');
				expect(data.opType).equal(Logger.OP_TYPE.SUCCESS);
				expect(data.msg).equal('all done');
			},
			size: {before: 10234230, after: 324234},
			duration: 100
		}, 'all done');
	});

	it('should output valid fail params',function(){
		this.logger.info({
			opType: Logger.OP_TYPE.FINISHED_ERROR,
			afterLog: function(data) {
				expect(data.name).equal('TestLogger');
				expect(data.opType).equal(Logger.OP_TYPE.FINISHED_ERROR);
				expect(data.msg).equal('error');
			},
			size: {before: 10234230, after: 324234},
			duration: 100
		}, 'error');
	});

	it('should output logger time delta as number', function() {
		var time = this.logger.time().start();

		expect(time.delta()).to.be.a('number');
	});

	if (process.platform !== 'win32') {
		it('should output tick symbol', function() {
			expect(this.logger.SYMBOLS.tick).equal('✔');
		});
	}

	it('should output valid deepLevel', function() {
		expect(this.logger.getDeepLevel()).equal(2);
	});


});
