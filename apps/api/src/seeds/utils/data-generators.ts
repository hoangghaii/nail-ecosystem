// Random selection helper
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Random date within range
export function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// Vietnamese names data
const vietnameseFirstNames = {
  female: [
    'Linh',
    'Mai',
    'Hương',
    'Ngọc',
    'Lan',
    'Thu',
    'Hà',
    'Trang',
    'Anh',
    'Phương',
    'Thảo',
    'My',
    'Hạnh',
    'Nhung',
    'Diệu',
    'Kim',
    'Loan',
    'Quỳnh',
    'Thanh',
    'Trinh',
  ],
  male: [
    'Minh',
    'Nam',
    'Hùng',
    'Tuấn',
    'Dũng',
    'Long',
    'Hải',
    'Khoa',
    'Quang',
    'Phúc',
    'Tài',
    'Bình',
    'Cường',
    'Đức',
    'Hoàng',
    'Khánh',
    'Sơn',
    'Thành',
    'Trung',
    'Vinh',
  ],
};

const vietnameseLastNames = [
  'Nguyễn',
  'Nguyễn',
  'Nguyễn',
  'Nguyễn', // 40% probability
  'Trần',
  'Trần',
  'Trần', // 12% probability
  'Lê',
  'Lê', // 10% probability
  'Phạm',
  'Phạm', // 8% probability
  'Hoàng',
  'Hoàng', // 7% probability
  'Phan',
  'Vũ',
  'Đặng',
  'Bùi',
  'Đỗ',
  'Hồ',
  'Ngô',
  'Dương',
  'Lý',
];

// Vietnamese name generator
export function generateVietnameseName(gender?: 'male' | 'female') {
  const selectedGender = gender || (Math.random() > 0.5 ? 'female' : 'male');
  const firstName = randomItem(vietnameseFirstNames[selectedGender]);
  const lastName = randomItem(vietnameseLastNames);

  return {
    firstName,
    lastName,
  };
}

// Vietnamese phone generator
export function generateVietnamesePhone(): string {
  const prefixes = ['090', '091', '093', '097', '098', '032', '033', '034'];
  const prefix = randomItem(prefixes);
  const suffix = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0');
  return `${prefix}${suffix}`;
}

// Email generator
export function generateEmail(firstName: string, lastName: string): string {
  const domains = [
    'gmail.com',
    'gmail.com',
    'gmail.com', // 50%
    'yahoo.com',
    'yahoo.com', // 20%
    'outlook.com',
    'outlook.com', // 15%
    'icloud.com', // 10%
    'hotmail.com', // 5%
  ];

  // Remove Vietnamese diacritics and special characters
  const cleanFirst = firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  const cleanLast = lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  return `${cleanFirst}.${cleanLast}@${randomItem(domains)}`;
}

// Weighted random selection
export function weightedRandom<T extends { weight: number; value: any }>(
  items: T[],
): T['value'] {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    if (random < item.weight) return item.value;
    random -= item.weight;
  }

  return items[0].value;
}
