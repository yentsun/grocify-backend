# Grocify Backend

The backend API for **Grocify**, a grocery price monitoring service that lets users track prices from uploaded receipts, view trends, and engage in a gamified experience with credits and leaderboards.

## Features

- **User Authentication**: Register, login, and manage user sessions.
- **Receipt Upload**: Loggers upload receipts to earn credits and contribute price data.
- **Price Tracking**: Observers view price trends, product details, and shop locations.
- **Credits and Leaderboards**: Gamified features to reward activity and rank Loggers.

## Stack

- **Node.js**: Server and API logic
- **PostgreSQL**: Data storage for users, receipts, products, and credits
- **ChatGPT Vision**: Image processing and data extraction from uploaded receipt images

## Glossary

- **Logger**: A user who uploads grocery receipts to contribute data to the app, earning credits in return.
- **Observer**: A user who views product prices, trends, and shop data, using credits to unlock additional details.
- **Credit**: The internal currency within Grocify. Loggers earn credits by uploading receipts, and both Loggers and Observers use credits to access detailed price insights.
- **ChatGPT Vision**: An AI-powered tool used to process and extract information from receipt images, enhancing data accuracy.
- **Leaderboard**: A feature displaying rankings of top Loggers based on their contributions to the platform.
- **Notifications**: Alerts or messages sent to users about updates, such as price drops, receipt processing statuses, or leaderboard changes.