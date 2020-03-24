PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS pharmacies;
CREATE TABLE pharmacies (
	pharmacy_id INTEGER PRIMARY KEY,
	pharmacy_name CHAR(255),
	access_code_hash CHAR(255)
);

DROP TABLE IF EXISTS patients;
CREATE TABLE patients (
	patient_id INTEGER PRIMARY KEY,
	patient_firstname CHAR(255),
	patient_lastname CHAR(255),
	patient_email CHAR(255),
	password_hash CHAR(255)
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
	order_id INTEGER PRIMARY KEY,
	patient_id INTEGER,
	pharmacy_id INTEGER,
	status CHAR(255),
	message CHAR(1023),
	FOREIGN KEY(patient_id) REFERENCES patients(patient_id),
	FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(pharmacy_id)
);

