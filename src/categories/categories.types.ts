import { Category } from './category.entity';

export type CategoryTreeNode = Category & { children: CategoryTreeNode[] };
