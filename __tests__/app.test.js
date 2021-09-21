const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("test connection to api router", () => {
  test("200: should respond with ok message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("All OK from API Router");
      });
  });
});

describe("test invalid URL response", () => {
  test("404: should inform user that URL is invalid", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: should respond with a list of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with correctly formatted article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
        expect(res.body.article.comment_count).toBe(13);
      });
  });
  test("200: should work for article with zero comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
        expect(res.body.article.comment_count).toBe(0);
      });
  });
  test("400: should return error if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - article_id must be a number");
      });
  });
  test("404: should return error if path and request are valid but there is no article with that id", () => {
    return request(app)
      .get("/api/articles/440")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Not found - there is not an article with selected article_id"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should return an updated object", () => {
    return request(app)
      .patch("/api/articles/10")
      .send({ inc_votes: 100 })
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle.votes).toBe(100);
      });
  });
  test("400: should return error if article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/ten")
      .send({ inc_votes: 100 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - article_id must be a number");
      });
  });
  test("404: should return error if path and request are valid but there is no article with that id", () => {
    return request(app)
      .patch("/api/articles/440")
      .send({ inc_votes: 100 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Not found - there is not an article with selected article_id"
        );
      });
  });
  test("422: should return an error if request body does not contain inc_votes", () => {
    return request(app)
      .patch("/api/articles/440")
      .send({ drop_votes: 100 })
      .expect(422)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Unprocessable Entity, error in request body"
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        res.body.articles.forEach((element) => {
          expect(element).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
        expect(res.body.articles).toHaveLength(12);
      });
  });
  test.only('200: should be sortable by column', () => {
      return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((res)=> {
          expect(res.body.articles).toBeSortedBy('title', {descending : true})
      })
  });
});
