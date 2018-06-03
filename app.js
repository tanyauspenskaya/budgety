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

  var calculateTotal = function(type) {
    var sum;
    sum = 0;
    data.allItems[type].forEach(function(item) {
      sum += item.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget : 0,
    percentage: -1
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

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage
      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
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
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(field){
        field.value = '';
      });
      fieldsArr[0].focus();
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

  var updateBudget = function() {
    var budget;
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    budget = budgetCtrl.getBudget();
    // 3. Display budget on the UI
    console.log(budget);
  }

  var ctrlAddItem = function() {
    var inputData, newItem;
    // 1. Get field input data
    inputData = UICtrl.getInput();
    //console.log(inputData);

    if (inputData.description !== '' && !isNaN(inputData.value) && inputData.value > 0) {
      // 2. Add the item to budget controller
      newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

      // 3. Add new item to UI
      UICtrl.addListItem(newItem, inputData.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();
    }
  }

  return {
    init: function() {
      setupEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();
