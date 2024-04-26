CREATE TABLE IF NOT EXISTS "account" (
  "id" serial not null,
  "firstName" varchar not null,
  "lastName" varchar not null,
  "email" varchar not null,
  "language" varchar not null,
  "currencyType" varchar not null,
  "currencySymbol" varchar not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  unique("email"),
  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

INSERT INTO "account" ("firstName","lastName","email","language","currencyType","currencySymbol","createdAt","updatedAt")
   VALUES ('Dmitry','Salnikov','dmitry_salnikov@protonmail.com','en','USD','$',now(),now());

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
