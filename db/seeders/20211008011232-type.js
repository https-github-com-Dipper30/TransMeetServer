'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Categories', [
        {
          name: 'Snacks',
          code: 1,
        },
        {
          name: 'Drinks',
          code: 2,
        },
        {
          name: 'Wheat Product',
          code: 3,
        },
        {
          name: 'Sea Food',
          code: 4,
        },
        {
          name: 'Fruits',
          code: 5,
        },
        {
          name: 'Meats',
          code: 6,
        },
    ], {})
    await queryInterface.bulkInsert('Types', [
      {
        name: 'Chocolates',
        code: 1,
        cate_code: 1,
      },
      {
        name: 'Candies',
        code: 2,
        cate_code: 1,
      },
      {
        name: 'Cookies',
        code: 3,
        cate_code: 1,
      },
      {
        name: 'Chips',
        code: 4,
        cate_code: 1,
      },
      {
        name: 'Donut',
        code: 5,
        cate_code: 1,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 1,
      },
      {
        name: 'Coke',
        code: 1,
        cate_code: 2,
      },
      {
        name: 'Soft Drinks',
        code: 2,
        cate_code: 2,
      },
      {
        name: 'Alcohol',
        code: 3,
        cate_code: 2,
      },
      {
        name: 'Water',
        code: 4,
        cate_code: 2,
      },
      {
        name: 'Milk',
        code: 5,
        cate_code: 2,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 2,
      },
      {
        name: 'Rice',
        code: 1,
        cate_code: 3,
      },
      {
        name: 'Noodles',
        code: 2,
        cate_code: 3,
      },
      {
        name: 'Breads',
        code: 3,
        cate_code: 3,
      },
      {
        name: 'Flour',
        code: 4,
        cate_code: 3,
      },
      {
        name: 'Potatoes',
        code: 5,
        cate_code: 3,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 3,
      },
      {
        name: 'Fish',
        code: 1,
        cate_code: 4,
      },
      {
        name: 'Shrimp',
        code: 2,
        cate_code: 4,
      },
      {
        name: 'Crab',
        code: 3,
        cate_code: 4,
      },
      {
        name: 'Lobster',
        code: 4,
        cate_code: 4,
      },
      {
        name: 'Shell',
        code: 5,
        cate_code: 4,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 4,
      },
      {
        name: 'Apple',
        code: 1,
        cate_code: 5,
      },
      {
        name: 'Orange',
        code: 2,
        cate_code: 5,
      },
      {
        name: 'Mango',
        code: 3,
        cate_code: 5,
      },
      {
        name: 'Melon',
        code: 4,
        cate_code: 5,
      },
      {
        name: 'Peach',
        code: 5,
        cate_code: 5,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 5,
      },
      {
        name: 'Pork',
        code: 1,
        cate_code: 6,
      },
      {
        name: 'Chicken',
        code: 2,
        cate_code: 6,
      },
      {
        name: 'Beef',
        code: 3,
        cate_code: 6,
      },
      {
        name: 'Mutton',
        code: 4,
        cate_code: 6,
      },
      {
        name: 'Duck',
        code: 5,
        cate_code: 6,
      },
      {
        name: 'Others',
        code: 6,
        cate_code: 6,
      },
  ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Types', null, {})
  },
}
