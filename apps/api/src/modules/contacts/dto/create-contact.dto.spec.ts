import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateContactDto } from './create-contact.dto';

describe('CreateContactDto Validation', () => {
  describe('email field', () => {
    it('should accept valid email', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept empty email (optional)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept undefined email (optional)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: undefined,
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid email format', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should reject empty string email (must be valid format or omitted)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
  });

  describe('phone field', () => {
    it('should accept valid phone', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept phone with special characters', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty phone (required)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const phoneError = errors.find((e) => e.property === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should reject missing phone (required)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const phoneError = errors.find((e) => e.property === 'phone');
      expect(phoneError).toBeDefined();
      expect(phoneError?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('subject field', () => {
    it('should accept valid subject', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        subject: 'Question about services',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept empty subject (optional)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept undefined subject (optional)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        subject: undefined,
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('required fields', () => {
    it('should require firstName', async () => {
      const dto = plainToInstance(CreateContactDto, {
        lastName: 'Doe',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const firstNameError = errors.find((e) => e.property === 'firstName');
      expect(firstNameError).toBeDefined();
      expect(firstNameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should require lastName', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        phone: '1234567890',
        message: 'Test message that is long enough',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const lastNameError = errors.find((e) => e.property === 'lastName');
      expect(lastNameError).toBeDefined();
      expect(lastNameError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should require message', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const messageError = errors.find((e) => e.property === 'message');
      expect(messageError).toBeDefined();
      expect(messageError?.constraints).toHaveProperty('isNotEmpty');
    });

    it('should reject message shorter than 10 characters', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        message: 'Short',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const messageError = errors.find((e) => e.property === 'message');
      expect(messageError).toBeDefined();
      expect(messageError?.constraints).toHaveProperty('minLength');
    });
  });

  describe('complete valid submissions', () => {
    it('should accept contact with all fields', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        subject: 'Question about gel manicure',
        message:
          'I would like to know more about your gel manicure services and pricing.',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept contact with only required fields (no email, no subject)', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 987-6543',
        message: 'I would like to know more about your services.',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept contact with email but no subject', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        message: 'I would like to know more about your services.',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should accept contact with subject but no email', async () => {
      const dto = plainToInstance(CreateContactDto, {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 987-6543',
        subject: 'General inquiry',
        message: 'I would like to know more about your services.',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
