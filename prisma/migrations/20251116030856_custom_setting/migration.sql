-- CreateTable
CREATE TABLE "customSetting" (
    "id" TEXT NOT NULL,
    "to" TEXT[],
    "cc" TEXT[],
    "bcc" TEXT[],
    "sms" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "customSetting_pkey" PRIMARY KEY ("id")
);
