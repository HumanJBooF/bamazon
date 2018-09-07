
USE bamazon; 

CREATE TABLE departments (
    department_id INTEGER(200) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(200) NOT NULL,
    over_head_cost DECIMAL(10,2) NOT NULL,
    primary key (depatment_id)
);