import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NailShape, NailShapeSchema } from './schemas/nail-shape.schema';
import { NailStyle, NailStyleSchema } from './schemas/nail-style.schema';
import { NailShapesService } from './nail-shapes.service';
import { NailStylesService } from './nail-styles.service';
import { NailShapesController } from './nail-shapes.controller';
import { NailStylesController } from './nail-styles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NailShape.name, schema: NailShapeSchema },
      { name: NailStyle.name, schema: NailStyleSchema },
    ]),
  ],
  controllers: [NailShapesController, NailStylesController],
  providers: [NailShapesService, NailStylesService],
  exports: [NailShapesService, NailStylesService],
})
export class NailOptionsModule {}
