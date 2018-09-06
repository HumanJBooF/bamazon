
USE bamazon; 

CREATE TABLE departments (
    department_id INTEGER(200) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(200) NOT NULL,
    over_head_cost DECIMAL(10,2) NOT NULL,
    product_sales DECIMAL(10,2) NOT NULL,
    total_profits INTEGER(200),
    primary key (depatment_id)
);