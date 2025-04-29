import { describe, it, expect } from '@jest/globals';
import {
  NoteType,
  NotePriority,
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  NoteResponseDto,
} from '../note';

describe('Note типы', () => {
  describe('NoteType enum', () => {
    it('должен содержать все необходимые типы заметок', () => {
      expect(NoteType.General).toBe('general');
      expect(NoteType.Task).toBe('task');
      expect(NoteType.Reminder).toBe('reminder');
      expect(NoteType.Idea).toBe('idea');
      expect(NoteType.Financial).toBe('financial');
    });
  });

  describe('NotePriority enum', () => {
    it('должен содержать все необходимые приоритеты заметок', () => {
      expect(NotePriority.Low).toBe('low');
      expect(NotePriority.Medium).toBe('medium');
      expect(NotePriority.High).toBe('high');
      expect(NotePriority.Urgent).toBe('urgent');
    });
  });

  describe('Note интерфейс', () => {
    it('должен позволять создавать корректные объекты заметки', () => {
      const note: Note = {
        id: '1',
        userId: 'user1',
        title: 'Важная встреча',
        content: 'Встреча с банком по вопросу кредита',
        type: NoteType.Reminder,
        priority: NotePriority.High,
        isCompleted: false,
        dueDate: '2023-02-15T10:00:00Z',
        color: '#FF5733',
        entityId: 'loan1',
        entityType: 'loan',
        tags: ['встреча', 'банк', 'кредит'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(note.id).toBe('1');
      expect(note.userId).toBe('user1');
      expect(note.title).toBe('Важная встреча');
      expect(note.content).toBe('Встреча с банком по вопросу кредита');
      expect(note.type).toBe(NoteType.Reminder);
      expect(note.priority).toBe(NotePriority.High);
      expect(note.isCompleted).toBe(false);
      expect(note.dueDate).toBe('2023-02-15T10:00:00Z');
      expect(note.color).toBe('#FF5733');
      expect(note.entityId).toBe('loan1');
      expect(note.entityType).toBe('loan');
      expect(note.tags).toEqual(['встреча', 'банк', 'кредит']);
      expect(note.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(note.updatedAt).toBe('2023-01-01T00:00:00Z');
    });

    it('должен позволять создавать заметки с опциональными полями', () => {
      const note: Note = {
        id: '1',
        userId: 'user1',
        title: 'Идея для бизнеса',
        content: 'Разработать приложение для учета финансов',
        type: NoteType.Idea,
        priority: NotePriority.Medium,
        isCompleted: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(note.id).toBe('1');
      expect(note.userId).toBe('user1');
      expect(note.title).toBe('Идея для бизнеса');
      expect(note.dueDate).toBeUndefined();
      expect(note.color).toBeUndefined();
      expect(note.entityId).toBeUndefined();
      expect(note.entityType).toBeUndefined();
      expect(note.tags).toBeUndefined();
    });
  });

  describe('CreateNoteDto', () => {
    it('должен позволять создавать DTO без id и временных меток', () => {
      const createNoteDto: CreateNoteDto = {
        userId: 'user1',
        title: 'Важная встреча',
        content: 'Встреча с банком по вопросу кредита',
        type: NoteType.Reminder,
        priority: NotePriority.High,
        isCompleted: false,
        dueDate: '2023-02-15T10:00:00Z',
        color: '#FF5733',
        entityId: 'loan1',
        entityType: 'loan',
        tags: ['встреча', 'банк', 'кредит'],
      };

      expect(createNoteDto.userId).toBe('user1');
      expect(createNoteDto.title).toBe('Важная встреча');
      expect(createNoteDto.content).toBe('Встреча с банком по вопросу кредита');
      expect(createNoteDto.type).toBe(NoteType.Reminder);
      expect(createNoteDto.priority).toBe(NotePriority.High);
      expect(createNoteDto.isCompleted).toBe(false);
      expect(createNoteDto.dueDate).toBe('2023-02-15T10:00:00Z');
      expect(createNoteDto.color).toBe('#FF5733');
      expect(createNoteDto.entityId).toBe('loan1');
      expect(createNoteDto.entityType).toBe('loan');
      expect(createNoteDto.tags).toEqual(['встреча', 'банк', 'кредит']);
      // @ts-expect-error - id не должен быть в CreateNoteDto
      expect(createNoteDto.id).toBeUndefined();
      // @ts-expect-error - createdAt не должен быть в CreateNoteDto
      expect(createNoteDto.createdAt).toBeUndefined();
      // @ts-expect-error - updatedAt не должен быть в CreateNoteDto
      expect(createNoteDto.updatedAt).toBeUndefined();
    });
  });

  describe('UpdateNoteDto', () => {
    it('должен позволять обновлять только некоторые поля', () => {
      const updateNoteDto: UpdateNoteDto = {
        title: 'Обновленная встреча',
        isCompleted: true,
        priority: NotePriority.Urgent,
      };

      expect(updateNoteDto.title).toBe('Обновленная встреча');
      expect(updateNoteDto.isCompleted).toBe(true);
      expect(updateNoteDto.priority).toBe(NotePriority.Urgent);
      // Все поля должны быть опциональными
      const emptyUpdateDto: UpdateNoteDto = {};
      expect(emptyUpdateDto).toEqual({});
    });
  });

  describe('NoteResponseDto', () => {
    it('должен содержать все поля Note', () => {
      const noteResponseDto: NoteResponseDto = {
        id: '1',
        userId: 'user1',
        title: 'Важная встреча',
        content: 'Встреча с банком по вопросу кредита',
        type: NoteType.Reminder,
        priority: NotePriority.High,
        isCompleted: false,
        dueDate: '2023-02-15T10:00:00Z',
        color: '#FF5733',
        entityId: 'loan1',
        entityType: 'loan',
        tags: ['встреча', 'банк', 'кредит'],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(noteResponseDto.id).toBe('1');
      expect(noteResponseDto.userId).toBe('user1');
      expect(noteResponseDto.title).toBe('Важная встреча');
      expect(noteResponseDto.content).toBe('Встреча с банком по вопросу кредита');
      expect(noteResponseDto.type).toBe(NoteType.Reminder);
      expect(noteResponseDto.priority).toBe(NotePriority.High);
      expect(noteResponseDto.isCompleted).toBe(false);
      expect(noteResponseDto.dueDate).toBe('2023-02-15T10:00:00Z');
      expect(noteResponseDto.color).toBe('#FF5733');
      expect(noteResponseDto.entityId).toBe('loan1');
      expect(noteResponseDto.entityType).toBe('loan');
      expect(noteResponseDto.tags).toEqual(['встреча', 'банк', 'кредит']);
      expect(noteResponseDto.createdAt).toBe('2023-01-01T00:00:00Z');
      expect(noteResponseDto.updatedAt).toBe('2023-01-01T00:00:00Z');
    });
  });
});
