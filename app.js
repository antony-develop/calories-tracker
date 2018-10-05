const StorageCtrl = (function () {

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
        items: [
            // {id: 0, name: 'Steak', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300},
        ],
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
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',

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
        }
    }
})();

const AppCtrl = (function(ItemCtrl, UICtrl) {
    const loadEventListeners = function() {
        uiSelectors = UICtrl.getSelectors();

        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);
    
        document.querySelector(uiSelectors.itemList).addEventListener('click', itemUpdateSubmit)
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

            UICtrl.clearInput();
        }
    }

    const itemUpdateSubmit = function(e) {
        e.preventDefault();

        if (e.target.classList.contains('edit-item')) {
            const itemId = +e.target.closest('li').id.split('-').pop();

            const itemToEdit = ItemCtrl.getItemById(itemId);
            
            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }
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
})(ItemCtrl, UICtrl);

// Start app
AppCtrl.init();