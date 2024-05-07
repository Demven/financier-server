CREATE TABLE IF NOT EXISTS "account" (
  "id" serial not null,
  "firstName" varchar not null,
  "lastName" varchar not null,
  "email" varchar not null,
  "password" varchar not null,
  "language" varchar not null,
  "currencyType" varchar not null,
  "currencySymbol" varchar not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  unique("email"),
  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

INSERT INTO "account" ("firstName","lastName","email","password","language","currencyType","currencySymbol","createdAt","updatedAt")
   VALUES ('Dmitry','Salnikov','dmitry_salnikov@protonmail.com','financier','en','USD','$',now(),now());

CREATE TABLE IF NOT EXISTS "color" (
  "id" serial not null,
  "accountId" int,
  "name" varchar not null,
  "hex" varchar not null,
  "red" int not null,
  "green" int not null,
  "blue" int not null,
  "intensity" varchar not null,
  "custom" bool,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "color_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "color_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

INSERT INTO "color" ("name","hex","red","green","blue","intensity","custom","createdAt","updatedAt")
   VALUES ('Red','#FF4F69',255,79,105,'light',false,now(),now()),
          ('Orange','#F8B559',248,181,89,'light',false,now(),now()),
          ('Yellow','#EBDA04',235,218,4,'light',false,now(),now()),
          ('Green','#19C87E',25,200,126,'light',false,now(),now()),
          ('Sky','#219FDD',33,159,221,'light',false,now(),now()),
          ('Purple','#696DFB',105,109,251,'light',false,now(),now());

CREATE TABLE IF NOT EXISTS "category" (
  "id" serial not null,
  "accountId" int not null,
  "name" varchar not null,
  "description" varchar,
  "colorId" int not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "category_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "category_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id"),
  CONSTRAINT "category_colorId" FOREIGN KEY ("colorId") REFERENCES "color"("id")
);

INSERT INTO "category" ("accountId","name","description","colorId","createdAt","updatedAt")
   VALUES (1,'Primary Expenses','Food, clothes, transport, medicine, bills, gym, etc.',1,now(),now()),
          (1,'Secondary Expenses','Home goods, furniture, renovation, car, hobbies, etc.',2,now(),now()),
          (1,'Housing','Mortgage, rent, insurance, etc.',3,now(),now()),
          (1,'Major','Traveling, expensive purchases',4,now(),now()),
          (1,'Entertainment','Dining, bars, night clubs, concerts, casual trips, etc.',5,now(),now()),
          (1,'Gifts & Charity','Donations, presents, street musicians, etc.',6,now(),now());

CREATE TABLE IF NOT EXISTS "expense" (
  "id" serial not null,
  "accountId" int not null,
  "name" varchar not null,
  "categoryId" int not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "amount" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "expense_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "expense_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id"),
  CONSTRAINT "expense_categoryId" FOREIGN KEY ("categoryId") REFERENCES "category"("id")
);

CREATE TABLE IF NOT EXISTS "income" (
  "id" serial not null,
  "accountId" int not null,
  "name" varchar not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "amount" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "income_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "income_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

CREATE TABLE IF NOT EXISTS "saving" (
  "id" serial not null,
  "accountId" int not null,
  "name" varchar not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "amount" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "saving_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "saving_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

CREATE TABLE IF NOT EXISTS "investment" (
  "id" serial not null,
  "accountId" int not null,
  "name" varchar not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "ticker" varchar not null,
  "shares" double precision not null,
  "pricePerShare" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "investment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "investment_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

CREATE TABLE IF NOT EXISTS "expensesTotals" (
  "id" serial not null,
  "accountId" int,
  "totals" jsonb not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "expensesTotals_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

INSERT INTO "expensesTotals" ("accountId","totals","createdAt","updatedAt")
   VALUES (1,'{"total": 18451.07,"yearAverage": 18451.07,"monthAverage": 9225.54,"weekAverage": 2306.385,"2023": {"total": 18451.07,"average": 9225.54,"10": {"total": 9804.98,"average": 2451.25,"1": 5445.86,"2": 1080.82,"3": 932.07,"4": 2346.23},"9": {"total": 8646.09,"average": 2161.52,"1": 4534.78,"2": 1187.54,"3": 1207.65,"4": 1716.12}}}',now(),now());

CREATE TABLE IF NOT EXISTS "incomesTotals" (
  "id" serial not null,
  "accountId" int,
  "totals" jsonb not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "incomesTotals_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

INSERT INTO "incomesTotals" ("accountId","totals","createdAt","updatedAt")
   VALUES (1,'{"total": 101150.72,"yearAverage": 101150.72,"monthAverage": 10115.07,"weekAverage": 2528.77,"2023": {"total": 101150.72,"average": 10115.07,"10": {"total": 9925.87,"average": 2481.47,"1": 5138.29,"3": 4787.58},"9": {"total": 9931.16,"average": 2482.79,"1": 5143.59,"3": 4787.57},"8": {"total": 10210.59,"average": 2552.65,"1": 5304.59,"3": 4906},"7": {"total": 9958.73,"average": 2489.68,"1": 5143.59,"3": 4815.14},"6": {"total": 10016.72,"average": 2504.18,"1": 5204.11,"3": 4812.61},"5": {"total": 10090.07,"average": 2522.52,"1": 5302.51,"3": 4787.56},"4": {"total": 10437.63,"average": 2609.41,"1": 5454.9,"3": 4982.73},"3": {"total": 10820.25,"average": 2705.06,"1": 4980.5,"3": 5839.75},"2": {"total": 10039.17,"average": 2509.79,"1": 5006.43,"3": 5032.74},"1": {"total": 9720.53,"average": 2430.13,"1": 4892.92,"3": 4827.61}}}',now(),now());

CREATE TABLE IF NOT EXISTS "savingsTotals" (
  "id" serial not null,
  "accountId" int,
  "totals" jsonb not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "savingsTotals_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

INSERT INTO "savingsTotals" ("accountId","totals","createdAt","updatedAt")
   VALUES (1,'{"total": 8000,"yearAverage": 8000,"monthAverage": 666.67,"weekAverage": 166.67,"2023": {"total": 8000,"average": 1333.33,"10": {"total": 1500,"average": 375,"2": 1500},"9": {"total": 1500,"average": 375,"2": 1500},"7": {"total": 1500,"average": 375,"1": 1500},"5": {"total": 2000,"average": 500,"2": 1000,"4": 1000},"4": {"total": 2500,"average": 625,"2": 1500,"4": 1000},"2": {"total": -1000,"average": -250,"3": -1000}}}',now(),now());

CREATE TABLE IF NOT EXISTS "investmentsTotals" (
  "id" serial not null,
  "accountId" int,
  "totals" jsonb not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "investmentsTotals_accountId" FOREIGN KEY ("accountId") REFERENCES "account"("id")
);

INSERT INTO "investmentsTotals" ("accountId","totals","createdAt","updatedAt")
   VALUES (1,'{"total": 3721.53,"yearAverage": 3721.53,"monthAverage": 310.13,"weekAverage": 77.53,"2023": {"total": 3721.53,"average": 1240.51,"9": {"total": 768.21,"average": 192.05,"3": 768.21},"6": {"total": 1395.25,"average": 348.81,"1": 1395.25},"2": {"total": 1558.07,"average": 389.52,"3": 1558.07}}}',now(),now());
