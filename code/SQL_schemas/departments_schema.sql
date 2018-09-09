
USE bamazon; 

CREATE TABLE departments (
    department_id INTEGER(200) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(200) NOT NULL,
    overhead_cost DECIMAL(10,2) NOT NULL,
    primary key (department_id)
);

INSERT INTO departments (department_name, overhead_cost) 
VALUES ('Computer Graphics Cards', 20000.00),
('Internal Solid State Drives', 12500.00),
('Computer CPU Processors', 20000.00),
('Water Cooling Systems', 8000.00),
('Computer Motherboards', 7500.00)