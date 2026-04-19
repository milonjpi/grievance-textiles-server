/*
  Warnings:

  - Added the required column `employeeNameBn` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "employeeNameBn" TEXT NOT NULL;
