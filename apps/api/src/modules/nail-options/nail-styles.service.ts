import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NailStyle, NailStyleDocument } from './schemas/nail-style.schema';
import { CreateNailOptionDto } from './dto/create-nail-option.dto';
import { UpdateNailOptionDto } from './dto/update-nail-option.dto';
import { QueryNailOptionDto } from './dto/query-nail-option.dto';

@Injectable()
export class NailStylesService {
  constructor(
    @InjectModel(NailStyle.name)
    private readonly model: Model<NailStyleDocument>,
  ) {}

  async findAll(query: QueryNailOptionDto) {
    const filter: any = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const data = await this.model
      .find(filter)
      .sort({ sortIndex: 1, createdAt: 1 })
      .exec();

    return { data };
  }

  async findOne(id: string): Promise<NailStyle> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid nail style ID');
    }
    const item = await this.model.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Nail style with ID ${id} not found`);
    }
    return item;
  }

  async create(dto: CreateNailOptionDto): Promise<NailStyle> {
    try {
      const item = new this.model(dto);
      return await item.save();
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException(
          `Nail style with value "${dto.value}" already exists`,
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateNailOptionDto): Promise<NailStyle> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid nail style ID');
    }
    try {
      const item = await this.model
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
      if (!item) {
        throw new NotFoundException(`Nail style with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new ConflictException(
          `Nail style with this value already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid nail style ID');
    }
    const item = await this.model.findByIdAndDelete(id).exec();
    if (!item) {
      throw new NotFoundException(`Nail style with ID ${id} not found`);
    }
  }
}
