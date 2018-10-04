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
        getSelectors: function() {
            return uiSelectors;
        },
        
    }
})();

const AppCtrl = (function(ItemCtrl, UICtrl) {
    
    // Public methods
    return {
        init: function() {
            const items = ItemCtrl.getItems();

            UICtrl.populateItemList(items);
        }
    }
})(ItemCtrl, UICtrl);

// Start app
AppCtrl.init();