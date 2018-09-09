
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon; 

USE bamazon; 

CREATE TABLE products (
    item_id INTEGER(200) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(200),
    product_sales DECIMAL(10,2) DEFAULT 0 NOT NULL,
    primary key (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Geforce GTX 1060 6GB GDDR5', 'Computer Grapics Cards', 299.99, 30),
('Geforrce GTX 1070 8GB GDDR5', 'Computer Graphics Cards', 409.99, 24),
('Geforce GTX 1070TI 8GB GDDR5', 'Computer Graphics Cards', 449.99, 17),
('Geforce GTX 1080 8GB GDDR5X', 'Computer Graphics Cards', 552.99, 8),
('Geforce GTX 1080TI 11GB GDDR5X','Computer Graphics Cards', 759.99, 3),
('Samsung 970 PRO 512GB NVMe PCIe M.2', 'Internal Solid State Drives', 99.99, 81),
('Samsung 970 PRO 1TB NVMe PCIe M.2', 'Internal Solid State Drives', 497.99, 44),
('Wester Digital Black 250GB NVMe PCIe M.2', 'Internal Solid State Drives', 98.99, 109),
('Wester Digital Black 1TB NVMe PCIe M.2', 'Internal Solid State Drives', 329.97, 73),
('Intel Core i5-6600k Processor 4 Cores 3.5 GHz Turbo Unlocked', 'Computer CPU Processors', 221.73, 88),
('Intel Core i7-8700k Processor 6 Cores 4.7GHz Turbo Unlocked', 'Computer CPU Processors', 339.99, 96),
('Intel Core i9-7940X Processor 14 Core 3.1GHz', 'Computer CPU Processors', 1231, 21),
('Intel Core i9-7950X Processor 16 Core 2.8GHz', 'Computer CPU Processors', 2080.99, 51), 
('NZXT Kraken X62 280mm AIO liquid CPU cooler', 'Water Cooling Systems', 159.99, 64),
('ASRock ATX DDR4 Z170 EXTREME7+', 'Computer Motherboards', 139.83, 112),
('Asus Rog Strix X299-E ATX DDR4', 'Computer Motherboards', 289.51, 53)