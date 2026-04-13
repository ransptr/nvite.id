export type AttendanceStatus = 'attending' | 'not_attending';

export type RsvpRecord = {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: AttendanceStatus;
  guest_count: number;
  wishes: string | null;
  qr_value: string | null;
  created_at: string;
};

export type RsvpPayload = {
  invitation_id: string;
  guest_name: string;
  attendance: AttendanceStatus;
  guest_count: number;
  wishes: string;
  qr_value: string;
};

export type RsvpStore = {
  items: RsvpRecord[];
};
