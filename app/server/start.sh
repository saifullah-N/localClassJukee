#!/bin/bash 
echo $DATABASE_URL
npx prisma migrate deploy && npm start
