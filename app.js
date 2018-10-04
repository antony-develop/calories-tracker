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
            {id: 0, name: 'Steak', calories: 1200},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
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
        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function () {
    uiSelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
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
        
    }
})();

const AppCtrl = (function(ItemCtrl, UICtrl) {
    const loadEventListeners = function() {
        uiSelectors = UICtrl.getSelectors();

        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    const itemAddSubmit = function(e) {
        e.preventDefault();

        const input = UICtrl.getItemInput();
        
        // Check if meal and colories is not empty
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
        }
    }
    
    // Public methods
    return {
        init: function() {
            const items = ItemCtrl.getItems();

            UICtrl.populateItemList(items);
            
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

// Start app
AppCtrl.init();