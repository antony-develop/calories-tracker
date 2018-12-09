const StorageCtrl = (function () {

    // Public methods
    return {
        storeItem: function(item) {
            let items = [];

            if (localStorage.getItem('items') === null) {
                items.push(item);
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
            }

            localStorage.setItem('items', JSON.stringify(items));
        },
        getItems: function() {
            const itemsJson = localStorage.getItem('items');
            if (itemsJson === null) {
                return [];
            } else {
                return JSON.parse(itemsJson);
            }
        },
        updateItem: function (updatedItem) {
            const items = this.getItems();
            
            items.forEach((item, index) => {
                if (item.id == updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItem: function (id) {
            const items = this.getItems();
            
            items.forEach((item, index) => {
                if (item.id == id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteAllItems: function() {
            localStorage.removeItem('items');
        }
    }
})();

const ItemCtrl = (function () {
    // Item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data structure / State
    const data = {
        items: StorageCtrl.getItems(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        getItemById: function(id) {
            for (let item of data.items) {
                if (item.id === id) {
                    return item;
                } 
            }
        },
        addItem: function(name, calories) {
            // create new item id
            let id = 0;
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            }

            calories = parseInt(calories);

            const newItem = new Item(id, name, calories);

            data.items.push(newItem);

            return newItem;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);

            data.currentItem.name = name;
            data.currentItem.calories = calories;

            for (let item of data.items) {
                if (item.id == data.currentItem.id) {
                    item = data.currentItem;

                    return item;
                }
            }
        },
        deleteItem: function() {
            for (let [index, item] of data.items.entries()) {
                if (item.id === data.currentItem.id) {
                    data.items.splice(index, 1);
                }
            }
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            for (let item of data.items) {
                total += item.calories;
            }
            
            // Set total calories do data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function () {
    uiSelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        itemForm: '#item-form',
    }

    return {
        populateItemList: function(items) {
            let itemsHtml = '';

            for (let item of items) {
                itemsHtml += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            }

            document.querySelector(uiSelectors.itemList).innerHTML = itemsHtml;
        },
        getItemInput: function() {
          return {
              name: document.querySelector(uiSelectors.itemNameInput).value,
              calories: document.querySelector(uiSelectors.itemCaloriesInput).value,
          }  
        },
        getSelectors: function() {
            return uiSelectors;
        },
        addListItem: function(item) {
            this.showList();

            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = 'item-' + item.id;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            document.querySelector(uiSelectors.itemList).append(li);
        },
        updateListItem: function(item) {
            const listItems = document.querySelectorAll(uiSelectors.listItems);
            for (let listItem of listItems) {
                if (listItem.id === `item-${item.id}`) {
                    document.getElementById(listItem.id).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            }

        },
        deleteListItem: function(id) {
            document.getElementById('item-' + id).remove();
        },
        clearInput: function() {
            document.querySelector(uiSelectors.itemNameInput).value = '';
            document.querySelector(uiSelectors.itemCaloriesInput).value = '';

            document.querySelector(uiSelectors.itemNameInput).focus();
        },
        addItemToForm: function() {
            document.querySelector(uiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(uiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            
            this.showEditState();
        },
        hideList: function() {
            document.querySelector(uiSelectors.itemList).style.display = 'none';
        },
        showList: function() {
            document.querySelector(uiSelectors.itemList).style.display = 'block';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(uiSelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();

            document.querySelector(uiSelectors.updateBtn).style.display = 'none';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
            document.querySelector(uiSelectors.backBtn).style.display = 'none';
            document.querySelector(uiSelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(uiSelectors.backBtn).style.display = 'inline';
            document.querySelector(uiSelectors.addBtn).style.display = 'none';
        },
        deleteAllListItems: function() {
            document.querySelectorAll(uiSelectors.listItems).forEach(item => {
                item.remove();
            })
        }
    }
})();

const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function() {
        uiSelectors = UICtrl.getSelectors();
        
        // Add item event
        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);
        
        // Prevent form submit on enter
        document.querySelector(uiSelectors.itemForm).addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
            }
        });

        // Edit item event
        document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick)
    
        // Update item event
        document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(uiSelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    
        // Back button event
        document.querySelector(uiSelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        
        // Clear all item event
        document.querySelector(uiSelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const itemAddSubmit = function(e) {
        e.preventDefault();

        const input = UICtrl.getItemInput();
        
        // Check if meal and colories inputs are not empty
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(newItem);

            UICtrl.clearInput();
        }
    }

    const itemEditClick = function(e) {
        e.preventDefault();

        if (e.target.classList.contains('edit-item')) {
            const itemId = +e.target.closest('li').id.split('-').pop();

            const itemToEdit = ItemCtrl.getItemById(itemId);
            
            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }
    }

    const itemUpdateSubmit = function(e) {
        e.preventDefault();

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItem(updatedItem);

        UICtrl.clearEditState();
    }

    const itemDeleteSubmit = function(e) {
        e.preventDefault();

        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem();

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItem(currentItem.id);

        UICtrl.clearEditState();
    }

    const clearAllItemsClick = function(e) {
        e.preventDefault();

        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.deleteAllListItems();

        StorageCtrl.deleteAllItems();

        UICtrl.hideList();
    }
    
    // Public methods
    return {
        init: function() {
            // Set initial state
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();
            
            if (items.length) {
                UICtrl.populateItemList(items);
            } else {
                UICtrl.hideList();
            }
            
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Start app
AppCtrl.init();