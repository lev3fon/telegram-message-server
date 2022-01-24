```docker run --name tg-bot -p 6432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=post123 -e POSTGRES_DB=bot-db -d postgres``` -
Создание докера для БД

```npx sequelize-cli model:generate --name Urls --attributes userId:int,url:text``` - 
Генерирование кода для модели БД

```docker build -t tg-bot .``` - Создание докера для бота

```docker run -p 49160:8080 bot-tg``` - Запуск докера с ботом

