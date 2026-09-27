/**
 * Utility for resolving consistent ID Card & Account Profile Pictures across RECON Expo 2026.
 * Guarantees that an attendee's ID Card photo, Account Dashboard profile picture, 
 * and Live Registration Alert notification image are 100% identical.
 * Strictly uses uploaded and snapped camera photos (Data URLs, Blob URLs, or HTTP links).
 * Does NOT generate fake stock face photos.
 */

export function getAttendeeProfilePhoto(
  photoUrl?: string, 
  avatarUrl?: string, 
  _fullName: string = 'Delegate'
): string {
  if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim().length > 0) {
    const trimmed = photoUrl.trim();
    // Allow data URLs (snapped/uploaded), blob URLs, or http/https links
    if (
      trimmed.startsWith('data:') || 
      trimmed.startsWith('blob:') || 
      trimmed.startsWith('http://') || 
      trimmed.startsWith('https://') || 
      trimmed.startsWith('/')
    ) {
      return trimmed;
    }
  }

  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
    const trimmed = avatarUrl.trim();
    if (
      trimmed.startsWith('data:') || 
      trimmed.startsWith('blob:') || 
      trimmed.startsWith('http://') || 
      trimmed.startsWith('https://') || 
      trimmed.startsWith('/')
    ) {
      return trimmed;
    }
  }

  // Return empty string if no snapped or uploaded photo is attached
  return '';
}
