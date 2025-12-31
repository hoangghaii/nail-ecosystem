# Phase 2: Mock Data Generation

**Duration**: 45 minutes
**Dependencies**: Phase 1 (Types)
**Risk**: Low

---

## Objectives

1. Generate 15-20 realistic customer contact messages
2. Create single business info record matching client site
3. Distribute contacts across statuses and time periods

---

## Mock Data Strategy

### Distribution Guidelines

**Status Distribution** (20 contacts):

- NEW: 5 contacts (25%) - Recent submissions (last 3 days)
- READ: 4 contacts (20%) - Older submissions (4-10 days)
- RESPONDED: 7 contacts (35%) - Various dates (5-30 days)
- ARCHIVED: 4 contacts (20%) - Oldest submissions (30+ days)

**Time Distribution**:

- Cluster NEW contacts in recent dates
- Spread READ/RESPONDED across mid-range
- Place ARCHIVED in older date range

---

## File 1: Mock Contacts

**File**: `src/data/mockContacts.ts`

```typescript
import type { Contact } from "@/types/contact.types";
import { ContactStatus } from "@/types/contact.types";

export const MOCK_CONTACTS: Contact[] = [
  // NEW STATUS (Recent - last 3 days)
  {
    id: "contact_001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    subject: "Bridal Nail Art Inquiry",
    message:
      "Hi! I'm getting married next month and would love to book a bridal nail art session. Do you offer packages for wedding parties?",
    status: ContactStatus.NEW,
    adminNotes: "",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "contact_002",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@business.com",
    phone: "(555) 234-5678",
    subject: "Corporate Event Booking",
    message:
      "We're hosting a wellness day for our team of 15. Can you accommodate group bookings on weekdays?",
    status: ContactStatus.NEW,
    adminNotes: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "contact_003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rod@mail.com",
    phone: "(555) 345-6789",
    subject: "Gel Manicure Pricing",
    message:
      "What are your prices for gel manicures? Also, do you offer discounts for first-time customers?",
    status: ContactStatus.NEW,
    adminNotes: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_004",
    firstName: "David",
    lastName: "Thompson",
    email: "d.thompson@email.com",
    phone: "(555) 456-7890",
    subject: "Gift Certificate Question",
    message:
      "Do you sell gift certificates? I'd like to buy one for my wife's birthday.",
    status: ContactStatus.NEW,
    adminNotes: "",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "contact_005",
    firstName: "Jessica",
    lastName: "Martinez",
    email: "jess.martinez@email.com",
    phone: "(555) 567-8901",
    subject: "Appointment Cancellation Policy",
    message:
      "What's your cancellation policy? I sometimes have last-minute schedule changes.",
    status: ContactStatus.NEW,
    adminNotes: "",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },

  // READ STATUS (Mid-range - 4-10 days)
  {
    id: "contact_006",
    firstName: "Amanda",
    lastName: "Lee",
    email: "amanda.lee@email.com",
    phone: "(555) 678-9012",
    subject: "Pedicure with Medical Condition",
    message:
      "I have diabetic neuropathy. Do you have experience working with clients with foot sensitivities?",
    status: ContactStatus.READ,
    adminNotes: "Need to follow up with specialist information",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "contact_007",
    firstName: "Brian",
    lastName: "Wilson",
    email: "b.wilson@email.com",
    phone: "(555) 789-0123",
    subject: "Men's Manicure Services",
    message:
      "Do you offer men's manicure services? Looking for a professional grooming experience.",
    status: ContactStatus.READ,
    adminNotes: "",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_008",
    firstName: "Olivia",
    lastName: "Brown",
    email: "olivia.b@email.com",
    phone: "(555) 890-1234",
    subject: "Nail Extension Options",
    message:
      "What types of nail extensions do you offer? I'm interested in acrylic vs gel comparison.",
    status: ContactStatus.READ,
    adminNotes: "",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_009",
    firstName: "Christopher",
    lastName: "Garcia",
    email: "chris.garcia@email.com",
    phone: "(555) 901-2345",
    subject: "Walk-in Availability",
    message: "Do you accept walk-ins or is it strictly by appointment?",
    status: ContactStatus.READ,
    adminNotes: "",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },

  // RESPONDED STATUS (Various dates - 5-30 days)
  {
    id: "contact_010",
    firstName: "Sophia",
    lastName: "Taylor",
    email: "sophia.t@email.com",
    phone: "(555) 012-3456",
    subject: "Custom Nail Art Request",
    message:
      "Can you recreate nail art from a photo? I saw a design I love on Instagram.",
    status: ContactStatus.RESPONDED,
    adminNotes: "Sent portfolio link and confirmed we can recreate designs",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_011",
    firstName: "James",
    lastName: "Anderson",
    email: "j.anderson@email.com",
    phone: "(555) 123-4568",
    subject: "Membership Program",
    message:
      "Do you have a membership or loyalty program for regular customers?",
    status: ContactStatus.RESPONDED,
    adminNotes: "Explained loyalty program details - 10% off after 5 visits",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_012",
    firstName: "Isabella",
    lastName: "Thomas",
    email: "isabella.thomas@email.com",
    phone: "(555) 234-5679",
    subject: "Prenatal Safe Nail Services",
    message:
      "I'm pregnant. Are your products safe during pregnancy? What services do you recommend?",
    status: ContactStatus.RESPONDED,
    adminNotes:
      "Confirmed all products are pregnancy-safe, recommended basic manicure",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_013",
    firstName: "Ethan",
    lastName: "White",
    email: "ethan.w@email.com",
    phone: "(555) 345-6780",
    subject: "Private Event Inquiry",
    message:
      "Can you bring your services to our location for a bachelorette party?",
    status: ContactStatus.RESPONDED,
    adminNotes: "Quoted mobile service pricing, sent contract",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_014",
    firstName: "Mia",
    lastName: "Harris",
    email: "mia.harris@email.com",
    phone: "(555) 456-7891",
    subject: "Nail Repair Service",
    message:
      "I broke a nail and need urgent repair. How quickly can I get an appointment?",
    status: ContactStatus.RESPONDED,
    adminNotes: "Scheduled same-day repair appointment",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // Same day
  },
  {
    id: "contact_015",
    firstName: "Alexander",
    lastName: "Clark",
    email: "alex.clark@email.com",
    phone: "(555) 567-8902",
    subject: "Allergy Concerns",
    message:
      "I have severe chemical sensitivities. Do you offer hypoallergenic nail polish options?",
    status: ContactStatus.RESPONDED,
    adminNotes: "Confirmed hypoallergenic and vegan polish brands available",
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_016",
    firstName: "Charlotte",
    lastName: "Lewis",
    email: "charlotte.l@email.com",
    phone: "(555) 678-9013",
    subject: "Seasonal Nail Design",
    message:
      "Do you have holiday-themed nail art designs? Planning ahead for Christmas!",
    status: ContactStatus.RESPONDED,
    adminNotes: "Sent seasonal catalog and booking link",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
  },

  // ARCHIVED STATUS (Oldest - 30+ days)
  {
    id: "contact_017",
    firstName: "William",
    lastName: "Walker",
    email: "will.walker@email.com",
    phone: "(555) 789-0124",
    subject: "Partnership Opportunity",
    message:
      "I represent a spa looking to partner with nail salons. Can we schedule a call?",
    status: ContactStatus.ARCHIVED,
    adminNotes: "Not interested in partnerships at this time",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    respondedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_018",
    firstName: "Ava",
    lastName: "Hall",
    email: "ava.hall@email.com",
    phone: "(555) 890-1235",
    subject: "Old Inquiry - Pricing",
    message: "What are your current rates for a full set of acrylics?",
    status: ContactStatus.ARCHIVED,
    adminNotes: "Customer never responded to pricing information",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    respondedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_019",
    firstName: "Daniel",
    lastName: "Young",
    email: "dan.young@email.com",
    phone: "(555) 901-2346",
    subject: "Product Sale Inquiry",
    message: "Do you sell nail care products retail?",
    status: ContactStatus.ARCHIVED,
    adminNotes: "Resolved - customer purchased in-store",
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    respondedAt: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000),
  },
  {
    id: "contact_020",
    firstName: "Grace",
    lastName: "King",
    email: "grace.king@email.com",
    phone: "(555) 012-3457",
    subject: "Student Discount",
    message:
      "Do you offer student discounts? I'm a college student looking for affordable nail services.",
    status: ContactStatus.ARCHIVED,
    adminNotes: "Explained student discount policy - 15% off with valid ID",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    respondedAt: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000),
  },
];
```

