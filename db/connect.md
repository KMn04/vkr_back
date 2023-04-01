## Docker образ mongoDB запускать без дополнительных настроек

Стандартный порт 27017

docker run --name some-mongo -d mongo:latest

## Docker образ пострге

docker run --name some-postgres -e POSTGRES_PASSWORD=postgres -p 5444:5432 -d postgres
