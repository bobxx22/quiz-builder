// Must be imported before anything that reads `config/env`.
process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = ':memory:';
