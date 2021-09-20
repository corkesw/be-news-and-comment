const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const request = require('supertest')
const app = require('../app.js')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('test connection to api router', () => {
    test('200: should respond with ok message', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
            expect(res.body.msg).toBe('All OK from API Router')
        })
    });
});

describe('/api/topics', () => {
    test('200: should respond with a list of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            res.body.topics.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining(
                    {
                        slug: expect.any(String),
                        description: expect.any(String)
                    }
                ))
            })
        })
    });
});
