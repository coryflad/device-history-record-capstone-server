CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (225) NOT NULL
);

CREATE TABLE dhr (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES book_collection(id) ON DELETE CASCADE NOT NULL,
    device_name VARCHAR (255) NOT NULL,
    device_sn INTEGER NOT NULL,.
    dmr_no VARCHAR (255) NOT NULL,
    document_id INTEGER NOT NULL,
    wo_no VARCHAR (255) NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE pancake (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);