export type DmThreadPreview = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  online: boolean;
};

export type DmMessage = {
  id: string;
  senderId: "me" | "them";
  senderName: string;
  content: string;
  createdAt: string;
};

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

export const MOCK_DM_THREADS: DmThreadPreview[] = [
  {
    id: "dm-priya",
    name: "Priya Shah",
    lastMessage: "Sounds good, see you at the library!",
    lastMessageAt: minutesAgo(6),
    unreadCount: 2,
    online: true,
  },
  {
    id: "dm-marcus",
    name: "Marcus Webb",
    lastMessage: "Can you send me your notes from lecture 12?",
    lastMessageAt: minutesAgo(48),
    unreadCount: 0,
    online: false,
  },
  {
    id: "dm-lena",
    name: "Lena Ortiz",
    lastMessage: "Thanks for explaining that proof, it finally clicked",
    lastMessageAt: minutesAgo(240),
    unreadCount: 0,
    online: true,
  },
];

export const MOCK_DM_MESSAGES: Record<string, DmMessage[]> = {
  "dm-priya": [
    {
      id: "m1",
      senderId: "them",
      senderName: "Priya Shah",
      content: "Hey! Are you still up for studying tonight?",
      createdAt: minutesAgo(20),
    },
    {
      id: "m2",
      senderId: "me",
      senderName: "You",
      content: "Yes! Library at 7?",
      createdAt: minutesAgo(15),
    },
    {
      id: "m3",
      senderId: "them",
      senderName: "Priya Shah",
      content: "Perfect. I'll grab a room on the 3rd floor.",
      createdAt: minutesAgo(9),
    },
    {
      id: "m4",
      senderId: "them",
      senderName: "Priya Shah",
      content: "Sounds good, see you at the library!",
      createdAt: minutesAgo(6),
    },
  ],
  "dm-marcus": [
    {
      id: "m1",
      senderId: "them",
      senderName: "Marcus Webb",
      content: "Can you send me your notes from lecture 12?",
      createdAt: minutesAgo(48),
    },
  ],
  "dm-lena": [
    {
      id: "m1",
      senderId: "me",
      senderName: "You",
      content: "That induction proof makes way more sense now, thanks!",
      createdAt: minutesAgo(245),
    },
    {
      id: "m2",
      senderId: "them",
      senderName: "Lena Ortiz",
      content: "Thanks for explaining that proof, it finally clicked",
      createdAt: minutesAgo(240),
    },
  ],
};
