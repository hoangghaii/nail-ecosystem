import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { UpdateContactNotesDto } from './dto/update-contact-notes.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Submit a contact inquiry' })
  @ApiResponse({
    status: 201,
    description: 'Contact inquiry successfully submitted',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all contact inquiries with pagination and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of contacts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: QueryContactsDto) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a contact inquiry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update contact inquiry status' })
  @ApiResponse({
    status: 200,
    description: 'Contact status successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateContactStatusDto: UpdateContactStatusDto,
  ) {
    return this.contactsService.updateStatus(id, updateContactStatusDto);
  }

  @Patch(':id/notes')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update contact admin notes' })
  @ApiResponse({
    status: 200,
    description: 'Contact admin notes successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid contact ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateNotes(
    @Param('id') id: string,
    @Body() updateContactNotesDto: UpdateContactNotesDto,
  ) {
    return this.contactsService.updateNotes(
      id,
      updateContactNotesDto.adminNotes,
    );
  }
}
