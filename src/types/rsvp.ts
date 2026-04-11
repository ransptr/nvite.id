export type AttendanceStatus = 'attending' | 'unable';

export type RsvpRecord = {
  id: string;
  invitationSlug: string;
  guestName: string;
  attendance: AttendanceStatus;
  guestCount: number;
  wishes: string;
  qrValue: string;
  createdAt: string;
};

export type RsvpPayload = {
  invitationSlug: string;
  guestName: string;
  attendance: AttendanceStatus;
  guestCount: number;
  wishes: string;
};

export type RsvpStore = {
  items: RsvpRecord[];
};
