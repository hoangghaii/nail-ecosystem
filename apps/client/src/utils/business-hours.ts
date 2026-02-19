/**
 * Business Hours Utility
 *
 * Real-time open/closed status calculation
 * Hours: 9:00 AM - 8:00 PM, Mon–Sat (closed Sunday)
 */

export function isBusinessOpen(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Closed on Sundays
  if (day === 0) return false;

  // Open 9 AM - 8 PM (Mon–Sat)
  return hours >= 9 && hours < 20;
}

export function getBusinessStatus(): { isOpen: boolean; message: string } {
  const isOpen = isBusinessOpen();
  return {
    isOpen,
    message: isOpen ? "Đang Mở Cửa" : "Đã Đóng Cửa",
  };
}
