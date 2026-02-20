# Phase 01 — API: nail-options module

**Date:** 2026-02-19
**Status:** pending
**Priority:** High — blocks all other phases

---

## Overview

Create a new NestJS module `nail-options` that provides CRUD endpoints for `NailShape` and `NailStyle` collections. These replace the hardcoded enums in `create-gallery.dto.ts` and `gallery.schema.ts`.

---

## Key Insights

- Pattern to follow: `gallery-category` module (schema, service, controller, DTOs, module)
- Schema shape: `{ value: string, label: string, labelVi: string, isActive: boolean, sortIndex: number }`
- `value` = the slug used as filter key (e.g., `"almond"`, `"3d"`) — unique, URL-safe
- Two separate MongoDB collections: `nail_shapes` and `nail_styles`
- Single module (`nail-options`) with two sub-resources to keep things clean
- GET endpoints are `@Public()` — no auth needed for client filter loading
- POST/PATCH/DELETE require JWT auth (admin only)

---

## Files to Create

```
apps/api/src/modules/nail-options/
├── schemas/
│   ├── nail-shape.schema.ts          [CREATE]
│   └── nail-style.schema.ts          [CREATE]
├── dto/
│   ├── create-nail-option.dto.ts     [CREATE]  (shared DTO for both shapes+styles)
│   ├── update-nail-option.dto.ts     [CREATE]
│   └── query-nail-option.dto.ts      [CREATE]
├── nail-shapes.controller.ts         [CREATE]
├── nail-styles.controller.ts         [CREATE]
├── nail-shapes.service.ts            [CREATE]
├── nail-styles.service.ts            [CREATE]
└── nail-options.module.ts            [CREATE]
```

---

## Files to Modify

- `apps/api/src/app.module.ts` — import `NailOptionsModule`
- `apps/api/src/seeds/seed.module.ts` — add NailShape/NailStyle models for seeder
- `apps/api/src/seeds/seeders/gallery.seeder.ts` — seed initial nail shapes + styles

---

## Implementation Steps

### Step 1: Create NailShape schema

File: `apps/api/src/modules/nail-options/schemas/nail-shape.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type NailShapeDocument = HydratedDocument<NailShape>;

@Schema({ timestamps: true, collection: 'nail_shapes' })
export class NailShape extends Document {
  @Prop({ required: true, unique: true })
  value: string; // URL-safe slug, e.g. "almond"

  @Prop({ required: true })
  label: string; // English label, e.g. "Almond"

  @Prop({ required: true })
  labelVi: string; // Vietnamese label, e.g. "Móng Hạnh Nhân"

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortIndex: number;
}

export const NailShapeSchema = SchemaFactory.createForClass(NailShape);
NailShapeSchema.index({ value: 1 }, { unique: true });
NailShapeSchema.index({ isActive: 1, sortIndex: 1 });
```

### Step 2: Create NailStyle schema

File: `apps/api/src/modules/nail-options/schemas/nail-style.schema.ts`

Same structure as NailShape but with `collection: 'nail_styles'` and class name `NailStyle`.

### Step 3: Create shared DTO

File: `apps/api/src/modules/nail-options/dto/create-nail-option.dto.ts`

```typescript
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNailOptionDto {
  @ApiProperty({ example: 'almond' })
  @IsString() @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'Almond' })
  @IsString() @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Móng Hạnh Nhân' })
  @IsString() @IsNotEmpty()
  labelVi: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean() @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber() @IsOptional()
  sortIndex?: number;
}
```

File: `apps/api/src/modules/nail-options/dto/update-nail-option.dto.ts`

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateNailOptionDto } from './create-nail-option.dto';
export class UpdateNailOptionDto extends PartialType(CreateNailOptionDto) {}
```

File: `apps/api/src/modules/nail-options/dto/query-nail-option.dto.ts`

```typescript
export class QueryNailOptionDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean()
  isActive?: boolean;
}
```

### Step 4: Create NailOptionsService (base logic, reused by both services)

Create a generic service factory or two separate services that share the same CRUD pattern. Prefer two separate services (one per model) for clarity — follow `gallery-category.service.ts` pattern exactly.

File: `apps/api/src/modules/nail-options/nail-shapes.service.ts`

```typescript
@Injectable()
export class NailShapesService {
  constructor(
    @InjectModel(NailShape.name)
    private readonly model: Model<NailShapeDocument>,
  ) {}

