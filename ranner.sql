\echo 'Delete and recreate Ranner db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ranner;
CREATE DATABASE ranner;
\connect ranner

\i ranner-schema.sql



\echo 'Delete and recreate ranner_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ranner_test;
CREATE DATABASE ranner_test;
\connect ranner_test

\i ranner-schema.sql
\i ranner-seed.sql
