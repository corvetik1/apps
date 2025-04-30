// libs/shared/src/lib/utils/mapping/tender.mapper.ts
import { Injectable } from '@nestjs/common';
import { Tender, TenderResponseDto, TenderStatus } from '../../types/tender';
import { BaseMapper } from './base.mapper';

@Injectable()
export class TenderMapper extends BaseMapper<Tender, TenderResponseDto> {
  toDto(entity: Tender): TenderResponseDto {
    // Поскольку TenderResponseDto полностью включает Tender и добавляет только необязательное поле,
    // можно просто вернуть копию entity, приведя её к типу TenderResponseDto.
    // Дополнительные поля DTO, если они появятся и потребуют логики, можно будет добавить здесь.
    const dto: TenderResponseDto = {
      ...entity,
      // Убедимся, что статус является строкой из enum, а не потенциально любым string
      status: entity.status as TenderStatus,
      _responseType: 'tender', // Добавляем опциональное поле для примера
    };
    return dto;
  }

  toEntity(dto: TenderResponseDto): Tender {
    // Обратное преобразование также простое, так как DTO содержит все поля entity.
    // Убираем специфичные для DTO поля (_responseType).
    const { _responseType, ...entityData } = dto;
    // Можно добавить валидацию или обработку дат при необходимости
    const entity: Tender = {
      ...entityData,
      // Убедимся, что статус является строкой из enum, а не потенциально любым string
      status: entityData.status as TenderStatus,
    };
    return entity;
  }

  // Позже можно добавить методы для CreateTenderDto и UpdateTenderDto, если потребуется
  // toEntityFromCreateDto(createDto: CreateTenderDto): Tender { ... }
  // patchEntity(entity: Tender, updateDto: UpdateTenderDto): Tender { ... }
}
