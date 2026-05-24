export type CategoryNode = {
  id: string;
  parentId: string | null;
};

export const buildCategoryTree = <T extends CategoryNode>(
  categories: T[]
): (T & { children: T[] })[] => {
  const map = new Map<string, T & { children: T[] }>();
  const roots: (T & { children: T[] })[] = [];

  for (const category of categories) {
    map.set(category.id, {
      ...category,
      children: [],
    });
  }

  for (const category of categories) {
    const node = map.get(category.id)!;

    if (category.parentId) {
      const parent = map.get(category.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
};