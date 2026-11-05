import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { Prisma } from '@prisma/client';

const DEFAULT_ABOUT_HERO = {
  tagline: 'Platform Manajemen Event & Expo',
  headline: 'Kelola Event & Expo Jadi Mudah',
  highlightText: 'dengan Satu Platform Terintegrasi',
  description:
    'MEXPO menyatukan pendaftaran, check-in QR, workshop, tenant/POS, sertifikat digital, hingga laporan dalam satu sistem — cepat, akurat, dan siap dipakai di event apa pun.',
  backgroundImage: '/images/carousel/carousel-01.png',
};

const DEFAULT_ABOUT_STORY = {
  heading: 'Tentang MEXPO',
  paragraphs: [
    'MEXPO adalah platform manajemen event dan expo berbasis web yang menyatukan seluruh proses penyelenggaraan — dari pendaftaran peserta, penerbitan tiket, hingga check-in menggunakan QR code — dalam satu sistem yang mudah dipakai oleh panitia, tenant, dan pengunjung.',
    'Tujuan kami sederhana: membantu penyelenggara menjalankan acara dengan lebih rapi, cepat, dan transparan. Dengan data yang tercatat otomatis — mulai dari jumlah pendaftar, kehadiran per booth, transaksi tenant, hingga kehadiran workshop dan seminar — keputusan berbasis data menjadi lebih mudah dan akurat.',
    'Berawal dari kebutuhan event expo di SMK Telkom Malang, MEXPO berkembang menjadi solusi yang melayani berbagai jenis acara: expo, career fair, seminar, pameran, hingga market day. Setiap pembaruan didasarkan pada masukan langsung dari para penyelenggara, sehingga fiturnya selalu relevan dengan kebutuhan nyata di lapangan.',
  ],
};

const DEFAULT_ABOUT_GALLERY = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    label: 'Konferensi',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    label: 'Presentasi',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    label: 'Acara Publik',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    label: 'Pameran',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    label: 'Kelulusan',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80',
    label: 'Lokakarya',
  },
];

const DEFAULT_ABOUT_VALUES = [
  {
    icon: 'QrCode',
    title: 'Andal',
    description: 'Sistem yang tetap stabil saat tekanan tertinggi.',
  },
  {
    icon: 'BarChart3',
    title: 'Inovatif',
    description: 'Terus menyempurnakan alur kerja penyelenggaraan.',
  },
  {
    icon: 'Users',
    title: 'Transparan',
    description: 'Data peserta terlindungi dan tercatat jelas.',
  },
  {
    icon: 'Zap',
    title: 'Efisien',
    description: 'Meminimalkan langkah untuk kecepatan operasional.',
  },
];

const DEFAULT_CONTENTS: Record<string, unknown> = {
  about_hero: DEFAULT_ABOUT_HERO,
  about_story: DEFAULT_ABOUT_STORY,
  about_gallery: DEFAULT_ABOUT_GALLERY,
  about_values: DEFAULT_ABOUT_VALUES,
};

@Injectable()
export class SiteContentsService {
  private readonly logger = new Logger(SiteContentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async getContent(sectionKey: string) {
    const record = await this.prisma.site_contents.findUnique({
      where: { section_key: sectionKey },
      include: {
        editor: { select: { uuid: true, full_name: true, email: true } },
      },
    });

    if (!record) {
      // Fallback to default content if available
      const fallback = DEFAULT_CONTENTS[sectionKey] ?? null;
      return {
        status: true,
        data: fallback,
        is_default: true,
      };
    }

    return {
      status: true,
      data: record.content,
      updated_at: record.updated_at,
      editor: record.editor,
      is_default: false,
    };
  }

  async getAllContents() {
    const records = await this.prisma.site_contents.findMany();
    const result: Record<string, any> = { ...DEFAULT_CONTENTS };

    for (const rec of records) {
      result[rec.section_key] = rec.content;
    }

    return {
      status: true,
      data: result,
    };
  }

  async updateContent(sectionKey: string, content: any, userId: string) {
    const updated = await this.prisma.site_contents.upsert({
      where: { section_key: sectionKey },
      update: {
        content: content as Prisma.InputJsonValue,
        updated_by: userId,
      },
      create: {
        section_key: sectionKey,
        content: content as Prisma.InputJsonValue,
        updated_by: userId,
      },
      include: {
        editor: { select: { uuid: true, full_name: true, email: true } },
      },
    });

    return {
      status: true,
      message: `Konten seksi "${sectionKey}" berhasil disimpan`,
      data: updated.content,
      updated_at: updated.updated_at,
    };
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File gambar tidak ditemukan');
    }

    const bucket = 'expo-project-content';
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;

    await this.s3Service.upload(bucket, filename, file.buffer, file.mimetype);

    const endpoint = this.configService.get<string>('MINIO_ENDPOINT') ?? '';
    const fileUrl = `${endpoint}/${bucket}/${filename}`;

    return {
      status: true,
      message: 'Gambar berhasil diunggah',
      data: {
        url: fileUrl,
        filename,
      },
    };
  }
}
