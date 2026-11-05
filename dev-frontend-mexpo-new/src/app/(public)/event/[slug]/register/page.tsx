import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Event, TicketType } from "@/entities/event/event.entity";
import { getEventByUuid } from "@/services/public.service";
import { getRegistrationFields, getTicketTypes } from "@/services/registration.service";
import RegistrationForm from "@/features/public/registration/RegistrationForm";
import { SITE_URL } from "@/global";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const eventRes = await getEventByUuid(slug);
  const event = eventRes?.data;

  if (!event || eventRes.status === false) {
    return {
      title: "Registrasi Event",
    };
  }

  const title = `Pendaftaran Tiket ${event.name}`;
  const description = `Daftar dan dapatkan tiket acara ${event.name}. Isi formulir pendaftaran dan terima e-ticket QR Code langsung di Mexpo.`;
  const registerUrl = `${SITE_URL}/event/${event.slug || event.uuid}/register`;
  const imageUrl = event.photo
    ? event.photo.startsWith("http")
      ? event.photo
      : `${SITE_URL}${event.photo.startsWith("/") ? "" : "/"}${event.photo}`
    : `${SITE_URL}/images/cards/card-e.png`;

  return {
    title,
    description,
    alternates: {
      canonical: registerUrl,
    },
    openGraph: {
      title,
      description,
      url: registerUrl,
      siteName: "Mexpo",
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Pendaftaran ${event.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function RegisterEventPage({ params }: PageProps) {
  const { slug } = await params;
  const eventRes = await getEventByUuid(slug);
  const event: Event | null = eventRes.data ?? null;
  if (!event || eventRes.status === false) notFound();

  const fieldsRes = await getRegistrationFields(event.uuid);
  const fields = fieldsRes.data ?? [];

  let ticketTypes: TicketType[] = [];
  if (event.ticket_mode === "PAID" || event.features?.paidTicket === true) {
    const ttRes = await getTicketTypes(event.uuid);
    ticketTypes = ttRes.data ?? [];
  }

  return (
    <RegistrationForm event={event} fields={fields} ticketTypes={ticketTypes} />
  );
}
