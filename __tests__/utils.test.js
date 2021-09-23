const {
  formatData,
  addKeys,
  readFile
} = require("../db/utils/data-manipulation");

describe("formatData", () => {
  test("should return empty array if passed empty array", () => {
    const input = [];
    const keys = ["username", "name", "avatar_url"];
    const actual = formatData(input, keys);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  test("should not mutate original data", () => {
    const input = [
      {
        username: "jessjelly",
        name: "Jess Jelly",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      },
    ];
    const keys = ["username", "name", "avatar_url"];
    formatData(input, keys);
    expect(input).toEqual([
      {
        username: "jessjelly",
        name: "Jess Jelly",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      },
    ]);
  });
  test("should return a correctly formatted array when passed and array with one object", () => {
    const input = [
      {
        username: "jessjelly",
        name: "Jess Jelly",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      },
    ];
    const keys = ["username", "name", "avatar_url"];
    const actual = formatData(input, keys);
    const expected = [
      [
        "jessjelly",
        "Jess Jelly",
        "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("should work with an array of multiple objects", () => {
    const input = [
      {
        username: "cooljmessy",
        name: "Peter Messy",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002",
      },
      {
        username: "weegembump",
        name: "Gemma Bump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/7e/MrMen-Bump.png/revision/latest?cb=20180123225553",
      },
      {
        username: "jessjelly",
        name: "Jess Jelly",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      },
    ];
    const keys = ["username", "name", "avatar_url"];
    const actual = formatData(input, keys);
    const expected = [
      [
        "cooljmessy",
        "Peter Messy",
        "https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002",
      ],
      [
        "weegembump",
        "Gemma Bump",
        "https://vignette.wikia.nocookie.net/mrmen/images/7/7e/MrMen-Bump.png/revision/latest?cb=20180123225553",
      ],
      [
        "jessjelly",
        "Jess Jelly",
        "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("should work for article data", () => {
    const input = [
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: new Date(1579126860000),
        votes: 0,
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: new Date(1602419040000),
        votes: 0,
      },
    ];
    const keys = ["title", "body", "votes", "topic", "author", "created_at"];
    const actual = formatData(input, keys);
    const expected = [
      [
        "Am I a cat?",
        "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        0,
        "mitch",
        "icellusedkars",
        new Date(1579126860000),
      ],
      [
        "Moustache",
        "Have you seen the size of that thing?",
        0,
        "mitch",
        "butter_bridge",
        new Date(1602419040000),
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("should work for topic data", () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
      {
        description: "Hey good looking, what you got cooking?",
        slug: "cooking",
      },
    ];
    const keys = ["slug", "description"];
    const actual = formatData(input, keys);
    const expected = [
      ["coding", "Code is love, code is life"],
      ["football", "FOOTIE!"],
      ["cooking", "Hey good looking, what you got cooking?"],
    ];
    expect(actual).toEqual(expected);
  });
});

describe("addKeys", () => {
  test("should return an empty array when passed an empty array", () => {
    const objArr = [];
    const key = "key";
    const keyValues = [];
    const actual = addKeys(objArr, key, keyValues);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  test("should add key:value to single object", () => {
    const objArr = [{ name: "Obi" }];
    const key = "age";
    const keyValues = [{ id: 1, age: 5 }];
    const actual = addKeys(objArr, key, keyValues);
    const expected = [{ name: "Obi", age: 4 }];
    expect(actual).toEqual(expected);
  });
  test("works for multiple objects", () => {
    const objArr = [{ name: "Obi" }, { name: "Merlin" }];
    const key = "age";
    const keyValues = [
      { id: 1, age: 5 },
      { id: 2, age: 15 },
    ];
    const actual = addKeys(objArr, key, keyValues);
    const expected = [
      { name: "Obi", age: 4 },
      { name: "Merlin", age: 14 },
    ];
    expect(actual).toEqual(expected);
  });
});




