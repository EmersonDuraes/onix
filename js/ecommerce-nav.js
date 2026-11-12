/* E-commerce: navegação "fancy-nav" */
(function () {
  var DOM = {
    item: ".fancy-nav__item",
    itemList: ".fancy-nav__list",
    images: ".fancy-nav__img",
    tabList: ".fancy-nav__tabs",
    tab: ".fancy-nav__tab",
    tabCloseBtn: ".fancy-nav__close-btn",
    tabImg: ".fancy-nav__tab-img",
    tabDescr: ".fancy-nav__tab-description",
    isVisible: "is-visible"
  };
  var fancyItemList = document.querySelector(DOM.itemList);
  var fancyItems = document.querySelectorAll(DOM.item);
  var fancyTabList = document.querySelector(DOM.tabList);
  var fancyTabs = document.querySelectorAll(DOM.tab);
  if (!fancyItemList || !fancyTabList) { return; }
  var abertaIndex = -1;

  function partes(tab) {
    return [tab, tab.querySelector(DOM.tabCloseBtn), tab.querySelector(DOM.tabImg), tab.querySelector(DOM.tabDescr)];
  }
  function openFancyTab(i) {
    fancyTabList.classList.add(DOM.isVisible);
    partes(fancyTabs[i]).forEach(function (el) { el.classList.add(DOM.isVisible); });
    abertaIndex = i;
    var fechar = fancyTabs[i].querySelector(DOM.tabCloseBtn);
    if (fechar) { fechar.focus({ preventScroll: true }); }
  }
  function closeFancyTab(i) {
    fancyTabList.classList.remove(DOM.isVisible);
    partes(fancyTabs[i]).forEach(function (el) { el.classList.remove(DOM.isVisible); });
    abertaIndex = -1;
    if (fancyItems[i]) { fancyItems[i].focus({ preventScroll: true }); }
  }
  function getCurrentElemIndex(list, item) { return Array.from(list).indexOf(item); }
  function changeMainImage(i) {
    document.querySelectorAll(DOM.images).forEach(function (img, n) { img.style.opacity = (n === i) ? 1 : 0; });
  }

  fancyItemList.addEventListener("mouseover", function (e) {
    var it = e.target.closest(DOM.item);
    if (it) { changeMainImage(getCurrentElemIndex(fancyItems, it)); }
  });
  fancyItemList.addEventListener("focusin", function (e) {
    var it = e.target.closest(DOM.item);
    if (it) { changeMainImage(getCurrentElemIndex(fancyItems, it)); }
  });
  fancyItemList.addEventListener("click", function (e) {
    var it = e.target.closest(DOM.item);
    if (it) { openFancyTab(getCurrentElemIndex(fancyItems, it)); }
  });
  fancyItemList.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") { return; }
    var it = e.target.closest(DOM.item);
    if (it) { e.preventDefault(); openFancyTab(getCurrentElemIndex(fancyItems, it)); }
  });
  fancyTabList.addEventListener("click", function (e) {
    if (e.target.closest(DOM.tabCloseBtn)) {
      closeFancyTab(getCurrentElemIndex(fancyTabs, e.target.closest(DOM.tab)));
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && abertaIndex > -1) { closeFancyTab(abertaIndex); }
  });
})();
