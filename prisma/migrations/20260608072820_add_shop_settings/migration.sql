-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "shopName" TEXT NOT NULL DEFAULT 'DZ Boutique',
    "phone" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "deliveryPrice" TEXT NOT NULL DEFAULT 'A confirmer',
    "logoUrl" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);