---

## File 2: Mock Business Info

**File**: `src/data/mockBusinessInfo.ts`

```typescript
import type { BusinessInfo } from "@/types/businessInfo.types";

export const MOCK_BUSINESS_INFO: BusinessInfo = {
  id: "business_info_001",
  phone: "(555) 123-4567",
  email: "hello@pinknail.com",
  address: {
    street: "123 Beauty Lane",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
  },
  businessHours: [
    { day: "Monday", open: "09:00 AM", close: "07:00 PM", closed: false },
    { day: "Tuesday", open: "09:00 AM", close: "07:00 PM", closed: false },
    { day: "Wednesday", open: "09:00 AM", close: "07:00 PM", closed: false },
    { day: "Thursday", open: "09:00 AM", close: "08:00 PM", closed: false },
    { day: "Friday", open: "09:00 AM", close: "08:00 PM", closed: false },
    { day: "Saturday", open: "10:00 AM", close: "06:00 PM", closed: false },
    { day: "Sunday", open: "", close: "", closed: true },
  ],
  updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last updated 30 days ago
};
```

**Notes**:

- Matches client site data exactly (from `/Users/hainguyen/Documents/nail-project/nail-client/src/data/businessInfo.ts`)
- Singleton record with fixed ID
- Sunday marked as closed
- Extended hours Thu-Fri (common nail salon pattern)

---

## Data Quality Checklist

- [ ] 20 contacts total
- [ ] Status distribution: NEW(5), READ(4), RESPONDED(7), ARCHIVED(4)
- [ ] NEW contacts are most recent (1-3 days)
- [ ] ARCHIVED contacts are oldest (30+ days)
- [ ] RESPONDED contacts have respondedAt timestamps
- [ ] Subject lines are realistic and varied
- [ ] Messages contain coherent inquiries
- [ ] Admin notes reflect realistic responses
- [ ] Phone numbers use US format with various styles
- [ ] Email addresses are realistic
- [ ] Business info matches client site exactly

---

## Testing Data Scenarios

**Status Filter Testing**:

- Filter NEW → Should show 5 contacts
- Filter READ → Should show 4 contacts
- Filter RESPONDED → Should show 7 contacts
- Filter ARCHIVED → Should show 4 contacts

**Search Testing**:

- Search "Sarah" → Should find contact_001
- Search "bridal" → Should find contact_001 (subject match)
- Search "pregnancy" → Should find contact_012 (message match)
- Search "555-123-4567" → Should find multiple contacts

**Date Sorting Testing**:

- Sort by date descending → contact_001 should be first
- Sort by date ascending → contact_020 should be first

---

## Files to Create

1. `src/data/mockContacts.ts` - 20 contact messages
2. `src/data/mockBusinessInfo.ts` - Single business info record

---

## Next Phase

**Phase 3: Service Layer** - Implement CRUD services using this mock data
