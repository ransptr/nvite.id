import express from 'express';
import {promises as fs} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {createServer as createViteServer} from 'vite';

import {invitations} from './src/data/invitations';

type AttendanceStatus = 'attending' | 'unable';

type RsvpRecord = {
  id: string;
  invitationSlug: string;
  guestName: string;
  attendance: AttendanceStatus;
  guestCount: number;
  wishes: string;
  qrValue: string;
  createdAt: string;
};

type RsvpStore = {
  items: RsvpRecord[];
};

function getInvitationMaxGuests(slug: string) {
  return invitations.find((item) => item.slug === slug)?.rsvp.maxGuestsDefault ?? 1;
}

function createQrValue(slug: string, guestName: string) {
  const safeName = guestName.trim().toLowerCase().replace(/\s+/g, '-');
  return `${slug}:${safeName || 'guest'}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);
  const dataFilePath = path.join(__dirname, 'data', 'rsvps.json');
  let writeQueue = Promise.resolve();

  const readStore = async (): Promise<RsvpStore> => {
    const content = await fs.readFile(dataFilePath, 'utf8');
    const parsed = JSON.parse(content) as RsvpStore;
    return {
      items: parsed.items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  };

  const writeStore = async (store: RsvpStore) => {
    await fs.writeFile(dataFilePath, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
  };

  app.use(express.json());

  app.get('/api/rsvps', async (request, response) => {
    try {
      const slug = typeof request.query.slug === 'string' ? request.query.slug : null;
      const store = await readStore();
      const items = slug
        ? store.items.filter((item) => item.invitationSlug === slug)
        : store.items;

      response.json({items});
    } catch (error) {
      console.error('Failed to read RSVP store:', error);
      response.status(500).json({message: 'Unable to load RSVPs.'});
    }
  });

  app.post('/api/rsvps', async (request, response) => {
    const body = request.body as Partial<RsvpRecord>;
    const guestName = body.guestName?.trim();
    const invitationSlug = body.invitationSlug?.trim();
    const wishes = body.wishes?.trim() ?? '';
    const attendance = body.attendance === 'unable' ? 'unable' : 'attending';

    if (!guestName || !invitationSlug) {
      response.status(400).json({message: 'Guest name and invitation slug are required.'});
      return;
    }

    const maxGuests = getInvitationMaxGuests(invitationSlug);
    const requestedGuestCount = Number(body.guestCount ?? 1);

    if (attendance === 'attending' && !Number.isInteger(requestedGuestCount)) {
      response.status(400).json({message: 'Guest count must be a whole number.'});
      return;
    }

    if (
      attendance === 'attending' &&
      (requestedGuestCount < 1 || requestedGuestCount > maxGuests)
    ) {
      response.status(400).json({message: `Guest count must be between 1 and ${maxGuests}.`});
      return;
    }

    const guestCount = attendance === 'attending' ? requestedGuestCount : 0;

    try {
      let record: RsvpRecord | null = null;

      writeQueue = writeQueue.then(async () => {
        const store = await readStore();
        record = {
          id: crypto.randomUUID(),
          invitationSlug,
          guestName,
          attendance,
          guestCount,
          wishes,
          qrValue: createQrValue(invitationSlug, guestName),
          createdAt: new Date().toISOString(),
        };

        store.items.unshift(record);
        await writeStore(store);
      });

      await writeQueue;
      response.status(201).json({record});
    } catch (error) {
      console.error('Failed to write RSVP store:', error);
      writeQueue = Promise.resolve();
      response.status(500).json({message: 'Unable to save RSVP.'});
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: false // Disable HMR to avoid websocket connection issues in some browsers
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
