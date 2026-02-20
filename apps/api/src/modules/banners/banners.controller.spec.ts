import { Test, TestingModule } from '@nestjs/testing';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { BannerType } from './dto/create-banner.dto';
import { StorageService } from '../storage/storage.service';

describe('BannersController', () => {
  let controller: BannersController;
  let service: BannersService;

  const mockBannersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersController],
      providers: [
        {
          provide: BannersService,
          useValue: mockBannersService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<BannersController>(BannersController);
    service = module.get<BannersService>(BannersService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a banner with image only', async () => {
      const files = {
        image: [
          {
            mimetype: 'image/jpeg',
            size: 5 * 1024 * 1024,
          } as Express.Multer.File,
        ],
      };
      const uploadBannerDto = {
        title: 'Test Banner',
        type: BannerType.IMAGE,
      };
      const result = { id: '1', ...uploadBannerDto, imageUrl: 'image-url' };

      mockStorageService.uploadFile.mockResolvedValue('image-url');
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(files, uploadBannerDto as any)).toBe(
        result,
      );
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(
        files.image[0],
        'banners',
      );
    });

    it('should create a banner with image and video', async () => {
      const files = {
        image: [
          {
            mimetype: 'image/jpeg',
            size: 5 * 1024 * 1024,
          } as Express.Multer.File,
        ],
        video: [
          {
            mimetype: 'video/mp4',
            size: 50 * 1024 * 1024,
          } as Express.Multer.File,
        ],
      };
      const uploadBannerDto = {
        title: 'Test Banner',
        type: BannerType.VIDEO,
      };
      const result = {
        id: '1',
        ...uploadBannerDto,
        imageUrl: 'image-url',
        videoUrl: 'video-url',
      };

      mockStorageService.uploadFile
        .mockResolvedValueOnce('image-url')
        .mockResolvedValueOnce('video-url');
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(files, uploadBannerDto as any)).toBe(
        result,
      );
      expect(mockStorageService.uploadFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return all banners', async () => {
      const result = { data: [], pagination: {} };
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll({})).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single banner', async () => {
      const result = { id: '1', title: 'Test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a banner', async () => {
      const updateDto = { title: 'Updated' };
      const result = { id: '1', ...updateDto };

      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('1', updateDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a banner', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
    });
  });
});
