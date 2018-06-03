var add = require('../src/index.js').add;
var expect = require('chai').expect;

var dummy = {
    aboveFive: function(n) {
        return n > 5;
    },

    setClass: function(el, classname) {
        el.className = classname;
    }
};
describe('Checking that everything is hooked up nicely', function() {
    it('Simple function', function() {
        expect(dummy.aboveFive(2)).to.equal(true);
    });

    it('involving the dom', function() {
        var el = document.createElement('span');

        dummy.setClass(el, 'foo');

        expect(el.className).to.equal('foo');
    });
});


//var expect = require('chai').expect;

/*import {expect} from 'chai'

describe('Test', function() {
    it('It should be false', function() { expect(false).to.equal(false); });
});*/