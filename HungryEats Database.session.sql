SELECT * 
FROM Orders
JOIN Food ON Orders.Food_id = Food.Food_id
JOIN Users ON Orders.User_id = Users.User_id
WHERE DATE(Orders.created_at) = '2024-12-20';
