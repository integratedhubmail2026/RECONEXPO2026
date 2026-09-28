export const getInitials = (name: string): string => {
  if (!name) return 'RC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarGradient = (name: string): string => {
  const gradients = [
    'from-emerald-500 to-teal-800',
    'from-amber-400 to-amber-700',
    'from-cyan-500 to-blue-800',
    'from-emerald-400 to-green-700',
    'from-teal-400 to-emerald-900',
    'from-yellow-400 to-orange-700'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};
