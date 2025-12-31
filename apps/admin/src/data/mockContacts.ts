import type { Contact } from "@/types/contact.types";

import { ContactStatus } from "@/types/contact.types";

// Helper to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const mockContacts: Contact[] = [
  // NEW status - recent messages (last 2 days)
  {
    adminNotes: undefined,
    createdAt: daysAgo(0),
    email: "sarah.johnson@email.com",
    firstName: "Sarah",
    id: "contact-001",
    lastName: "Johnson",
    message:
      "Hi! I'm interested in booking a gel manicure and pedicure combo for next Saturday. Do you have availability around 2 PM? Also, what's your cancellation policy?",
    phone: "+1 (555) 123-4567",
    respondedAt: undefined,
    status: ContactStatus.NEW,
    subject: "Booking Inquiry for Gel Combo",
  },
  {
    adminNotes: undefined,
    createdAt: daysAgo(1),
    email: "michael.chen@gmail.com",
    firstName: "Michael",
    id: "contact-002",
    lastName: "Chen",
    message:
      "I saw your beautiful nail art designs on social media! Can you do custom designs? I'm looking for something unique for my wedding in 3 weeks.",
    phone: "555-234-5678",
    respondedAt: undefined,
    status: ContactStatus.NEW,
    subject: "Custom Nail Art for Wedding",
  },
  {
    adminNotes: undefined,
    createdAt: daysAgo(1),
    email: "jennifer.martinez@yahoo.com",
    firstName: "Jennifer",
    id: "contact-003",
    lastName: "Martinez",
    message:
      "Do you offer gift certificates? I'd like to purchase a $100 gift card for my mom's birthday. Can I do this online or do I need to visit in person?",
    phone: undefined,
    respondedAt: undefined,
    status: ContactStatus.NEW,
    subject: "Gift Certificate Purchase",
  },

  // READ status - messages opened but not responded (3-5 days ago)
  {
    adminNotes: "Check availability with Emily before responding",
    createdAt: daysAgo(3),
    email: "amanda.lee@outlook.com",
    firstName: "Amanda",
    id: "contact-004",
    lastName: "Lee",
    message:
      "I'm planning a bridal party for 8 people on June 15th. We'd need manicures and pedicures for everyone. Can you accommodate a group this size? What would be the pricing?",
    phone: "+1-555-345-6789",
    respondedAt: undefined,
    status: ContactStatus.READ,
    subject: "Bridal Party Group Booking",
  },
  {
    adminNotes: undefined,
    createdAt: daysAgo(4),
    email: "robert.wilson@email.com",
    firstName: "Robert",
    id: "contact-005",
    lastName: "Wilson",
    message:
      "I've been a regular customer for years and love your service! I was wondering if you offer any loyalty programs or membership discounts?",
    phone: "555.456.7890",
    respondedAt: undefined,
    status: ContactStatus.READ,
    subject: "Loyalty Program Inquiry",
  },
  {
    adminNotes: "Price list needs to be updated on website",
    createdAt: daysAgo(5),
    email: "lisa.thompson@gmail.com",
    firstName: "Lisa",
    id: "contact-006",
    lastName: "Thompson",
    message:
      "Hello! I noticed the prices on your website might be outdated. Could you send me the current pricing for acrylic full sets and gel manicures?",
    phone: undefined,
    respondedAt: undefined,
    status: ContactStatus.READ,
    subject: "Current Pricing Information",
  },

  // RESPONDED status - messages with responses (1-3 weeks ago)
  {
    adminNotes: "Sent her our nail care guide and product recommendations",
    createdAt: daysAgo(7),
    email: "emily.davis@yahoo.com",
    firstName: "Emily",
    id: "contact-007",
    lastName: "Davis",
    message:
      "My nails have been very brittle lately and keep breaking. Do you have any strengthening treatments or recommendations for nail care at home?",
    phone: "+1 555-567-8901",
    respondedAt: daysAgo(7),
    status: ContactStatus.RESPONDED,
    subject: "Nail Strengthening Treatment",
  },
  {
    adminNotes:
      "Explained our sterilization process and provided certificate info",
    createdAt: daysAgo(10),
    email: "david.brown@email.com",
    firstName: "David",
    id: "contact-008",
    lastName: "Brown",
    message:
      "I'm very concerned about hygiene and sterilization practices. Can you tell me more about your sanitization procedures and how often tools are sterilized?",
    phone: "555-678-9012",
    respondedAt: daysAgo(9),
    status: ContactStatus.RESPONDED,
    subject: "Hygiene and Sanitization Inquiry",
  },
  {
    adminNotes:
      "Scheduled her for Thursday 3 PM with Maria. Confirmed via email and text.",
    createdAt: daysAgo(12),
    email: "jessica.garcia@gmail.com",
    firstName: "Jessica",
    id: "contact-009",
    lastName: "Garcia",
    message:
      "I'd like to book my first pedicure with you. I've heard great things! I'm available Thursday or Friday afternoons. Also, I have sensitive skin - do you use hypoallergenic products?",
    phone: "+1 (555) 789-0123",
    respondedAt: daysAgo(12),
    status: ContactStatus.RESPONDED,
    subject: "First Time Pedicure Booking",
  },
  {
    adminNotes: "Provided parking map and street parking tips",
    createdAt: daysAgo(14),
    email: "thomas.anderson@outlook.com",
    firstName: "Thomas",
    id: "contact-010",
    lastName: "Anderson",
    message:
      "I have an appointment next Tuesday but I'm not familiar with the area. Is there parking available nearby? Street parking or a lot?",
    phone: undefined,
    respondedAt: daysAgo(13),
    status: ContactStatus.RESPONDED,
    subject: "Parking Information",
  },
  {
    adminNotes: "Sent portfolio of nail art examples and pricing tiers",
    createdAt: daysAgo(16),
    email: "nicole.white@email.com",
    firstName: "Nicole",
    id: "contact-011",
    lastName: "White",
    message:
      "I'm interested in intricate nail art designs. Do your technicians do hand-painted art? I'd love to see examples of previous work if possible.",
    phone: "555-890-1234",
    respondedAt: daysAgo(15),
    status: ContactStatus.RESPONDED,
    subject: "Hand-Painted Nail Art Samples",
  },
  {
    adminNotes: "Booked for gel removal + new gel manicure next Monday 11 AM",
    createdAt: daysAgo(18),
    email: "karen.miller@yahoo.com",
    firstName: "Karen",
    id: "contact-012",
    lastName: "Miller",
    message:
      "I got gel nails done elsewhere and they're starting to lift. Can you remove them and do a new set? How much do you charge for gel removal?",
    phone: "+1-555-901-2345",
    respondedAt: daysAgo(17),
    status: ContactStatus.RESPONDED,
    subject: "Gel Nail Removal and New Set",
  },

  // ARCHIVED status - old resolved messages (1+ month ago)
  {
    adminNotes: "Group booking completed successfully. Left 5-star review!",
    createdAt: daysAgo(35),
    email: "rachel.green@gmail.com",
    firstName: "Rachel",
    id: "contact-013",
    lastName: "Green",
    message:
      "I'm organizing a girls' day out for my book club (6 people). Can we book a group appointment for spa pedicures on Saturday, March 2nd?",
    phone: "555-012-3456",
    respondedAt: daysAgo(34),
    status: ContactStatus.ARCHIVED,
    subject: "Book Club Group Spa Day",
  },
  {
    adminNotes: "Student discount policy sent. She became a regular customer!",
    createdAt: daysAgo(42),
    email: "sophia.rodriguez@edu.com",
    firstName: "Sophia",
    id: "contact-014",
    lastName: "Rodriguez",
    message:
      "I'm a college student and I love your salon! Do you offer any student discounts? I'd love to come more often if there's a special rate.",
    phone: undefined,
    respondedAt: daysAgo(41),
    status: ContactStatus.ARCHIVED,
    subject: "Student Discount Availability",
  },
  {
    adminNotes: "Rescheduled to May 10th, completed successfully",
    createdAt: daysAgo(50),
    email: "patricia.taylor@outlook.com",
    firstName: "Patricia",
    id: "contact-015",
    lastName: "Taylor",
    message:
      "I need to reschedule my appointment from May 3rd to the following week. Is May 10th available? Same time if possible (2:30 PM). Thanks!",
    phone: "+1 (555) 123-4567",
    respondedAt: daysAgo(50),
    status: ContactStatus.ARCHIVED,
    subject: "Appointment Rescheduling Request",
  },
  {
    adminNotes:
      "Product allergy noted in customer file. Always uses sensitive line.",
    createdAt: daysAgo(60),
    email: "elizabeth.harris@email.com",
    firstName: "Elizabeth",
    id: "contact-016",
    lastName: "Harris",
    message:
      "I have allergies to certain nail polish ingredients (specifically formaldehyde and toluene). Do you carry products free of these chemicals?",
    phone: "555-234-5678",
    respondedAt: daysAgo(59),
    status: ContactStatus.ARCHIVED,
    subject: "Allergy-Friendly Product Options",
  },
  {
    adminNotes: "Added to weekly newsletter list. Sent welcome email.",
    createdAt: daysAgo(70),
    email: "christopher.clark@gmail.com",
    firstName: "Christopher",
    id: "contact-017",
    lastName: "Clark",
    message:
      "Do you have a newsletter or email list for promotions and new services? I'd love to stay updated on special offers!",
    phone: undefined,
    respondedAt: daysAgo(69),
    status: ContactStatus.ARCHIVED,
    subject: "Newsletter Subscription",
  },
  {
    adminNotes: "Referred to website FAQ section and services page",
    createdAt: daysAgo(80),
    email: "stephanie.lewis@yahoo.com",
    firstName: "Stephanie",
    id: "contact-018",
    lastName: "Lewis",
    message:
      "I'm new to the area and looking for a good nail salon. What services do you offer and what are your hours? Do you take walk-ins or appointment only?",
    phone: "555-345-6789",
    respondedAt: daysAgo(79),
    status: ContactStatus.ARCHIVED,
    subject: "General Information for New Customer",
  },
  {
    adminNotes: "Provided gift card in good faith. Customer very satisfied.",
    createdAt: daysAgo(90),
    email: "daniel.walker@email.com",
    firstName: "Daniel",
    id: "contact-019",
    lastName: "Walker",
    message:
      "I had an appointment last week and there was a mix-up with my booking. I'd like to discuss this with a manager to resolve the issue. Thank you.",
    phone: "+1-555-456-7890",
    respondedAt: daysAgo(89),
    status: ContactStatus.ARCHIVED,
    subject: "Booking Issue Resolution",
  },
  {
    adminNotes: "Career inquiry - not hiring at the time. Kept resume on file.",
    createdAt: daysAgo(100),
    email: "michelle.young@outlook.com",
    firstName: "Michelle",
    id: "contact-020",
    lastName: "Young",
    message:
      "I'm a licensed nail technician with 5 years of experience. Are you currently hiring? I'd love to join your team! I can provide my resume and portfolio.",
    phone: "555-567-8901",
    respondedAt: daysAgo(99),
    status: ContactStatus.ARCHIVED,
    subject: "Employment Opportunity Inquiry",
  },
];
