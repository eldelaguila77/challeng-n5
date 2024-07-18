CREATE DATABASE IF NOT EXISTS n5;
USE n5;

CREATE TABLE IF NOT EXISTS person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    personId INT,
    FOREIGN KEY (personId) REFERENCES person(id)
);

CREATE TABLE IF NOT EXISTS officer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    officer_number int UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleId INT,
    officerId INT,
    ticket_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    FOREIGN KEY (vehicleId) REFERENCES vehicle(id),
    FOREIGN KEY (officerId) REFERENCES officer(id)
);

INSERT INTO person (name, email) VALUES ('John Doe', 'john.doe@example.com'), ('Jane Smith', 'jane.smith@example.com');

INSERT INTO vehicle (plate, brand, color, personId) VALUES ('ABC123', 'Toyota', 'Blue', 1), ('XYZ789', 'Honda', 'Red', 2);

INSERT INTO officer (officer_number, name) VALUES (12345, 'Officer Smith'), (67890, 'Officer Johnson');

INSERT INTO vehicle_ticket (vehicleId, officerId, comments) VALUES (1, 1, 'Speeding'), (2, 2, 'Parking violation');