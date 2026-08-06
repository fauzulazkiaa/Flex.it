export const PRISMA_SCHEMA_CODE = `// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum StatusPendaftaran {
  BELUM_DAFTAR
  SUDAH_DAFTAR
  LOLOS
  TIDAK_LOLOS
  SELESAI
}

model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  color       String     @default("blue")
  iconName    String     @default("Folder")
  description String?
  activities  Activity[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("categories")
}

model Activity {
  id               String            @id @default(cuid())
  title            String
  categoryId       String
  category         Category          @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  status           StatusPendaftaran @default(BELUM_DAFTAR)
  regDeadline      DateTime          // Deadline Pendaftaran
  submitDeadline   DateTime?         // Deadline Submit Karya
  announcementDate DateTime?         // Tanggal Pengumuman
  eventDate        DateTime?         // Tanggal Pelaksanaan
  organizer        String?           // Penyelenggara
  details          String            @db.Text // Benefit, akomodasi, hadiah, dsb
  driveUrl         String?           // Tautan Google Drive / Sertifikat
  submissionUrl    String?           // Tautan submit karya
  documentsUrl     String?           // Tautan berkas persyaratan
  year             Int               @default(2026)
  tags             String[]          @default([])
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  @@index([categoryId])
  @@index([status])
  @@index([year])
  @@index([regDeadline])
  @@map("activities")
}
`;

export const NEXTJS_FOLDER_STRUCTURE = `
my-activity-tracker/
├── app/
│   ├── layout.tsx                 # Root layout with Tailwind CSS & Providers
│   ├── page.tsx                   # Dashboard Utama (Server Component + Client Charts)
│   ├── activities/
│   │   ├── page.tsx               # Tabel & Daftar Kegiatan dengan Filter Server Component
│   │   ├── new/
│   │   │   └── page.tsx           # Form Input Kegiatan Baru (CRUD)
│   │   └── [id]/
│   │       ├── page.tsx           # Detail Activity & Pengarsipan Berkas
│   │       └── edit/page.tsx      # Form Edit Kegiatan
│   ├── categories/
│   │   └── page.tsx               # Manajemen Kategori & Tipe Kegiatan
│   ├── api/
│   │   ├── activities/
│   │   │   ├── route.ts           # GET & POST Activity (Prisma Client)
│   │   │   └── [id]/route.ts      # GET, PUT, DELETE Activity
│   │   ├── categories/
│   │   │   └── route.ts           # GET & POST Category
│   │   └── stats/
│   │       └── route.ts           # Metrik Statistik & Analytics API
├── components/
│   ├── ui/                        # Shadcn UI Components (Button, Dialog, Badge, Input, Table)
│   ├── Dashboard/
│   │   ├── StatCards.tsx          # Card Metrik (Total, Success Rate, Deadlines)
│   │   ├── CategoryChart.tsx      # PieChart Distribusi Kategori (Recharts)
│   │   ├── UpcomingDeadlines.tsx  # List Tenggat Waktu Terdekat
│   │   └── SuccessRateCard.tsx    # Analitik Persentase Lolos
│   ├── Activities/
│   │   ├── ActivityTable.tsx      # Tabel Kegiatan & Sorting/Filtering
│   │   ├── ActivityForm.tsx       # Form Input/Edit (CRUD)
│   │   ├── ActivityDetail.tsx     # Preview Berkas & Sertifikat
│   │   └── FilterBar.tsx          # Bar Pencarian & Filter Kategori/Status
│   └── Layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── prisma.ts                  # Singleton Prisma Client instance
│   └── utils.ts                   # Date formatting & helper functions
├── prisma/
│   ├── schema.prisma              # Database Schema (Prisma ORM)
│   └── seed.ts                    # Seed Data Kategori & Activity awal
├── public/                        # Static assets & icons
├── .env.example                   # Environment Variables (DATABASE_URL, NEXTAUTH_SECRET)
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
`;

export const SERVER_ACTION_EXAMPLE = `// app/activities/page.tsx (Server Component Next.js 14/15)
import { prisma } from "@/lib/prisma";
import { ActivityTable } from "@/components/Activities/ActivityTable";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    status?: string;
    year?: string;
  }>;
}

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { query, category, status, year } = params;

  // Filter query langsung di database PostgreSQL melalui Prisma ORM
  const activities = await prisma.activity.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { organizer: { contains: query, mode: 'insensitive' } },
            { details: { contains: query, mode: 'insensitive' } },
          ]
        } : {},
        category && category !== 'ALL' ? { categoryId: category } : {},
        status && status !== 'ALL' ? { status: status as any } : {},
        year && year !== 'ALL' ? { year: parseInt(year) } : {},
      ]
    },
    include: {
      category: true,
    },
    orderBy: {
      regDeadline: 'asc',
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daftar & Arsip Kegiatan</h1>
      <ActivityTable initialActivities={activities} />
    </div>
  );
}
`;
