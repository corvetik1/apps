/**
 * Условия доступа для системы разрешений
 *
 * Этот модуль содержит функции-условия, которые используются
 * для проверки доступа к ресурсам на основе атрибутов.
 */

import { ConditionFn } from './types';

/**
 * Проверяет, является ли пользователь владельцем ресурса
 */
export const isOwner: ConditionFn = (user, resource) => {
  if (!user || !resource) return false;
  return user.id === resource.userId || user.id === resource.createdBy;
};

/**
 * Проверяет, принадлежит ли ресурс к отделу пользователя
 */
export const isInSameDepartment: ConditionFn = (user, resource) => {
  if (!user || !resource || !user.departmentId || !resource.departmentId) {
    return false;
  }
  return user.departmentId === resource.departmentId;
};

/**
 * Проверяет, не превышает ли сумма транзакции лимит пользователя
 */
export const isWithinTransactionLimit: ConditionFn = (user, transaction) => {
  if (!user || !transaction || !user.transactionLimit) {
    return false;
  }
  return transaction.amount <= user.transactionLimit;
};

/**
 * Проверяет, не заблокирован ли ресурс
 */
export const isNotLocked: ConditionFn = (_, resource) => {
  if (!resource) return false;
  return !resource.isLocked;
};

/**
 * Проверяет, находится ли тендер в активном состоянии
 */
export const isTenderActive: ConditionFn = (_, tender) => {
  if (!tender) return false;

  const now = new Date();
  const startDate = new Date(tender.startDate);
  const endDate = new Date(tender.endDate);

  return now >= startDate && now <= endDate && !tender.isClosed;
};

/**
 * Проверяет, является ли пользователь участником тендера
 */
export const isTenderParticipant: ConditionFn = (user, tender) => {
  if (!user || !tender || !tender.participants) {
    return false;
  }
  return tender.participants.some((participant: any) => participant.userId === user.id);
};
