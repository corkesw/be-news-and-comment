\c nc_news_test

-- SELECT * FROM users;

-- SELECT * FROM topics;

-- SELECT * FROM articles 

-- SELECT * FROM comments;

-- SELECT article_id, COUNT(article_id) FROM comments GROUP BY article_id;

-- SELECT articles.* , COUNT(articles.article_id) AS comment_count FROM articles
-- LEFT JOIN comments 
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.article_id;

-- SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM comments
-- JOIN articles
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.article_id;

-- SELECT articles.article_id, COUNT(comments.article_id) AS comment_count FROM articles
-- LEFT JOIN comments 
-- ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id;

SELECT * FROM topics WHERE slug = 'fish'

-- SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles
--         LEFT JOIN comments 
--         ON articles.article_id = comments.article_id
--         WHERE articles.topic = 'mitch'
--         GROUP BY articles.article_id ORDER BY title asc;

-- SELECT * FROM comments ORDER BY article_id 