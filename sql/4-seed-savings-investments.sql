INSERT INTO "saving" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
   VALUES (1,'Amex','2023-10-12',2023,10,2,1500,now(),now()),
          (1,'Amex','2023-09-06',2023,9,1,1500,now(),now()),
          (1,'Amex','2023-07-05',2023,7,1,1500,now(),now()),
          (1,'Amex','2023-05-11',2023,5,2,1000,now(),now()),
          (1,'Amex','2023-05-26',2023,5,4,1000,now(),now()),
          (1,'Amex','2023-04-10',2023,4,2,1500,now(),now()),
          (1,'Amex','2023-04-26',2023,4,4,1000,now(),now()),
          (1,'Amex','2023-02-19',2023,2,3,-1000,now(),now());

INSERT INTO "investment" ("accountId","name","dateString","year","month","week","ticker","shares","pricePerShare","createdAt","updatedAt")
   VALUES (1,'S&P500','2023-09-24',2023,9,3,'SPDY',1,429.93,now(),now()),
          (1,'Dow Jones','2023-09-24',2023,9,3,'DJI',1,338.28,now(),now()),
          (1,'Dow Jones','2023-06-05',2023,6,1,'DJI',1.36,367.65,now(),now()),
          (1,'Apple Inc.','2023-06-05',2023,6,1,'AAPL',5,179.05,now(),now()),
          (1,'Berkshire Grey','2023-02-18',2023,2,3,'BGRY',295,1.56,now(),now()),
          (1,'Apple Inc.','2023-02-18',2023,2,3,'AAPL',25,1.52,now(),now()),
          (1,'S&P500','2023-02-18',2023,2,3,'SPDY',1.39,403.09,now(),now()),
          (1,'CALM','2023-02-18',2023,2,3,'CALM',8.55,58.43,now(),now());
