import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryTreeNode } from './categories.types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private insertNodeInTree(node: CategoryTreeNode, tree: CategoryTreeNode[]) {
    if (tree.length === 0) return;

    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i].id === node.parentId) {
        tree[i].children.push(node);
        return;
      }

      this.insertNodeInTree(node, tree[i].children);
    }
  }

  private listToTree(categories: Category[]): CategoryTreeNode[] {
    const categoryNodes: CategoryTreeNode[] = categories.map((category) => ({
      ...category,
      children: [],
    }));

    const topCategories = categoryNodes.filter((c) => c.parentId === null);
    const subCategories = categoryNodes.filter((c) => c.parentId !== null);

    while (subCategories.length > 0) {
      this.insertNodeInTree(subCategories[0], topCategories);
      subCategories.shift();
    }

    return topCategories;
  }

  public async getCategoriesTree(): Promise<CategoryTreeNode[]> {
    const allCategories = await this.categoriesRepository.find();
    return this.listToTree(allCategories);
  }
}
