import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import {
  QueryContactsDto,
  ContactSortField,
  SortOrder,
} from './dto/query-contacts.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = new this.contactModel({
      ...createContactDto,
      status: 'new',
    });
    return contact.save();
  }

  async findAll(query: QueryContactsDto) {
    const {
      status,
      search,
      sortBy = ContactSortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    // Existing filter
    if (status) filter.status = status;

    // Text search implementation
    if (search && search.trim()) {
      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i'); // case-insensitive

      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Dynamic sorting
    const sort: any = {};
    switch (sortBy) {
      case ContactSortField.CREATED_AT:
        sort.createdAt = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      case ContactSortField.STATUS:
        sort.status = sortOrder === SortOrder.DESC ? -1 : 1;
        sort.createdAt = -1; // Secondary sort (newest first)
        break;
      case ContactSortField.FIRST_NAME:
        sort.firstName = sortOrder === SortOrder.DESC ? -1 : 1;
        sort.lastName = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
        break;
      case ContactSortField.LAST_NAME:
        sort.lastName = sortOrder === SortOrder.DESC ? -1 : 1;
        sort.firstName = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
        break;
      default:
        // Fallback to createdAt DESC (current behavior)
        sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.contactModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.contactModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Contact> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid contact ID');
    }

    const contact = await this.contactModel.findById(id).exec();

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async updateStatus(
    id: string,
    updateContactStatusDto: UpdateContactStatusDto,
  ): Promise<Contact> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid contact ID');
    }

    const updateData: any = {
      status: updateContactStatusDto.status,
    };

    if (updateContactStatusDto.adminNotes) {
      updateData.adminNotes = updateContactStatusDto.adminNotes;
    }

    if (updateContactStatusDto.status === 'responded') {
      updateData.respondedAt = new Date();
    }

    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async updateNotes(id: string, adminNotes: string): Promise<Contact> {
    // Validate MongoDB ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid contact ID');
    }

    // Update only adminNotes field
    const contact = await this.contactModel
      .findByIdAndUpdate(
        id,
        { adminNotes },
        { new: true }, // Return updated document
      )
      .exec();

    // Handle not found
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }
}
