<div>
<h1 align="center">
  GY Metrics API
</h1>
</div>

<div align="center">

<img src="https://img.shields.io/badge/Typescript-5.1.3-3198c6">

<img src="https://img.shields.io/badge/NodeJS-22.11.0-026e00">

<img src="https://img.shields.io/badge/NestJS-10.4.8-ea2845">

<img src="https://img.shields.io/badge/PostgreSQL-16.4.0-0069d9">

</div>

# Overview

An efficient API for processing large-scale CSV files using queues and batch processing. It provides data export aggregated by day, month, and year. Developed with TypeScript, NestJS, and PostgreSQL, it is designed for high performance and scalability.

# Installation

1. Clone the repository:

```
git clone https://github.com/wendelsantosd/gy-metrics-api
```

2. Install the dependencies:

```
yarn
```

3. Create a `.env` file from the `.env.example` file.

4. Check if your PostgreSQL and Redis database is configured. There is a `docker-compose.yml` file that quickly sets up a database.

```
sudo docker compose up -d
```

5. Synchronize the database with the application:

```
yarn init:db
```

6. Start the application.

```
yarn start:dev
```

# Application Running

```
  http://localhost:3333/
```

# Endpoints

1. Process CSV

```
/measure
```

```
POST
```

1. Process CSV

```
/measure
```

```
POST
```

2. Get Measures

```
/get
```

```
GET
```

```
body: {
  metricId: number;
  aggType: day | month | year;
  initialDate: "yyyy-MM-dd";
  finalDate: "yyyy-MM-dd";
}
```

3. Export Measures

```
/export
```

```
GET
```

```
params: {
  metricId: string;
  initialDate: "yyyy-MM-dd";
  finalDate: "yyyy-MM-dd";
}
```

# Contact

<p style="font-size: 18px;">
Wendel Santos, 2024.
</p>
<p style="font-size: 18px;">
wendelwcsantos@gmail.com
</p>
