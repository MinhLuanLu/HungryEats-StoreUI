SELECT * 
FROM Orders
JOIN Food ON Orders.Food_id = Food.Food_id
JOIN Users ON Orders.User_id = Users.User_id
WHERE DATE(Orders.created_at) = '2024-12-20';
ALTER TABLE Discounts
ADD COLUMN Purchase_count INT


CREATE TABLE Purchase_log(
    Purchase_log_id INT AUTO_INCREMENT PRIMARY KEY,
    User_id INT NOT NULL,
    Store_id INT NOT NULL,
    Purchase_count INT NOT NULL,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_id) REFERENCES Users(User_id) ON DELETE CASCADE,
    FOREIGN KEY (Store_id) REFERENCES Stores(Store_id) ON DELETE CASCADE

)

SHOW TABLES
DROP TABLE Discounts
SELECT * FROM Discounts 