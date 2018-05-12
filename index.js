'use strict';


const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideChecked: false,
  searchMode: false,
  searchQuery: ''
};


function generateItemElement(item, itemIndex) {
  let isChecked = '';
  if(item.checked === true) isChecked = 'shopping-item__checked';

  let isDisplayed = '';
  if(STORE.hideChecked === true && item.checked === true) isDisplayed = 'not-displayed';

  let isQueried = '';
  if(STORE.searchMode === true && STORE.searchQuery !== item.name) isQueried = 'not-queried';

  return `
    <li class="js-item-index-element ${isDisplayed} ${isQueried}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${isChecked}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-rename js-item-rename">
          <span class="button-label">rename</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingListArray) {
  console.log('Generating shopping list element');

  const itemsArray = shoppingListArray.map((item, index) => generateItemElement(item, index));
  
  return itemsArray.join('');
}

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  const displayedItems = $('.js-shopping-list');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  displayedItems.html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


function handleDisplayToggle() {
  $('.js-display-switch').on('click', function(event) {
    if(STORE.hideChecked === true) STORE.hideChecked = false;
    else if(STORE.hideChecked === false) STORE.hideChecked = true;
    console.log(`Hide checked items changed to ${STORE.hideChecked}`);
    renderShoppingList();
  });
}


function handleItemSearch() {
  $('.js-shopping-list-search').on('click', function(event) {
    event.preventDefault();
    console.log('search button clicked');
    STORE.searchQuery = prompt('What are you looking for?');
    if (!STORE.searchQuery) {
      STORE.searchMode = false;
      STORE.searchQuery = '';
    }
    else {
      STORE.searchMode = true;
      renderShoppingList();
    }
  });
}

function handleClearSearch() {
  $('.js-shopping-list-search-clear').on('click', function(event) {
    event.preventDefault();
    STORE.searchMode = false;
    STORE.searchQuery = '';
    renderShoppingList();
  });
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


function toggleCheckedForListItem(itemIndex) {
  console.log(`Toggling checked property for item at index ${itemIndex}`);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', function(event) {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function renameListItem(itemIndex, newItemName) {
  console.log(`index of item being renamed: ${itemIndex}`);
  STORE.items[itemIndex].name = newItemName;
}

function handleRenameItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-rename', function(event) {
    // ask user for new item name
    const newItemName = prompt('Enter new item name:');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    renameListItem(itemIndex, newItemName);
    renderShoppingList();
  });
}


function deleteListItem(itemIndex) { 
  console.log(`Deleted item from index ${itemIndex} from list`);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleDisplayToggle();
  handleItemSearch();
  handleClearSearch();
  handleItemCheckClicked();
  handleRenameItemClicked();
  handleDeleteItemClicked();
}


// when the page loads, call `handleShoppingList`
$(handleShoppingList);