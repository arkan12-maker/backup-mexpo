export interface EventSpeaker {
  uuid: string;
  event_id: string;
  name: string;
  bio: string;
  photo: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  workshopSpeakers?: Array<{
    uuid?: string;
    workshop?: {
      uuid?: string;
      title: string;
      location?: string;
      start_time?: string;
      end_time?: string;
    };
  }>;
  eventRundownSpeakers?: Array<{
    uuid?: string;
    event_rundown?: {
      uuid?: string;
      title: string;
      start_time?: string;
      end_time?: string;
    };
  }>;
}
