/**
 * Тесты для определений ролей и их разрешений
 *
 * Этот модуль содержит тесты для проверки корректности работы
 * функций и определений, связанных с ролями пользователей.
 */

import { Role } from '@finance-platform/shared';
import { Permission } from '../abilities'; 
import { userHasPermission } from '../roles'; 

import { 
  adminPermissions,
  managerPermissions,
  userPermissions,
  guestPermissions,
  getPermissionsByRole
} from '../roles';
import { Action, Subject } from '../types';

// Локальное определение ролей для тестов
enum Role {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
  Guest = 'guest',
}

describe('Roles and Permissions', () => {
  describe('adminPermissions', () => {
    it('должны содержать полный доступ ко всем ресурсам', () => {
      expect(adminPermissions).toHaveLength(1);
      expect(adminPermissions[0].action).toBe(Action.Manage);
      expect(adminPermissions[0].subject).toBe(Subject.All);
    });
  });

  describe('managerPermissions', () => {
    it('должны содержать ограниченный доступ к пользователям', () => {
      const userPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.User) 
          : p.subject === Subject.User
      );
      
      expect(userPermission).toBeDefined();
      if (userPermission) {
        expect(Array.isArray(userPermission.action)).toBe(true);
        expect(userPermission.action).toContain(Action.Read);
        expect(userPermission.action).toContain(Action.Create);
        expect(userPermission.action).toContain(Action.Update);
        expect(userPermission.conditions).toBeDefined();
        expect(userPermission.conditions?.isNotAdmin).toBeDefined();
      }
      
      // Проверяем условие isNotAdmin
      const adminUser = { role: Role.Admin };
      const regularUser = { role: Role.User };
      
      if (userPermission && userPermission.conditions && userPermission.conditions.isNotAdmin) {
        expect(userPermission.conditions.isNotAdmin(null, adminUser)).toBe(false);
        expect(userPermission.conditions.isNotAdmin(null, regularUser)).toBe(true);
      }
    });

    it('должны содержать полный доступ к счетам', () => {
      const accountPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Account) 
          : p.subject === Subject.Account
      );
      
      expect(accountPermission).toBeDefined();
      if (accountPermission) {
        expect(accountPermission.action).toBe(Action.Manage);
      }
    });

    it('должны содержать полный доступ к транзакциям', () => {
      const transactionPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Transaction) 
          : p.subject === Subject.Transaction
      );
      
      expect(transactionPermission).toBeDefined();
      if (transactionPermission) {
        expect(transactionPermission.action).toBe(Action.Manage);
      }
    });

    it('должны содержать полный доступ к тендерам', () => {
      const tenderPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Tender) 
          : p.subject === Subject.Tender
      );
      
      expect(tenderPermission).toBeDefined();
      if (tenderPermission) {
        expect(tenderPermission.action).toBe(Action.Manage);
      }
    });

    it('должны содержать полный доступ к отчетам и дашбордам', () => {
      const reportDashboardPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Report) && p.subject.includes(Subject.Dashboard)
          : false
      );
      
      expect(reportDashboardPermission).toBeDefined();
      if (reportDashboardPermission) {
        expect(reportDashboardPermission.action).toBe(Action.Manage);
      }
    });

    it('должны содержать ограниченный доступ к настройкам', () => {
      const settingsPermission = managerPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Settings) 
          : p.subject === Subject.Settings
      );
      
      expect(settingsPermission).toBeDefined();
      if (settingsPermission) {
        expect(Array.isArray(settingsPermission.action)).toBe(true);
        expect(settingsPermission.action).toContain(Action.Read);
        expect(settingsPermission.action).toContain(Action.Update);
        expect(settingsPermission.action).not.toContain(Action.Delete);
      }
    });
  });

  describe('userPermissions', () => {
    it('должны содержать доступ к своему профилю', () => {
      const userProfilePermission = userPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.User) 
          : p.subject === Subject.User
      );
      
      expect(userProfilePermission).toBeDefined();
      if (userProfilePermission) {
        expect(Array.isArray(userProfilePermission.action)).toBe(true);
        expect(userProfilePermission.action).toContain(Action.Read);
        expect(userProfilePermission.action).toContain(Action.Update);
        expect(userProfilePermission.conditions).toBeDefined();
        expect(userProfilePermission.conditions?.isOwner).toBeDefined();
      }
    });

    it('должны содержать доступ к счетам своего отдела', () => {
      const accountPermission = userPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Account) 
          : p.subject === Subject.Account
      );
      
      expect(accountPermission).toBeDefined();
      if (accountPermission) {
        expect(accountPermission.action).toBe(Action.Read);
        expect(accountPermission.conditions).toBeDefined();
        expect(accountPermission.conditions?.isInSameDepartment).toBeDefined();
      }
    });

    it('должны содержать доступ к созданию транзакций в пределах лимита', () => {
      const transactionPermission = userPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Transaction) 
          : p.subject === Subject.Transaction
      );
      
      expect(transactionPermission).toBeDefined();
      if (transactionPermission) {
        expect(Array.isArray(transactionPermission.action)).toBe(true);
        expect(transactionPermission.action).toContain(Action.Create);
        expect(transactionPermission.action).toContain(Action.Read);
        expect(transactionPermission.conditions).toBeDefined();
        expect(transactionPermission.conditions?.isWithinLimit).toBeDefined();
      }
    });

    it('должны содержать доступ к чтению тендеров', () => {
      const tenderPermission = userPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Tender) 
          : p.subject === Subject.Tender
      );
      
      expect(tenderPermission).toBeDefined();
      if (tenderPermission) {
        expect(tenderPermission.action).toBe(Action.Read);
        expect(tenderPermission.conditions).toBeDefined();
        expect(tenderPermission.conditions?.isActive).toBeDefined();
      }
    });

    it('должны содержать доступ к чтению отчетов и дашбордов', () => {
      const reportDashboardPermission = userPermissions.find(
        p => Array.isArray(p.subject) 
          ? p.subject.includes(Subject.Report) && p.subject.includes(Subject.Dashboard)
          : false
      );
      
      expect(reportDashboardPermission).toBeDefined();
      if (reportDashboardPermission) {
        expect(reportDashboardPermission.action).toBe(Action.Read);
      }
    });
  });

  describe('guestPermissions', () => {
    it('должны содержать доступ только к публичным отчетам и дашбордам', () => {
      expect(guestPermissions).toHaveLength(1);
      
      const permission = guestPermissions[0];
      expect(Array.isArray(permission.subject)).toBe(true);
      expect(permission.subject).toContain(Subject.Report);
      expect(permission.subject).toContain(Subject.Dashboard);
      expect(permission.action).toBe(Action.Read);
      expect(permission.conditions).toBeDefined();
      if (permission.conditions) {
        expect(permission.conditions.isPublic).toBeDefined();
        
        // Проверяем условие isPublic
        const publicResource = { isPublic: true };
        const privateResource = { isPublic: false };
        const undefinedResource = {};
        
        if (permission.conditions.isPublic) {
          expect(permission.conditions.isPublic(null, publicResource)).toBe(true);
          expect(permission.conditions.isPublic(null, privateResource)).toBe(false);
          expect(permission.conditions.isPublic(null, undefinedResource)).toBe(false);
        }
      }
    });
  });

  describe('getPermissionsByRole', () => {
    it('должен возвращать разрешения администратора для роли Admin', () => {
      const permissions = getPermissionsByRole(Role.Admin);
      expect(permissions).toBe(adminPermissions);
    });

    it('должен возвращать разрешения менеджера для роли Manager', () => {
      const permissions = getPermissionsByRole(Role.Manager);
      expect(permissions).toBe(managerPermissions);
    });

    it('должен возвращать разрешения пользователя для роли User', () => {
      const permissions = getPermissionsByRole(Role.User);
      expect(permissions).toBe(userPermissions);
    });

    it('должен возвращать разрешения гостя для роли Guest', () => {
      const permissions = getPermissionsByRole(Role.Guest);
      expect(permissions).toBe(guestPermissions);
    });

    it('должен возвращать пустой массив для неизвестной роли', () => {
      // Намеренно передаем неверное значение для теста
      const permissions = getPermissionsByRole('unknown' as any);
      expect(permissions).toEqual([]);
    });
  });
});

describe('userHasPermission', () => {
  // TODO: реализовать тесты для userHasPermission
});
