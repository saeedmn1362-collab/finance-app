const buildCategoryTree = (categories) => {
  const map = new Map();
  const roots = [];

  // 1) ساخت node ها
  categories.forEach((cat) => {
    map.set(cat.id, {
      ...cat,
      children: [],
    });
  });

  // 2) اتصال parent → child
  categories.forEach((cat) => {
    const node = map.get(cat.id);

    if (cat.parentId) {
      const parent = map.get(cat.parentId);

      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

module.exports = buildCategoryTree;