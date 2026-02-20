import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import { StorageService } from '../storage/storage.service';

const mockGallery = {
  _id: '507f1f77bcf86cd799439011',
  imageUrl: 'https://example.com/image.jpg',
  title: 'Beautiful Nails',
  description: 'Artistic nail design',
  nailShape: 'almond',
  style: 'minimalist',
  price: '$45',
  duration: '60 minutes',
  featured: true,
  isActive: true,
  sortIndex: 1,
};

const mockStorageService = { uploadFile: jest.fn(), deleteFile: jest.fn() };

describe('GalleryService — findAll & findOne', () => {
  let service: GalleryService;
  let model: Model<GalleryDocument>;

  const mockGalleryModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: getModelToken(Gallery.name), useValue: mockGalleryModel },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
    model = module.get<Model<GalleryDocument>>(getModelToken(Gallery.name));
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return paginated gallery items', async () => {
      const query: QueryGalleryDto = { page: 1, limit: 10 };
      const findChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGallery]),
      };
      jest.spyOn(model, 'find').mockReturnValue(findChain as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1 as never);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockGallery],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should filter by nailShape', async () => {
      const query: QueryGalleryDto = { nailShape: 'almond', page: 1, limit: 10 };
      const findChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGallery]),
      };
      jest.spyOn(model, 'find').mockReturnValue(findChain as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1 as never);

      const result = await service.findAll(query);

      expect(model.find).toHaveBeenCalledWith({ nailShape: 'almond' });
      expect(result.data).toHaveLength(1);
    });

    it('should filter by nailStyle (mapped to style field)', async () => {
      const query: QueryGalleryDto = { nailStyle: 'minimalist', page: 1, limit: 10 };
      const findChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGallery]),
      };
      jest.spyOn(model, 'find').mockReturnValue(findChain as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1 as never);

      await service.findAll(query);

      expect(model.find).toHaveBeenCalledWith({ style: 'minimalist' });
    });

    it('should filter by featured status', async () => {
      const query: QueryGalleryDto = { featured: true, page: 1, limit: 10 };
      const findChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGallery]),
      };
      jest.spyOn(model, 'find').mockReturnValue(findChain as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1 as never);

      await service.findAll(query);

      expect(model.find).toHaveBeenCalledWith({ featured: true });
    });

    it('should filter by isActive status', async () => {
      const query: QueryGalleryDto = { isActive: true, page: 1, limit: 10 };
      const findChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGallery]),
      };
      jest.spyOn(model, 'find').mockReturnValue(findChain as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1 as never);

      await service.findAll(query);

      expect(model.find).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('findOne', () => {
    it('should return a gallery item by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockGallery),
        }),
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockGallery);
      expect(model.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
