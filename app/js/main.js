// === Все категории ===

class Categories {
  constructor(path) {
    this.path = path;
  };

  async getJSON() {

    // === Получение структуры из JSON-файла ===
    const response = await fetch(this.path);
    if (response.ok) {
      new Сategory(await response.text()).renderCategory();
    } else {
      console.error(response.status);
    }
  };

};

// === Категории и приложения ===
class Сategory {
  constructor(result) {
    this.result = JSON.parse(result);
    this.hexGrid = document.querySelector('#hexGrid');
  };

  renderCategory() {

    // === Отрисовка всех категорий ===
    let hexagons = '';
    this.result.structure.forEach(({ catName, catImage, catAlias, catApps }) => {
      if (catApps.length > 1) {
        hexagons += `<li class="hex"><div class="hexIn"><a class="hexLink" href="#" data-cat="${catName}"><div class="hexImageWrapper">${catImage}</div><h2 class="hexTitle">${catAlias}</h2></a></div></li>`
      } else {
        hexagons += `<li class="hex"><div class="hexIn"><a class="hexLink" href="${catApps[0].appLink}" data-cat="${catName}"><div class="hexImageWrapper">${catImage}</div><h2 class="hexTitle">${catAlias}</h2></a></div></li>`
      };

    });
    this.hexGrid.insertAdjacentHTML('beforeend', hexagons);
    this.renderApps();
  };

  renderApps() {

    // === Отрисовка всех приложений данной категории ===
    let appsContent = '';
    const hexLink = this.hexGrid.querySelectorAll('.hexLink');
    const clickCategory = (e) => {
      appsContent = '';
      this.result.structure.forEach(({ catName, catApps }) => {
        if (catApps.length > 1) {
          if (catName === e.currentTarget.getAttribute('data-cat')) {
            catApps.forEach(({ appName, appLink }) => {
              appsContent += `<li class="modal-info-list-item"><a class="modal-info-link" href="${appLink}">${appName}</a></li>`
            });
          };
        };
      });
      new ModalWindow(`<ul class="modal-info-list">${appsContent}</ul>`, e.currentTarget).renderInfoWindow();
    };
    hexLink.forEach((item) => {
      item.addEventListener('click', clickCategory);
    });
  };
};

// === Навигация ===
class Navigation {
  constructor() { }

  //=== Выбор пункта меню ===
  menuSelect() {
    const headNavLink = document.querySelectorAll('.head-nav-link');
    headNavLink.forEach((item) => {
      item.addEventListener('click', (e) => {
        const dataMenu = e.currentTarget.getAttribute('data-menu');
        if (menuItems[dataMenu] !== "") {
          new ModalWindow(menuItems[dataMenu]).renderInfoWindow();
        };
      });
    });
  }
};

// === Бургер-меню ===
class BurgerMenu {
  constructor() { }

  // === Включение/выключение ===
  budrgerChange() {
    const $ = x => document.querySelector(x);
    const headNav = $('.head-nav');
    const burgerMenu = $('.burger-menu');
    const burgerMenuTop = $('.burger-menu-top');
    const burgerMenuCenter = $('.burger-menu-center');
    const burgerMenuBottom = $('.burger-menu-bottom');
    burgerMenu.addEventListener('click', (e) => {
      headNav.classList.toggle('head-nav-active');
      burgerMenuTop.classList.toggle('burger-menu-top-active');
      burgerMenuCenter.classList.toggle('burger-menu-center-active');
      burgerMenuBottom.classList.toggle('burger-menu-bottom-active');
    });
  };
};

// === Модальное окно ===
class ModalWindow {
  constructor(content, currentObject = '') {
    this.content = content;
    this.currentObject = currentObject;
  };

  renderInfoWindow() {

    if (this.content.length > 33) {
      // === Показать окно ===
      const $ = x => document.querySelector(x);
      const modal = $('.modal');
      const modalInfoContent = $('.modal-info-content');
      const modalInfoClose = $('.modal-info-close');

      modalInfoContent.insertAdjacentHTML('afterbegin', this.content);
      modal.classList.add('modal-active');

      if (this.currentObject) {
        this.currentObject.classList.add('hexLink-active');
      };

      // === Скрыть окно ===
      const appClose = (e) => {
        modalInfoContent.innerHTML = '';
        modal.classList.remove('modal-active');

        if (this.currentObject) {
          this.currentObject.classList.remove('hexLink-active');
        };
      };
      modalInfoClose.addEventListener('click', appClose);
    }
  };

};

const menuItems = {
  aboutsystem: "<div class=\"about-wrapper\"><span class=\"about-tiltle\">Единая геоинформационная система Ненецкого автономного округа (ГИС НАО)</span><ul class=\"about-list\"><li class=\"about-list-item\">ГИС НАО – это информационная система, предоставляющая доступ к региональным пространственным данным Ненецкого автономного округа.</li><li class=\"about-list-item\">ГИС НАО позволяет получать оперативную и достоверную информацию о территории Ненецкого автономного округа за счёт объединения всех сведений о территории региона, населении, здравоохранении, образовании, доступности природных ресурсов, инвестиционном потенциале, инфраструктурном развитии и многих других сферах.</li><li class=\"about-list-item\">Тематическая информация, содержащаяся в ГИС НАО, представлена в виде соответствующих приложений.</li><li class=\"about-list-item\">В качестве дополнительных данных в ГИС НАО включены сведения с портала Росреестра,  Федеральной информационной системы территориального планирования (ФГИС ТП) и других отечественных и зарубежных источников открытых пространственных данных.</li><li class=\"about-list-item\">По всем вопросам связанным с работой ГИС НАО, обращайтесь в отдел геоинформационных систем КУ НАО &laquo;Ненецкий информационно-аналитический центр&raquo;</li><li class=\"about-list-item\">E-mail: <a class=\"aboutLink\" href=\"mailto:gis@adm-nao.ru ? subject = Сообщение с портала ГИС НАО\" title=\"Отправить почту\">gis@adm-nao.ru</span></a></li><li class=\"about-list-item\">Телефон: <a class=\"aboutLink\" href = \"tel:+78185323907\" title=\"Позвонить\">2-39-07</a></li></ul></div>",
  reference: "<div class=\"about-wrapper\"><span class=\"appDevelop\">Приложение в разработке</span></div>",
  catalog: "<div class=\"about-wrapper\"><span class=\"appDevelop\">Приложение в разработке</span></div>",
  olddesign: ""
};

window.onload = () => {
  new Categories('../json/structure.json').getJSON();
  new BurgerMenu().budrgerChange();
  new Navigation().menuSelect();
};