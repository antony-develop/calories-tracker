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
        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function () {

    return {
        
    }
})();

const AppCtrl = (function(ItemCtrl, UICtrl) {
    
    // Public methods
    return {
        init: function() {
            console.log('init...');
        }
    }
})(ItemCtrl, UICtrl);

// Start app
AppCtrl.init();