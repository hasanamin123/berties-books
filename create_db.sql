create database LondonRatings;
USE LondonRatings;
CREATE TABLE areaRatings (id INT AUTO_INCREMENT, area VARCHAR(50), rating INT unsigned, PRIMARY KEY(id));
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON LondonRatings.* TO 'appuser'@'localhost';
CREATE TABLE users (username VARCHAR(50), first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, hashedPassword VARCHAR(255) NOT NULL, PRIMARY KEY (username));