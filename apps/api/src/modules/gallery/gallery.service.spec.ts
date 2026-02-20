import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
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

describe('GalleryService — create, update & remove', () => {
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

  const mockStorageService = { uploadFile: jest.fn(), deleteFile: jest.fn() };

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a gallery item', async () => {
      const createDto: CreateGalleryDto = {
        imageUrl: 'https://example.com/new-image.jpg',
        title: 'Elegant Design',
        description: 'French manicure',
        nailShape: 'square',
        style: 'minimalist',
        price: '$45',
        duration: '60 minutes',
      };

      const savedGallery = { ...createDto, _id: '507f1f77bcf86cd799439012' };
      const saveMock = jest.fn().mockResolvedValue(savedGallery);
      const mockInstance = { save: saveMock };

      const mockConstructor: any = function (_dto: any) {
        return mockInstance;
      };
      mockConstructor.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(savedGallery),
        }),
      });

      (service as any).galleryModel = mockConstructor;

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a gallery item successfully', async () => {
      const updateDto: UpdateGalleryDto = { title: 'Updated Title' };
      const updatedGallery = { ...mockGallery, ...updateDto };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedGallery),
        }),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(result).toEqual(updatedGallery);
    });

    it('should throw NotFoundException if gallery item not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a gallery item successfully', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGallery),
      } as any);
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockGallery),
      } as any);

      await service.remove('507f1f77bcf86cd799439011');

      expect(model.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if gallery item not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
});
