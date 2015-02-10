var test = require('gap');

var queue = require('../')('localhost/test').trys(1);

var monk = require('monk');
var db = monk('localhost/test');
var jobs = db.get('default');

test('setup', function * () {
    try {
        yield jobs.drop();
    } catch (e) { }
});

test('skip', function * (t) {
    yield queue.put({test: 'wow'});

    var it = yield queue.take();
    var step = it();
    t.deepEqual(step.next().value, {test: 'wow'}, 'should return right job');
    t.ok(step.next(false).done, 'should return one jobs');

    var job = yield jobs.find({status: 'failed'});
    t.equal(job.length, 1, 'should return failed job in queue');
});


test('teardown', function * () {
    queue.close();
    db.close();
});