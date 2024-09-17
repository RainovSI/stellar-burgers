import tokens from '../fixtures/token.json';
import order from '../fixtures/order.json';
import { setCookie, deleteCookie } from '../../src/utils/cookie';

const selectors = {
  bunsTop: `[data-cy='bunsTop']`,
  constructorItems: `[data-cy='constructorItems']`,
  bunsBottom: `[data-cy='bunsBottom']`,
  orderButton: `[data-cy='orderButton']`,
  modal: `[data-cy='modal']`,
  overlay: `[data-cy='overlay']`,
};

const verifyIngredients = (
  topBun: string,
  middleMain: string,
  bottomBun: string
) => {
  cy.get(selectors.bunsTop).should('contain', topBun);
  cy.get(selectors.constructorItems).should('contain', middleMain);
  cy.get(selectors.bunsBottom).should('contain', bottomBun);
};

describe('Проверка создания заказа', () => {
  beforeEach(() => {
    setCookie('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('GET', '**/api/auth/token', { fixture: 'token.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
    cy.visit('/');
    cy.get(selectors.orderButton).as('orderButton');
  });

  it('проверка отображения верного номера заказа в модальном окне и его закрытие', () => {
    cy.get('ul li button').eq(1).click();
    cy.get('ul li button').eq(5).click();
    verifyIngredients(
      'Флюоресцентная булка R2-D3',
      'Говяжий метеорит (отбивная)',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(selectors.orderButton).click();
    cy.get(selectors.modal).should('exist');
    cy.get(selectors.modal).should('contain', '52925');
    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get(selectors.modal).should('not.exist');

    cy.get(selectors.constructorItems).should('exist');
    cy.get(selectors.constructorItems).should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(selectors.constructorItems).should(
      'not.contain',
      'Говяжий метеорит (отбивная)'
    );
  });

  afterEach(() => {
    localStorage.clear();
    deleteCookie('accessToken');
  });
});

describe('Тесты конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients/*', {
      fixture: 'ingredients.json'
    });
    cy.visit('/');
    cy.get('li p:nth(3)').as('ingredient');
  });

  it('открытие модального окна при клике на ингредиент', () => {
    cy.get('@ingredient').click();
    cy.contains('Детали ингредиента');
  });
  it('закрытие модального окна при клике на кнопку', () => {
    cy.get('@ingredient').click();
    cy.get('#modals').find('button').click();
    cy.get('#modals').find('button').should('not.exist');
  });

  it('закрытие модального окна при нажатии клавиши ESC', () => {
    cy.get('@ingredient').click();
    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get('#modals').find('button').should('not.exist');
  });

  it('закрытие модального окна при клике на оверлей', () => {
    cy.get('@ingredient').click();
    cy.get(selectors.overlay).click('topLeft', { force: true });
    cy.get('#modals').find('button').should('not.exist');
  });

  it('проверка отображения данных выбранного ингредиента в модальном окне', () => {
    let expectedValue: string;
    cy.get('@ingredient')
      .invoke('text')
      .then((text) => {
        expectedValue = text.trim();
        cy.get('@ingredient').click();
        cy.get(selectors.modal).should('contain.text', expectedValue);
      });
  });

  it('добавление ингредиентов в конструктор', () => {
    cy.get('ul li button').eq(1).click();
  cy.get(selectors.bunsTop).as('bunsTop');
  cy.get(selectors.bunsBottom).as('bunsBottom');
  cy.get('ul li button').eq(5).click();
  cy.get(selectors.constructorItems).as('ingredients');

  cy.get('@bunsTop')
    .find('span')
    .contains('Флюоресцентная булка R2-D3')
    .should('exist');
  cy.get('@bunsBottom')
    .find('span')
    .contains('Флюоресцентная булка R2-D3')
    .should('exist');
  cy.get('@ingredients')
    .find('li')
    .contains('Говяжий метеорит (отбивная)')
    .should('exist');
});
});