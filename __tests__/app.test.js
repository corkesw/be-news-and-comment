const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
        expect(res.body.topics).not.toHaveLength(0);
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
        expect(res.body.msg).toBe("Invalid input");
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
  test("200: should return first ten articles", () => {
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
        expect(res.body.articles).toHaveLength(10);
      });
  });
  test("200: should be sortable by column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: should default to being sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: should be sortable asc or desc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200: should be able to be filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(1);
      });
  });
  test("200: should work with multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(10);
        expect(res.body.articles[0].title).toBe("A");
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: should be return correct number of queries when limit query is provided", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(5);
      });
  });
  test("200: should return the correct page when passed a p query", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0]).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          })
        );
      });
  });
  test("200: should return total number of articles for any given query", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
      });
  });
  test("200: should respond with empty array if topic has no related articles ", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then((res) => {
      expect(res.body.articles).toHaveLength(0);
    });
  });
  test("400: should respond with an error if sort_by is not a valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Bad request - cannot sort by unknown column"
        );
      });
  });
  test("400: should respond with error if order is not asc or desc", () => {
    return request(app)
      .get("/api/articles?order=any")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - order should be asc or desc");
      });
  });
  test("400: should reject any non-number inputs for p", () => {
    return request(app)
      .get("/api/articles?p=SQLINJECT")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid query");
      });
  });
  test("400: should reject any non-number inputs for limit", () => {
    return request(app)
      .get("/api/articles?limit=SQLINJECT")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid query");
      });
  });
  test("404: should respond with error if topic is not in the database", () => {
    return request(app)
      .get("/api/articles?topic=fish")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comments for the given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(13);
        res.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: should respond with empty array if article_id is valid but article has no comments ", () => {
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then((res) => {
      expect(res.body.comments).toHaveLength(0)
    });
  });
  test("400: should return error if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - article_id must be a number");
      });
  });
  test("404: should return error if path and request are valid but there is no article with that id", () => {
    return request(app)
      .get("/api/articles/440/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Not found - there is not an article with selected article_id"
        );
      });
  });
});

describe.only("POST /api/articles/:article_id/comments", () => {
  test("201: should respond with posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "Here is my comment" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual({
          comment_id: expect.any(Number),
          body: "Here is my comment",
          votes: 0,
          author: "lurker",
          article_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test('201: should ignore additional fields in request', () => {
    return request(app)
    .post("/api/articles/2/comments")
    .send({ username: "lurker", body: "Here is my comment", votes: 21})
    .expect(201)
    .then((res) => {
      expect(res.body.comment).toEqual({
        comment_id: expect.any(Number),
        body: "Here is my comment",
        votes: 0,
        author: "lurker",
        article_id: 2,
        created_at: expect.any(String),
      });
    });
  });
  test("400: should reject if article_id is not a number", () => {
    return request(app)
      .post("/api/articles/ten/comments")
      .send({ username: "lurker", body: "Here is my comment" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - article_id must be a number");
      });
  });
  test("400: should reject if request does not contain both username and body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker", comment: "Here is my comment" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
  test("404: should reject if user does not exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "moonfish", body: "Here is my comment" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "User not found"
        );
      });
  });
  test("404: should reject if article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "lurker", body: "Here is my comment" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Not found - there is not an article with selected article_id"
        );
      });
  });
});

describe("/api", () => {
  test("200: should respond with JSON describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(typeof res.body.endpoints).toBe("object");
        expect(res.body.endpoints["GET /api"].description).toBe(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("200: should delete the given comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(async () => {
        const checkComment = await db.query(
          `SELECT * FROM comments WHERE comment_id = 1`
        );
        expect(checkComment.rows.length).toBe(0);
      });
  });
  test("400: should return error if comment_id is not a number", () => {
    return request(app)
      .delete("/api/comments/notanumber")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - comment_id must be a number");
      });
  });
  test("404: should return error if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Comment does not exist");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: should respond with users details", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toEqual({
          username: "lurker",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          name: "do_nothing",
        });
      });
  });
  test("404 should return error if user does not exist", () => {
    return request(app)
      .get("/api/users/bananman")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: should return an updated object", () => {
    return request(app)
      .patch("/api/comments/10")
      .send({ inc_votes: 100 })
      .expect(200)
      .then((res) => {
        expect(res.body.updatedComment.votes).toBe(100);
      });
  });
  test("400: should return error if comment_id is not a number", () => {
    return request(app)
      .patch("/api/comments/ten")
      .send({ inc_votes: 100 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
  test("400: should return an error if request body does not contain inc_votes", () => {
    return request(app)
      .patch("/api/comments/440")
      .send({ drop_votes: 100 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Invalid input"
        );
      });
  });
  test("404: should return error if path and request are valid but there is no comment with that id", () => {
    return request(app)
      .patch("/api/comments/440")
      .send({ inc_votes: 100 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Not found - there is not a comment with selected comment_id"
        );
      });
  });
});

describe("POST /api/articles", () => {
  test("201: should return a newly added article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "fur balls",
        body: "Cats make fur balls which is why dogs are better",
        topic: "cats",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "fur balls",
            body: expect.any(String),
            topic: "cats",
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          })
        );
      });
  });
  test("201: should return a newly added article ignoring extra properties in request", () => {
    return request(app)
      .post("/api/articles")
      .send({
        votes: 27,
        author: "butter_bridge",
        title: "fur balls",
        body: "Cats make fur balls which is why dogs are better",
        topic: "cats",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "fur balls",
            body: expect.any(String),
            topic: "cats",
            article_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          })
        );
      });
  });
  test("400: returns bad request if request body does not contain the required fields", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "fur balls",
        body: "Cats make fur balls which is why dogs are better",
        topic: "cats",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
  test("404: returns 404 if user does not exist ", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "bilbo",
        title: "fur balls",
        body: "Cats make fur balls which is why dogs are better",
        topic: "cats",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("404: returns 404 if topic does not exist ", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "fur balls",
        body: "Cats make fur balls which is why dogs are better",
        topic: "bananas",
      })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test('204: responds with 204 when article deleted', () => {
    return request(app)
    .delete("/api/articles/1")
    .expect(204)
    .then((res) => {
      expect(res.body).toEqual({})
    })
  });
  test('400: returns error if article_id is not a number', () => {
    return request(app)
    .delete("/api/articles/notanumber")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe('Invalid input')
    })
  })
  test('404: returns error if article_id not found', () => {
    return request(app)
    .delete("/api/articles/999")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('Article does not exist')
    })
  });
});