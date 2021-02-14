const fs = require('fs');
process.env.NODE_ENV = 'test';
var assert = require("assert");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
chai.use(chaiHttp);


function redToCSV(red) {
    let [method, url, input, ...ostatak] = red.split(',');
    let ost = ostatak.join(',');
    if (input === 'null') {
        return {method: method, url: url, input: null, output: ost.replace(/\\"/g, '"')}
    }
    ost = [input, ost].join(',');
    ost = ost.replace(/\\"/g, '"');
    [input, output] = ost.split('},');
    return {method: method, url: url, input: input + '}', output: output};
}

describe('Main', function () {

    var redovi = [];
    describe('test.js', function () {
        let file = fs.readFileSync('testniPodaci.csv').toString();
        redovi = file.split(/\r{0,1}\n/);
        redovi.forEach(function (red) {
            red = redToCSV(red);
            if (red.method === 'GET') {
                it(`GET ${red.url}`, function (done) {
                    chai.request(server)
                        .get(red.url)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            (JSON.stringify(res.body)).should.be.eql(red.output);
                        });
                    done();
                })
            } else if (red.method === 'POST') {
                it(`POST ${red.url}`, function (done) {
                    chai.request(server)
                        .post(red.url)
                        .send(JSON.parse(red.input))
                        .end(function (err, res) {
                            res.should.have.status(200);
                            (JSON.stringify(res.body)).should.be.eql(red.output);
                        });
                    done();
                })
            } else if (red.method === 'DELETE') {
                it(`DELETE ${red.url}`, function (done) {
                    chai.request(server)
                        .delete(red.url)
                        .end(function (err, res) {
                            res.should.have.status(200);
                            (JSON.stringify(res.body)).should.be.eql(red.output);
                        });
                    done();
                })
            }
        });
    })
});
before(function () {
    fs.writeFileSync('predmeti.txt', '');
    fs.writeFileSync('aktivnosti.txt', '');
})