  async findAll(query: QueryNailOptionDto) { ... }
  async findOne(id: string) { ... }
  async create(dto: CreateNailOptionDto) { ... }    // check unique value
  async update(id: string, dto: UpdateNailOptionDto) { ... }
  async remove(id: string) { ... }
}
```

Same pattern for `nail-styles.service.ts`.

### Step 5: Create controllers

File: `apps/api/src/modules/nail-options/nail-shapes.controller.ts`

```
@ApiTags('Nail Shapes')
@Controller('nail-shapes')
```

Endpoints:
- `GET /nail-shapes` — `@Public()`, returns all shapes (optional `?isActive=true`)
- `POST /nail-shapes` — `@ApiBearerAuth`, create
- `PATCH /nail-shapes/:id` — `@ApiBearerAuth`, update
- `DELETE /nail-shapes/:id` — `@ApiBearerAuth`, `@HttpCode(204)`, delete

Same pattern for `nail-styles.controller.ts` at `/nail-styles`.

### Step 6: Create module

File: `apps/api/src/modules/nail-options/nail-options.module.ts`

```typescript
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
```

### Step 7: Register in AppModule

File: `apps/api/src/app.module.ts`

Add import:
```typescript
import { NailOptionsModule } from './modules/nail-options/nail-options.module';
// ...in imports array:
NailOptionsModule,
```

### Step 8: Seed initial data

Update `apps/api/src/seeds/seeders/gallery.seeder.ts` — add `seedNailOptions()` method:

Seed data for NailShapes:
```
{ value: 'almond',   label: 'Almond',   labelVi: 'Móng Hạnh Nhân', sortIndex: 0 }
{ value: 'coffin',   label: 'Coffin',   labelVi: 'Móng Quan Tài',  sortIndex: 1 }
{ value: 'square',   label: 'Square',   labelVi: 'Móng Vuông',     sortIndex: 2 }
{ value: 'stiletto', label: 'Stiletto', labelVi: 'Móng Nhọn',      sortIndex: 3 }
```

Seed data for NailStyles:
```
{ value: '3d',     label: '3D Art',     labelVi: 'Vẽ 3D',       sortIndex: 0 }
{ value: 'mirror', label: 'Mirror',     labelVi: 'Tráng Gương',  sortIndex: 1 }
{ value: 'gem',    label: 'Gem',        labelVi: 'Đính Đá',      sortIndex: 2 }
{ value: 'ombre',  label: 'Ombre',      labelVi: 'Ombre',        sortIndex: 3 }
```

Inject `NailShape` and `NailStyle` models into `GallerySeeder`.

---

## Todo List

- [ ] Create `nail-shape.schema.ts`
- [ ] Create `nail-style.schema.ts`
- [ ] Create `create-nail-option.dto.ts`
- [ ] Create `update-nail-option.dto.ts`
- [ ] Create `query-nail-option.dto.ts`
- [ ] Create `nail-shapes.service.ts`
- [ ] Create `nail-styles.service.ts`
- [ ] Create `nail-shapes.controller.ts`
- [ ] Create `nail-styles.controller.ts`
- [ ] Create `nail-options.module.ts`
- [ ] Register `NailOptionsModule` in `app.module.ts`
- [ ] Update seeder with nail shapes + styles data
- [ ] Verify `GET /nail-shapes` and `GET /nail-styles` work without auth

---

## Success Criteria

- `GET /nail-shapes` returns `{ data: [...], pagination: {...} }` (no auth)
- `POST /nail-shapes` creates shape (requires JWT)
- `PATCH /nail-shapes/:id` updates shape (requires JWT)
- `DELETE /nail-shapes/:id` deletes shape (requires JWT)
- Same for `/nail-styles`
- Seed creates 4 shapes + 4 styles on first run, skips on subsequent runs

---

## Risk Assessment

- `value` uniqueness: enforce at DB index level + catch 11000 error (same as gallery-category)
- File size: keep each file under 200 lines per code-standards.md
- NestJS circular dependency: NailOptionsModule exports both services; no circular deps expected
