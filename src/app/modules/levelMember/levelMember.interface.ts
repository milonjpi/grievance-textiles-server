import { LevelStatus } from '@prisma/client';

export type ILevelMemberFilters = {
  searchTerm?: string;
  level?: string;
};

export type ILevelCreateRemove = {
  level: LevelStatus;
  employeeId: string;
  remarks?: string;
};
