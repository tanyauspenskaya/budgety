// BUDGET CONTROLLER //
var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;
      // Create new Id
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //console.log(ID); 

      // Create new item based on inc or exp type
      if(type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type  === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      // Push it into data structure
      data.allItems[type].push(newItem);
      // Return new element
      return newItem;
    },
    testing: function() {
      console.log(data.allItems);
    }
  }

})();




// UI CONTROLLER //
var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    },
    addListItem: function(obj, type) {
      var html, newtml, element;
      // create html string with placeholder text
      if(type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="income-%id%">
          <div class="item__description">%description%</div>
          <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__delete">
                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
          </div>
        </div>`;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="expense-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
                <div class="item__value">%value%</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
      }
      
      // replace placeholder text with actual data from object
      newtml = html.replace('%id%', obj.id);
      newtml = newtml.replace('%description%', obj.description);
      newtml = newtml.replace('%value%', obj.value);

      // insert html inot the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newtml);

    }
  };

})();



// GLOBAL APP CONTROLLER //
var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function() {
    var inputData, newItem;
    // 1. Get field input data
    inputData = UICtrl.getInput();
    //console.log(inputData);

    // 2. Add the item to budget controller
    newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

    // 3. Add new item to UI
    UICtrl.addListItem(newItem, inputData.type);

    // 4. Calculate the budget

    // 5. Display budget on UI
  }

  return {
    init: function() {
      setupEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();
