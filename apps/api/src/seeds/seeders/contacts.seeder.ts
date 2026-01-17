import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../../modules/contacts/schemas/contact.schema';
import {
  randomItem,
  randomDate,
  generateVietnameseName,
  generateVietnamesePhone,
  generateEmail,
  weightedRandom,
} from '../utils/data-generators';

@Injectable()
export class ContactsSeeder {
  private readonly logger = new Logger(ContactsSeeder.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  async seed(count: number = 40): Promise<Contact[]> {
    this.logger.log('Seeding contacts...');

    const contacts: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
      status: string;
      createdAt: Date;
      adminNotes?: string;
      respondedAt?: Date;
    }> = [];
    const now = new Date();
    const pastDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago

    const statuses = [
      { weight: 8, value: 'new' }, // 20%
      { weight: 10, value: 'read' }, // 25%
      { weight: 16, value: 'responded' }, // 40%
      { weight: 6, value: 'archived' }, // 15%
    ];

    const subjects = [
      {
        category: 'booking',
        templates: [
          'Booking inquiry for next week',
          'Can I book for a group of 5?',
          'Last minute appointment availability?',
          'Reschedule my appointment',
        ],
      },
      {
        category: 'service',
        templates: [
          'Do you offer acrylic removal?',
          "What's included in the spa pedicure?",
          'Do you have nail art options?',
          'Information about gel polish',
        ],
      },
      {
        category: 'pricing',
        templates: [
          'Pricing for wedding party group',
          'Do you offer package deals?',
          'Cost for full set with nail art?',
          'Student discount availability?',
        ],
      },
      {
        category: 'complaint',
        templates: [
          'Issue with recent service',
          'Product allergy concern',
          'Feedback about my visit',
          'Request for service improvement',
        ],
      },
      {
        category: 'general',
        templates: [
          'What are your business hours?',
          'Parking information needed',
          'Do you accept walk-ins?',
          'Gift certificate inquiry',
        ],
      },
    ];

    for (let i = 0; i < count; i++) {
      const { firstName, lastName } = generateVietnameseName();
      const status = weightedRandom(statuses);
      const createdAt = randomDate(pastDate, now);

      const subjectCategory = randomItem(subjects);
      const subject = randomItem(subjectCategory.templates);
      const message = this.generateMessage(subjectCategory.category);

      const contact: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
        status: string;
        createdAt: Date;
        adminNotes?: string;
        respondedAt?: Date;
      } = {
        firstName,
        lastName,
        email: generateEmail(firstName, lastName),
        phone: Math.random() > 0.3 ? generateVietnamesePhone() : undefined, // 70% include phone
        subject,
        message,
        status,
        createdAt,
      };

      // Add admin response for responded/archived
      if (status === 'responded' || status === 'archived') {
        contact.adminNotes = this.generateAdminNotes(subjectCategory.category);
        contact.respondedAt = new Date(
          createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000,
        ); // 0-2 days after
      }

      contacts.push(contact);
    }

    const created = await this.contactModel.insertMany(contacts);
    this.logger.log(`✅ Created ${created.length} contacts`);
    return created;
  }

  private generateMessage(category: string): string {
    const messages = {
      booking: [
        "Hi, I'm interested in booking a gel manicure for next Saturday. Do you have availability around 2pm? Thanks!",
        "Hello! I'd like to schedule appointments for my bridal party - 6 people total. We're looking at the spa pedicure package. Can you accommodate us on March 15th?",
        'I need to reschedule my appointment from tomorrow to next week. Same service, just different day. Please let me know available times.',
      ],
      service: [
        "I'm curious about your acrylic removal service. How long does it take and what's the cost? I had acrylics done elsewhere and want them safely removed.",
        "Can you tell me more about what's included in the deluxe spa pedicure? I'm treating myself and want the full experience!",
        'Do you offer custom nail art? I have a specific design in mind from Pinterest. How much would that cost?',
      ],
      pricing: [
        "I'm planning my wedding and need services for 8 bridesmaids. What kind of group discount or package can you offer? The wedding is in two months.",
        "Do you have any special packages or deals? I'm interested in regular monthly manicures and wondering if there's a membership option.",
        "What's the price range for a full set with some simple nail art? Just trying to budget for my monthly nail appointment.",
      ],
      complaint: [
        'I visited last week and had some concerns about my service. The gel polish started chipping after just 3 days. Can we discuss this?',
        'I think I had an allergic reaction to one of the products used during my pedicure. My skin is still irritated. What products do you use?',
        'I wanted to provide feedback about my recent visit. The service was good but the wait time was much longer than expected.',
      ],
      general: [
        'What are your current hours? I saw different information on Google and your website. Also, do you accept walk-ins?',
        "Is there parking available nearby? I'll be coming from out of town and not familiar with the area.",
        "Do you sell gift certificates? I'd love to get one for my mom's birthday. Can I purchase online or do I need to come in?",
      ],
    };

    return randomItem(messages[category] || messages.general);
  }

  private generateAdminNotes(category: string): string {
    const notes = {
      booking: [
        'Confirmed booking for Saturday at 2pm. Sent confirmation email.',
        'Booked group appointment for bridal party. Assigned 3 technicians.',
        'Rescheduled to next Tuesday at 3pm. Updated calendar.',
      ],
      service: [
        'Explained removal process and pricing. Customer scheduled appointment.',
        'Sent detailed info about spa pedicure package. Customer very interested.',
        'Discussed nail art options and pricing. Scheduled consultation.',
      ],
      pricing: [
        'Provided group discount quote for wedding party. Awaiting confirmation.',
        'Explained loyalty program and monthly package options.',
        'Sent pricing breakdown via email. Customer satisfied.',
      ],
      complaint: [
        'Apologized and offered free gel removal and redo. Customer accepted.',
        'Checked products list with customer. Switching to hypoallergenic line.',
        'Acknowledged feedback. Implementing changes to booking system.',
      ],
      general: [
        'Clarified business hours and walk-in policy. Updated Google listing.',
        'Provided parking info and directions. Customer thanked us.',
        'Gift certificate purchased and sent via email.',
      ],
    };

    return randomItem(notes[category] || notes.general);
  }
}
