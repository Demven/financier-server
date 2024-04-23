CREATE DATABASE financier ENCODING "UTF8";

CREATE TABLE IF NOT EXISTS "user" (
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
  CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "color" (
  "id" serial not null,
  "userId" int not null,
  "name" varchar not null,
  "hex" varchar not null,
  "red" int not null,
  "green" int not null,
  "blue" int not null,
  "intensity" varchar not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "color_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "color_userId" FOREIGN KEY ("userId") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "category" (
  "id" serial not null,
  "userId" int not null,
  "name" varchar not null,
  "description" varchar,
  "colorId" int not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "category_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "category_userId" FOREIGN KEY ("userId") REFERENCES "user"("id"),
  CONSTRAINT "category_colorId" FOREIGN KEY ("colorId") REFERENCES "color"("id")
);

CREATE TABLE IF NOT EXISTS "expense" (
  "id" serial not null,
  "userId" int not null,
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
  CONSTRAINT "expense_userId" FOREIGN KEY ("userId") REFERENCES "user"("id"),
  CONSTRAINT "expense_categoryId" FOREIGN KEY ("categoryId") REFERENCES "category"("id")
);

CREATE TABLE IF NOT EXISTS "income" (
  "id" serial not null,
  "userId" int not null,
  "name" varchar not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "amount" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "income_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "income_userId" FOREIGN KEY ("userId") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "saving" (
  "id" serial not null,
  "userId" int not null,
  "name" varchar not null,
  "dateString" varchar not null,
  "year" int not null,
  "month" int not null,
  "week" int not null,
  "amount" double precision not null,
  "createdAt" timestamptz,
  "updatedAt" timestamptz,
  CONSTRAINT "saving_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "saving_userId" FOREIGN KEY ("userId") REFERENCES "user"("id")
);

CREATE TABLE IF NOT EXISTS "investment" (
  "id" serial not null,
  "userId" int not null,
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
  CONSTRAINT "investment_userId" FOREIGN KEY ("userId") REFERENCES "user"("id")
);
