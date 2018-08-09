const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server.js");

const expect = chai.expect;

chai.use(chaiHttp);


describe("Blog Post", function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it("should list items on GET", function () {

        return chai
            .request(app)
            .get("/blog-posts")
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ["id", "title", "content", "author", "publishDate"];
                res.body.forEach(function (item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });
    it("should add item on POST", function () {
        const newItem = { title: "Speed Reading", content: "I read faster now", author: "Mike Ethan", publishDate: "Mar 05, 2018" }
        return chai
            .request(app)
            .post("/blog-posts")
            .send(newItem)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.be.a("object");
                expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newItem, { id: res.body.id })
                );
            });
    });
    it("shold update items in PUT", function () {
        const updateData = {
            title: "News Update",
            content: "You can now read 10x faster",
            author: "Scott Newport",
            publishDate: "July 20, 2018"
        };

        return chai
            .request(app)
            .get("/blog-posts")
            .then(function (res) {
                updateData.id = res.body[0].id;

                return chai
                    .request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                // console.log(res);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.deep.equal(updateData);
            });
    });

    it("should delete items on DELETE", function() {
        return (
            chai
                .request(app)
                .get("/blog-posts")
                .then(function(res){
                    return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                })
        )
    });
})