const AVATAR_COLORS = ["bg-avatar-1", "bg-avatar-2", "bg-avatar-3", "bg-avatar-4", "bg-avatar-5"];

// Known collisions from the hash below landing two distinct current ids on the
// same palette slot. "dm-lena" hashes to the same bg-avatar-5 (rose) slot as
// "dm-marcus"; override it to bg-avatar-3 (purple) so they stay distinct
// without shifting any other id's color.
const COLOR_OVERRIDES: Record<string, string> = {
  "dm-lena": "bg-avatar-3",
};

export function avatarColorFor(id: string) {
  if (id in COLOR_OVERRIDES) return COLOR_OVERRIDES[id];
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}
