'use strict';
const Lab = require('lab');
const Code = require('code');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const expect = Code.expect;

describe('Dummy Test', (done) => {

    expect('this').to.only.include(['this']);
    return done;
});
