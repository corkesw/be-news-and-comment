const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");

const { checkExists } = require("../db/utils/data-manipulation");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("checkExists", () => {
  test("should return true if item is found", async () => {
    const table = "users";
    const column = "username";
    const item = "butter_bridge";
    const actual = await checkExists(table, column, item);
    const expected = true;
    expect(actual).toBe(expected);
  });
  test("should return false if item is not found", async () => {
    const table = "users";
    const column = "username";
    const item = "butter_balls";
    const actual = await checkExists(table, column, item);
    const expected = false;
    expect(actual).toBe(expected);
  });
});
