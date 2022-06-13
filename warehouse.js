//SIDEBAR BUTTON EVENT
let sidebarElement = document.querySelector("#sidebar");
document.querySelector("#sidebarButton").addEventListener("click", function() {
  if (document.querySelector(".sidebar-open")) {
    sidebarElement.removeAttribute("class");
    return;
  };
  sidebarElement.setAttribute("class", "sidebar-open");
});
//
  
//CORE REFERENCES
const core = {
  pathToInterfaceImages: "./images",
  get pathToItemImages() {return this.pathToInterfaceImages + "/items"},
};
//

//CREATION (BOXES & SLOTES & ITEMS)
const create = {
  ItemObject: function(name, weight, stackCap, type, imageFile, pluralTruthiness) {
    this.name = name,
    this.type = type,
    this.weight = weight,
    this.stackCap = stackCap,
    this.imageFile = imageFile,
    this.pluralTruthiness = pluralTruthiness
  },
  SlotObject: function(boxObject) {
    this.itemObject = item.blank;
    this.itemCount = 0;
    this.slotWeight = 0;
    this.capacityMultiplier = 1;
    this.parentBox = boxObject;
  },
  BoxObject: function(name, slotTotal, weightCap) {
    this.name = name,
    this.elementID = name + "Box",
    this.baseSlotID = name + "Slot",
    this.slots = [];
    this.slotTotal = slotTotal,
    this.weight = {
      sum: 0,
      max: weightCap,
      counterID: name + "WeightCounter",
      get available() {return calculate.roundToADecimal(this.max - this.sum)},
    },
    this.numberOfNextToOverride = 1
  },
  UpgradeObject: function(name, description, craftingArray, outcomeFunction) {
    this.name = name;
    this.description = description;
    this.craftingArray = craftingArray;
    this.function = outcomeFunction;
  },
  slotElement: function(slotID, tabTruthiness, interactivityTruthiness) {
    let slotElement = infer.HTMLAsNode(`
      <section id="${slotID}" class="containerSlot">
        <img class="itemImage" src="" alt="empty slot" draggable="false">
        <section class="itemCount"></section>
        <section class="slotWeight"></section>
      </section>
    `);

    if (tabTruthiness) {
      slotElement.tabIndex = 0;
    };

    if (interactivityTruthiness) {
      slotElement.addEventListener("contextmenu", function(event){
        event.preventDefault();
        menu.slotContext.slot(event);
      });

      slotElement.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text", event.currentTarget.id);
      });
      slotElement.addEventListener("dragover", function(event) {
        event.preventDefault();
      });
      slotElement.addEventListener("drop", function(event) {
        event.preventDefault();
        let initialSlotObject = infer.objectOfSlotID(event.dataTransfer.getData("text"));
        let targetSlotObject = infer.objectOfSlotID(event.currentTarget.id);
        
        if (initialSlotObject === targetSlotObject || initialSlotObject.itemObject === item.blank) {
          return;
        };
        if (initialSlotObject.parentBox !== box.shipments && targetSlotObject.parentBox === box.shipments) {
          menu.dialogue.message("TRANSFER REJECTED", "Shipments is a collect-only category");
          return;
        };
        
        menu.dialogue.transfer(initialSlotObject, targetSlotObject);
      });
    };
    return slotElement;
  },
  boxElement: function(boxObject) {
    return infer.HTMLAsNode(`
    <section id="${boxObject.elementID}" class="contentBox">
      <h3>${boxObject.name}</h3>
      <section class="slotContainer"> </section>
      <section class="weightBar" id="${boxObject.weight.counterID}">
        <span class="sumWeight">${boxObject.weight.sum}</span>/<span class="maxWeight">${boxObject.weight.max}</span>
      </section>
    </section>`);
  },
  utilityBox: {
    framework: function(elementID) {
      let element = document.createElement("button");
      element.id = elementID;
      element.className = "contentBox";
      return element;
    },
    dashboard: function() {
      let boxElement = this.framework("dashboardButton");
      boxElement.addEventListener("click", function() {
        menu.dialogue.dashboard();
      });

      let iconElement = document.createElement("img");
      edit.element.massAttribution(iconElement,
        [["src", core.pathToInterfaceImages + "/dashboardMagic.svg"], ["alt", "Magic hat"], ["draggable", "false"]]
      );
      boxElement.appendChild(iconElement);

      document.querySelector("#trashAndShopFlex").appendChild(boxElement);
    },
  },
  option: function(optionValue, optionText = optionValue) {
    let optionElement = document.createElement("option");
    optionElement.value = optionValue;
    optionElement.innerText = optionText;
    return optionElement;
  },
  numberInputWithFunctioningLimits: function(min, step, max) {
    let element = document.createElement("input");
    edit.element.massAttribution(element, 
      [["type", "number"], ["min", min], ["value", "0"], ["step", step], ["max", max]]
    );
    element.addEventListener("input", function() {
      let value = Number(element.value);
      if (value < 0 || value == false) {
        element.value = 0;
        return;
      };
      element.value = Math.min(step === "0.1" ? calculate.floorToADecimal(value) : Math.floor(value), Number(element.max));
    });
    return element;
  }
};
//

//ITEMS
const item = {
  blank: new create.ItemObject(" ", 0, 0, "none", " "), // used for empty slots and resets

  armor: new create.ItemObject("armor", 5, 8, "utility", "armor.svg", true),
  clothes: new create.ItemObject("clothes", 2, 25, "utility", "clothes.svg", true),
  crystal: new create.ItemObject("crystal", 2, 15, "raw", "crystal.svg"),
  flour: new create.ItemObject("flour bag", 4.5, 20, "perishable", "flour.svg"),
  food: new create.ItemObject("food basket", 4, 13, "perishable", "food.svg"),
  gems: new create.ItemObject("gems", 1, 20, "raw", "gems.svg", true),
  gold: new create.ItemObject("gold ingot", 4, 15, "refined", "gold.svg"),
  iron: new create.ItemObject("iron ingot", 3, 15, "refined", "iron.svg"),
  ladder: new create.ItemObject("ladder", 3, 6, "utility", "ladder.svg"),
  log: new create.ItemObject("log", 5.5, 3, "raw", "log.svg"),
  medicine: new create.ItemObject("medicine", 1, 35, "utility", "medicine.svg", true),
  rock: new create.ItemObject("rock", 7.5, 3, "raw", "rock.svg"),
  rope: new create.ItemObject("rope", 2.5, 12, "utility", "rope.svg"),
  seeds: new create.ItemObject("seeds pack", 1.5, 15, "raw", "seeds.svg"),
  thread: new create.ItemObject("thread", 0.4, 40, "refined", "thread.svg"),
  tools: new create.ItemObject("tools", 2, 15, "utility", "tools.svg", true),
  weapons: new create.ItemObject("weapons", 3.5, 12, "utility", "weapons.svg", true),
  get allUsable() {
    let arrayOfUsables = [];
    for (let key in this) {
      if (
        key !== "allUsable" &&
        key !== "blank" &&
        key !== "type"
      ) arrayOfUsables.push(this[key]);
    };
    return arrayOfUsables;
  },
  type: {
    filteredByType: function(typeName) {
      return item.allUsable.filter(itemObject => itemObject.type === typeName);
    },
    get raw() {return this.filteredByType("raw")},
    get refined() {return this.filteredByType("refined")},
    get utility() {return this.filteredByType("utility")},
    get perishable() {return this.filteredByType("perishable")},
  },
};
//

//BOXES
const box = {
  storage: new create.BoxObject("storage", 10, 250),
  trash: new create.BoxObject("trash", 1, 999),
  shipments: new create.BoxObject("shipments", 6, 999),
};
Object.values(box).forEach(boxObject => {
  for (let i = 1; i <= boxObject.slotTotal; i++) {
    boxObject.slots.push(new create.SlotObject(boxObject));
  };
  Object.defineProperty(boxObject, "slotTotal", {
    get: function() {
      return Object.keys(boxObject.slots).length;
    },
  });
});
//

//UPGRADES
const upgrade = {
  test: new create.UpgradeObject("upgrade name",
    "a test upgrade used during development, increasing storage slots by 5",
    [[7, item.rope, 2], [8, item.log, 2], [9, item.rope, 2], [12, item.log, 2], [14, item.log, 2]],
    function() {
      order.slotQuantity.increase(box.storage, 5);
    }),

};
//

//CALCULATION TOOLKIT
const calculate = {
  roundToADecimal: function(number) {
    return Math.round(number * 10) / 10;
  },
  floorToADecimal: function(number) {
    return Math.floor(number * 10) / 10;
  },
  decimalRemainder: function(number) {
    return this.roundToADecimal(number % 1);
  },
  weightByCount: function(object, count) {
    return this.roundToADecimal(count * object.weight);
  },
  cappedAdditionByWeight: function(boxObject, itemObject, requestedAdditionValue) {
    if ((requestedAdditionValue * itemObject.weight) > boxObject.weight.available) {
      return this.floorToADecimal(boxObject.weight.available / itemObject.weight);
    };
    return requestedAdditionValue;
  },
  cappedSubtractionByCount: function(currentCountValue, requestedSubtractionValue){
    if ((0 - requestedSubtractionValue) > currentCountValue) {
      return 0 - currentCountValue;
    };
    return requestedSubtractionValue;
  },
};
//

//CONVERSION TOOLKIT
const infer = {
  slotIDByObject: function(slotObject) {
    let box = slotObject.parentBox;
    return "#" + box.baseSlotID + (box.slots.indexOf(slotObject) + 1);
  },
  objectOfSlotID: function(slotID) {
    return infer.boxOfSlotID(slotID).slots[infer.numberOfSlotID(slotID) - 1];
  },
  numberOfSlotID: function(slotID) {
    return Number(slotID.replace(/[^0-9]/g, ""));
  },
  numberOfSlotObject: function(slotObject) {
    return slotObject.parentBox.slots.indexOf(slotObject) + 1;
  },
  boxOfSlotID: function(slotID) {
    return box[slotID.split("S")[0].replace("#", "")];
  },
  slotObjectByBoxAndNumber: function(boxObject, number) {
    return boxObject.slots[number - 1];
  },
  slotIDByBoxAndNumber: function(boxObject, number) {
    return "#" + boxObject.baseSlotID + number;
  },
  elementBySlotObject: function(slotObject) {
    let slotID = this.slotIDByObject(slotObject);
    return document.querySelector(slotID);
  },
  HTMLAsNode: function(elementHTML) {
    temporaryContainer = document.createElement("div");
    temporaryContainer.innerHTML = elementHTML;
    return temporaryContainer.firstElementChild;
  },
};
//

//LOGIC TOOLKIST
const deduce = {
  compatibilityForAnyAddition: function(slotObject, itemObject) {
    let itemOfSlotID = slotObject.itemObject;
    let minimumValue = 0.1;

    let itemTypeCondition =
      itemOfSlotID === itemObject || itemOfSlotID === item.blank;
    ;
    let weightCapCondition =
      slotObject.parentBox.weight.sum + calculate.weightByCount(itemObject, minimumValue) <= slotObject.parentBox.weight.max
    ;
    if (itemTypeCondition && weightCapCondition && slotObject.parentBox === box.trash) return true;
    let stackCapCondition =
      slotObject.itemCount + minimumValue <= itemObject.stackCap * slotObject.capacityMultiplier
    ;
    return (itemTypeCondition && stackCapCondition && weightCapCondition);
  },
  nextCompatibleSlot: function(slotObject, itemObject) {
    let boxOfSlot = slotObject.parentBox;
    let numberOfInitialSlot = infer.numberOfSlotObject(slotObject);

    let slotNumber = numberOfInitialSlot;
    do {
      let slotInCheck = infer.slotObjectByBoxAndNumber(boxOfSlot, slotNumber);
      if (this.compatibilityForAnyAddition(slotInCheck, itemObject)) {
        return slotInCheck;
      };
      slotNumber + 1 <= boxOfSlot.slotTotal ? slotNumber++ : slotNumber = 1; 
    } while (slotNumber !== numberOfInitialSlot);

    return this.nextCompatibleTrashSlot(itemObject);
  },
  nextCompatibleTrashSlot: function(itemObject) {
    if (box.trash.slotTotal === 1) return infer.slotObjectByBoxAndNumber(box.trash, 1);
    
    function overrideLogic(slotObject, itemObject) {
      if (slotObject.itemObject !== item.blank && slotObject.itemObject !== itemObject) {
        box.trash.numberOfNextToOverride + 1 <= box.trash.slotTotal ? box.trash.numberOfNextToOverride++ : box.trash.numberOfNextToOverride = 1;
      };
    };

    let slotNumber = 1;
    do {
      let slotInCheck = infer.slotObjectByBoxAndNumber(box.trash, slotNumber);
      if (this.compatibilityForAnyAddition(slotInCheck, itemObject)) {
        overrideLogic(slotInCheck, itemObject);
        return slotInCheck;
      };
      slotNumber + 1 <= box.trash.slotTotal ? slotNumber++ : slotNumber = 1;
    } while (slotNumber !== 1);

    let nextSlotToOverride = infer.slotObjectByBoxAndNumber(box.trash, box.trash.numberOfNextToOverride);
    overrideLogic(nextSlotToOverride, itemObject);
    return nextSlotToOverride;
  },
};
//

//EDITING TOOLKIT
const edit = {
  slot: {
    element: {
      aspectText: function(slotElement, aspectClass, countValue) {
        let aspectElement = slotElement.querySelector(aspectClass);
        aspectElement.innerText = countValue;
        edit.element.hideIfFalsy(aspectElement, aspectElement.innerText && aspectElement.innerText != 0);
      },
      itemImage: function(slotElement, itemObject) {
        let imageElement = slotElement.querySelector(".itemImage");
    
        imageElement["src"] = itemObject === item.blank ? "" : core.pathToItemImages + "/" + itemObject.imageFile;
        imageElement["alt"] = itemObject.name;
        
        edit.element.hideIfFalsy(imageElement, itemObject != item.blank);
      },
      allAspects: function(slotElement, itemObject, countValue) {
        this.aspectText(slotElement, ".itemCount", countValue);
        this.aspectText(slotElement, ".slotWeight", calculate.weightByCount(itemObject, countValue));
        this.itemImage(slotElement, itemObject);
      },
    },
    object: {
      property: function(slotObject, objectProperty, value) {
        slotObject[objectProperty] = value;
      },
      allProperties: function(slotObject, itemObject, countValue) {
        this.property(slotObject, "itemObject", itemObject);
        this.property(slotObject, "itemCount", countValue);
        this.property(slotObject, "slotWeight", calculate.weightByCount(itemObject, countValue));
      },
    },
    whole: function(slotObject, itemObject, newCountValue) {
      let slotElement = infer.elementBySlotObject(slotObject)
  
      switch (newCountValue <= 0) {
        case true: {
          newCountValue = 0;
          itemObject = item.blank;
          slotElement.draggable = false;
          break;
        }
        default: {
          newCountValue = calculate.roundToADecimal(newCountValue);
          slotElement.draggable = true;
          break;
        }
      };

      this.object.allProperties(slotObject, itemObject, newCountValue);
      this.element.allAspects(slotElement, itemObject, newCountValue);    
    },
  },
  weight: {
    sum: function(boxObject, newWeightSum) {
      newWeightSum = calculate.roundToADecimal(newWeightSum);
      boxObject.weight.sum = newWeightSum;
      document.querySelector(`#${boxObject.weight.counterID} .sumWeight`).innerText = newWeightSum;
    },
    max: function(boxObject, newWeightCap) {
      boxObject.weight.max = newWeightCap;
      document.querySelector(`#${boxObject.weight.counterID} .maxWeight`).innerText = newWeightCap;
    },
  },
  element: {
    hideIfFalsy: function(element, evaluatedExpression) {
      evaluatedExpression ? element.classList.add("displayer") : element.classList.remove("displayer");
    },
    appendLineBreak: function(element) {
      let breakElement = document.createElement("br");
      element.appendChild(breakElement);
    },
    massAttribution: function(element, ArrayOfAttributeValuePairs) {
      ArrayOfAttributeValuePairs.forEach(AttributeValuePair =>
        element.setAttribute(AttributeValuePair[0], AttributeValuePair[1])
      );
    },
  },
  slotAndAdjustWeight: function(slotObject, itemObject, newCountValue) {
    edit.weight.sum(slotObject.parentBox, slotObject.parentBox.weight.sum - slotObject.slotWeight + calculate.weightByCount(itemObject, newCountValue));
    edit.slot.whole(slotObject, itemObject, newCountValue);
  }
};
//

//COHESIVE FUNCTIONALITIES
const order = {
  slotContents: {
    empty: function(slotObject) {
      edit.slotAndAdjustWeight(slotObject, item.blank, 0);
    },
    set: function(slotObject, itemObject, newCountValue) {  
      let boxOfSlot = slotObject.parentBox;

      if (newCountValue <= 0 || itemObject === item.blank) {
        this.empty(slotObject);
        return;
      };
    
      let itemCapacity = itemObject.stackCap * slotObject.capacityMultiplier;
      if (newCountValue > itemCapacity && boxOfSlot !== box.trash) {
        newCountValue = itemCapacity;
      };
  
      this.empty(slotObject);
      newCountValue = calculate.cappedAdditionByWeight(boxOfSlot, itemObject, newCountValue);
      edit.slotAndAdjustWeight(slotObject, itemObject, newCountValue);
    },
    addAndOverflow: function(slotObject, itemObject, addedCountValue) {
      if (itemObject === item.blank) {
        return;
      };
    
      while (addedCountValue > 0) {
        let targetSlot = deduce.nextCompatibleSlot(slotObject, itemObject);
        let boxOfSlot = targetSlot.parentBox;
  
        addedCountValue = calculate.roundToADecimal(addedCountValue);
        
        if (targetSlot.parentBox === box.trash) {
          this.set(targetSlot, itemObject, targetSlot.itemCount + addedCountValue);
          return;
        };
        
        let viableSlotAddition = Math.min(
          addedCountValue,
          itemObject.stackCap * slotObject.capacityMultiplier - targetSlot.itemCount,
          calculate.cappedAdditionByWeight(boxOfSlot, itemObject, addedCountValue)
        );
        this.set(targetSlot, itemObject, targetSlot.itemCount + viableSlotAddition);
        addedCountValue -= viableSlotAddition;
      };
    },
    decrease: function(slotObject, reductionValue) {
      let itemCount = slotObject.itemCount;
      if (reductionValue >= itemCount) {
        this.empty(slotObject);
        return;
      };
      this.set(slotObject, slotObject.itemObject, itemCount - reductionValue);
    },
    spendIfStored: function(arrayOfCosts) {
      let storageSlots = box.storage.slots;
      let arrayOfSpendableCosts = [];
      arrayOfSpendableCosts.length = 0;

      for (let i = storageSlots.length; i > 0 ; i--) {
        let slotObject = storageSlots[i - 1];

        for (let costItemAndAmount in arrayOfCosts) {
          let costItem = costItemAndAmount[0];
          let costAmount = costItemAndAmount[1];

          if (slotObject.itemObject !== costItem) {
            continue;
          };
          if (slotObject.itemCount >= costAmount) {
            arrayOfSpendableCosts.push([slotObject, costAmount]);
            arrayOfCosts.splice(arrayOfCosts.indexOf(costItemAndAmount), 1);
            break;
          };
          arrayOfSpendableCosts.push([slotObject, slotObject.itemCount]);
          costItemAndAmount[1] = costAmount - slotObject.itemCount;
        };
      };
      if (!arrayOfCosts[0]) {
        arrayOfSpendableCosts.forEach(slotSpendings => {
          order.slotContents.decrease(infer.slotIDByObject(slotSpendings[0]), slotSpendings[1]);
        });
        return true;
      };
      return false;
    },
    // spendFromRespectiveSlots: function(arrayOfSlotIDsWithRespectiveCosts) {

    // },
    transfer: function(initialSlotObject, transferCountValue, targetSlotObject) {
      let itemOfInitialSlot = initialSlotObject.itemObject;
      let itemOfTargetSlot = targetSlotObject.itemObject;
    
      if (transferCountValue <= 0 || itemOfInitialSlot === item.blank || initialSlotObject === targetSlotObject) {
        return;
      };
      
      if (transferCountValue > initialSlotObject.itemCount) {
        transferCountValue = initialSlotObject.itemCount;
      };
      
      if (initialSlotObject.parentBox !== targetSlotObject.parentBox && targetSlotObject.parentBox !== box.trash) {
        transferCountValue = calculate.cappedAdditionByWeight(targetSlotObject.parentBox, itemOfInitialSlot, transferCountValue);
      };
  
      this.set(initialSlotObject, itemOfInitialSlot, initialSlotObject.itemCount - transferCountValue);
  
      if (itemOfTargetSlot !== itemOfInitialSlot && itemOfTargetSlot !== item.blank) {
        this.transferToTrash(targetSlotObject);
      };
      
      if (targetSlotObject.parentBox === box.trash) {
        itemOfInitialSlot === itemOfTargetSlot ? this.addAndOverflow(targetSlotObject, itemOfInitialSlot, transferCountValue) : this.set(targetSlotObject, itemOfInitialSlot, transferCountValue);
        return;
      };
      this.addAndOverflow(targetSlotObject, itemOfInitialSlot, transferCountValue);
    },
    transferToTrash: function(slotObject) {
      this.transfer(slotObject, slotObject.itemCount, deduce.nextCompatibleTrashSlot(slotObject.itemObject));
    },
    transferFromTrash: function(slotObject) {
      if (slotObject.parentBox !== box.trash) {
        return;
      };
      let firstSlotOfstorage = infer.slotObjectByBoxAndNumber(box.storage, 1);
      this.transfer(slotObject, slotObject.itemCount, deduce.nextCompatibleSlot(firstSlotOfstorage, slotObject.itemObject));
    },
  },
  slotQuantity: {
    increase: function(boxObject, creationAmount) {
      for (let i = 0; i < creationAmount; i++) {
        let newSlotNumber = boxObject.slots.length + 1;
        boxObject.slots.push(new create.SlotObject(boxObject));
        document.querySelector(`#${boxObject.elementID} .slotContainer`).appendChild(
          create.slotElement(boxObject.baseSlotID + newSlotNumber, true, true)
        );
      };
    },
    decrease: function(boxObject, removalAmount) {
      for (let i = removalAmount; i > 0; i--) {
        if (!boxObject.slots[1]) break;
        boxObject.slots.pop();
        document.querySelector(`#${boxObject.elementID} .slotContainer`).lastChild.remove();
      };
    },
  },
  boxWeightCap: {
    increase: function(boxObject, increaseAmount) {
      edit.weight.max(boxObject, boxObject.weight.max + increaseAmount);
    },
    decrease: function(boxObject, decreaseAmount) {
      let initialMax = boxObject.weight.max;
      let targetMax = initialMax - decreaseAmount;
      if (targetMax < 10) targetMax = 10;

      if (targetMax >= boxObject.weight.sum) {
        edit.weight.max(boxObject, targetMax);
        return;
      };

      for (let i = boxObject.slots.length; i > 0; i--) {
        let slotObject = boxObject.slots[i - 1];
        let weightSum = boxObject.weight.sum;

        if (weightSum - slotObject.slotWeight > targetMax) {
          order.slotContents.empty(slotObject);
          continue;
        };

        let excessWeight = weightSum - targetMax;
        let excessSlotItems = excessWeight / slotObject.itemObject.weight;
        order.slotContents.decrease(slotObject, excessSlotItems);
      };
      edit.weight.max(boxObject, targetMax);
    },
  },
};
//

//SELECTION AND PREVIEW KIT
const dynamicPreviewKit = {
  inputElement: function (inputType, labelTruthiness) {
    function labelElement(labelTitle, inputElement) {
      let labelElement = document.createElement("label");
      labelElement.innerText = labelTitle;
      labelElement.appendChild(inputElement);
      return labelElement;
    };
    
    let inputElement;
    let labelText
    switch (inputType) {
      case "slotCategory": {
        inputElement = document.createElement("select");
        inputElement.className = "dialogueSlotCategorySelection";

        Object.values(box).forEach(slotCategory => {
          inputElement.appendChild(create.option(slotCategory.name));
        });
        
        labelText = "Category";
        break;
      }
      case "slotNumber": {
        inputElement = document.createElement("select");
        inputElement.className = "dialogueSlotNumberSelection";

        for (i = 1; i <= box.storage.slotTotal; i++) {
          inputElement.appendChild(create.option(i));
        };

        labelText = "Slot";
        break;
      }
      case "items": {
        inputElement = document.createElement("select");
        inputElement.className = "dialogueItemSelection";

        item.allUsable.forEach(itemObject => {
          inputElement.appendChild(create.option(itemObject.name.split(" ")[0], itemObject.name)); // using the first word of each item name will become a bad idea if/once items will contain adjectives (regardless of whether said adjective is a prefix or suffix)
        });

        labelText = "Item";
        break;
      }
      case "amountInput": {
        inputElement = document.createElement("input");
        edit.element.massAttribution(inputElement,
          [["type", "number"], ["class", "dialogueAmountInput"], ["min", "0"], ["max", "999"]]
        );

        labelText = "Amount";
        break;
      };
      // case "amountRange": {
      //   let inputElement = document.createElement("input");
      //   inputElement.className = "dialogueAmountRange"; 

      //   edit.element.massAttribution(inputElement,
      //     [["type", "range"], ["class", "dialogueAmountRange"], ["min", "0"], ["value", "0"], ["max", "0"]]
      //   ); 

      //   break;
    };
    if (labelTruthiness) {
      return labelElement(labelText, inputElement);
    };
    return inputElement;
  },
  query: {
    categorySelectionElement: function(previewSectionElement) {
      return previewSectionElement.querySelector(".dialogueSlotCategorySelection");
    },
    slotNumberSelectionElement: function(previewSectionElement) {
      return previewSectionElement.querySelector(".dialogueSlotNumberSelection");
    },
    selectedSlotID: function(previewSectionElement) {
      return `#${dynamicPreviewKit.query.categorySelectionElement(previewSectionElement).value}Slot${dynamicPreviewKit.query.slotNumberSelectionElement(previewSectionElement).value}`;
    },
    selectedSlotObject: function(previewSectionElement) { 
      let boxName = dynamicPreviewKit.query.categorySelectionElement(previewSectionElement).value;
      let slotNumber = dynamicPreviewKit.query.slotNumberSelectionElement(previewSectionElement).value;
      return infer.slotObjectByBoxAndNumber(box[boxName], slotNumber);
    },
    itemSelectionElement: function(previewSectionElement) {
      return previewSectionElement.querySelector(".dialogueItemSelection");
    },
    amountInputElement: function(previewSectionElement) {
      return previewSectionElement.querySelector(".dialogueAmountInput");
    },
    // amountRangeElement: function(previewSectionElement) {
    //   return previewSectionElement.querySelector(".dialogueAmountRange");
    // },
    sectionElementOfSelectionEvent: function(event) {
      return event.target.parentElement.parentElement.parentElement;
    },
  },
  update: {
    slotNumbersByCategory: function(previewSectionElement) {
      let slotSelectElement = dynamicPreviewKit.query.slotNumberSelectionElement(previewSectionElement);
      let selectedCategoryObject = box[dynamicPreviewKit.query.categorySelectionElement(previewSectionElement).value];
      
      function addAscendingSlotOption(previousSlotNumber) {
        slotSelectElement.appendChild(create.option(previousSlotNumber + 1));
      };
      if (!slotSelectElement.lastElementChild) {
        addAscendingSlotOption(0);
      };

      function largestSelectionNumber() {
        return Number(slotSelectElement.lastElementChild.value);
      };
      while (selectedCategoryObject.slotTotal != largestSelectionNumber()) {
        if (selectedCategoryObject.slotTotal > largestSelectionNumber()) {
          addAscendingSlotOption(largestSelectionNumber());
          continue;
        };
        slotSelectElement.lastElementChild.remove();
      };
    },
    slotPreviewByCategoryAndNumber: function (previewSectionElement) {
      let slotObject = dynamicPreviewKit.query.selectedSlotObject(previewSectionElement);
      edit.slot.element.allAspects(previewSectionElement.querySelector(".containerSlot"), slotObject.itemObject, slotObject.itemCount);
    },
  },
  element: function(IDsPrefix, sectionType) {
    let kitElement = document.createElement("section");
    kitElement.id = IDsPrefix + "Section";

    let slotElement = create.slotElement(IDsPrefix + "Slot", false, false);
    kitElement.appendChild(slotElement);

    let sectionModifier;
    if (sectionType.includes("_")) {
      sectionModifier = sectionType.split("_")[1];
      sectionType = sectionType.split("_")[0];
    };

    function newSelectionSection(prefix, arrayOfInputTypes) {
      let selectionSection = document.createElement("div");
      selectionSection.id = prefix + "Selection";
      selectionSection.className = "dialogueSelectionSection";

      arrayOfInputTypes.forEach(inputType => {
        selectionSection.appendChild(dynamicPreviewKit.inputElement(inputType, true));
      });

      return selectionSection;
    };

    switch (sectionType) {
      case "showSelectedSlot": {
        let selectionSection = newSelectionSection(IDsPrefix + "Top", ["slotCategory", "slotNumber"]);
        if (sectionModifier === "depositable") {
          let categoriesElement = this.query.categorySelectionElement(selectionSection); 
          categoriesElement.querySelector(`[value="${box.shipments.name}"]`).remove();
        };
        kitElement.insertAdjacentElement("afterbegin", selectionSection);

        function categorySelectionAdjustments(event) {
          let previewSectionElement = dynamicPreviewKit.query.sectionElementOfSelectionEvent(event);
          dynamicPreviewKit.update.slotNumbersByCategory(previewSectionElement);
          dynamicPreviewKit.update.slotPreviewByCategoryAndNumber(previewSectionElement);
        };
        dynamicPreviewKit.query.categorySelectionElement(selectionSection).addEventListener("input", function(event) {
          categorySelectionAdjustments(event)
        });

        function slotNumberSelection(event) {
          let previewSectionElement = dynamicPreviewKit.query.sectionElementOfSelectionEvent(event);
          dynamicPreviewKit.update.slotPreviewByCategoryAndNumber(previewSectionElement);
        };
        dynamicPreviewKit.query.slotNumberSelectionElement(selectionSection).addEventListener("input", function(event) {
          slotNumberSelection(event)
        });
        break;
      }
      case "showAdditionTotal": {
        kitElement.insertAdjacentElement("afterbegin",
          newSelectionSection(IDsPrefix + "Top", ["items", "amountInput"])
        );
        kitElement.insertAdjacentElement("beforeend",
          newSelectionSection(IDsPrefix + "Bottom", ["slotCategory"])
        );

        let itemSelectionElement = dynamicPreviewKit.query.itemSelectionElement(kitElement);
        let amountInputElement = dynamicPreviewKit.query.amountInputElement(kitElement);
    
        function updatePreview() {
          edit.slot.element.allAspects(slotElement, item[itemSelectionElement.value], amountInputElement.value);
        };
        function resetPreview() {
          edit.slot.element.allAspects(slotElement, item.blank, 0);
        };
    
        itemSelectionElement.addEventListener("input", function itemSelection() {
          if (amountInputElement.value != 0) {
            updatePreview();
          };
        });
        amountInputElement.addEventListener("input", function amountInput() {
          if (amountInputElement.value < 0 || amountInputElement.value >= 1000) {
            amountInputElement.value = 0;
          };
          if (amountInputElement.value == 0) {
            resetPreview();
            return;
          };
          amountInputElement.value = calculate.floorToADecimal(amountInputElement.value);
          updatePreview();
        });
        break;
      };
    };
    return kitElement;
  },
};

//MENUS
const menu = {
  methods: {
    appendDimmer: function() {
      let dimmer = document.createElement("div");
      dimmer.id = "dimmer";
      dimmer.tabIndex = 0;
      document.body.appendChild(dimmer);
  
      menu.methods.appendDimmer = function() {
        document.body.appendChild(dimmer);
      };
    },
    blurAll: function() {
      document.querySelectorAll("dialog").forEach(element =>
        element.blur()
      );
    },
    framework: function(menuObject, dimmerTruthiness) {
      this.blurAll();
      if (dimmerTruthiness) this.appendDimmer();
  
      let dialogueElement = document.createElement("dialog");
      dialogueElement.open = true;
      dialogueElement.id = menuObject.id;
      dialogueElement.tabIndex = 0;
  
      dialogueElement.addEventListener("focusout", function removeDialogue(event) {
        if (dialogueElement.contains(event.relatedTarget)) {
          return;
        };
        dialogueElement.remove();
        if (dimmerTruthiness) {
          document.querySelector("#dimmer").remove();
        };
      });
  
      new MutationObserver(function(mutations, observer) {
        let addedElement = mutations[0].addedNodes[0];
        addedElement.focus();
  
        observer.disconnect();
      }).observe(document.body, {
        childList: true,
      });
  
      return dialogueElement;
    },
  },
  slotContext: {
    id: "slotContextMenu",
    appendInfoText: function(element, infoText) {
      element.appendChild(document.createElement("br"));
      element.appendChild(document.createTextNode(infoText));
    },
    slotInfo: function(slotObject) {
      let element = document.createElement("section");
      element.className = this.id + "-section";

      let title = document.createElement("h5");
      title.innerText = `${slotObject.parentBox.name} slot ${infer.numberOfSlotObject(slotObject)}`;
      element.appendChild(title);

      if (slotObject.capacityMultiplier !== 1) {
        element.appendChild(document.createElement("hr"));
        element.appendChild(document.createTextNode(
          `capacity: ${slotObject.capacityMultiplier * 100}%`
        ));
      };

      return element;
    },
    itemInfo: function(itemObject) {
      let element = document.createElement("section");
      element.className = this.id + "-section";

      let itemName = document.createElement("u");
      itemName.innerText = itemObject.name;
      if (!itemObject.pluralTruthiness) itemName.innerText += "s";
      element.appendChild(itemName);

      this.appendInfoText(element,
        "slot limit: " + itemObject.stackCap
      );
      this.appendInfoText(element,
        "weight each: " + itemObject.weight
      );
      this.appendInfoText(element,
        "type: " + itemObject.type
      );

      return element;
    },
    button: function(functionCase, slotObject) {
      function createButtonDataObject(ID, text, clickFunction) {
        return buttonData = {
          ID,
          text,
          clickFunction
        };
      };
      switch (functionCase) {
        case "transfer": {
          createButtonDataObject(
            this.id + "transferButton",
            "transfer items",
            function() {
              menu.dialogue.transfer(slotObject);
            },
          );
          break;
        };
        case "toTrash": {
          createButtonDataObject(
            this.id + "-trashButton",
            "send to trash",
            function() {
              document.activeElement.blur();
              order.slotContents.transferToTrash(slotObject);
            }
          );
          break;
        };
        case "fromTrash": {
          createButtonDataObject(
            this.id + "-trashButton",
            "restore trash",
            function() {
              document.activeElement.blur();
              order.slotContents.transferFromTrash(slotObject);
            }
          );
          break;
        };
        case "empty": {
          createButtonDataObject(
            this.id + "-emptyButton",
            "empty slot",
            function() {
              document.activeElement.blur();
              order.slotContents.empty(slotObject);
            }
          );
          break;
        };
      };
      let buttonElement = document.createElement("button");
      buttonElement.id = buttonData.ID;
      buttonElement.innerText = buttonData.text;
      buttonElement.addEventListener("click", buttonData.clickFunction);
      return buttonElement;
    },
    setPosition: function(event) {
      let element = document.querySelector("#" + this.id);
      let cursorXPosition = event.clientX + window.scrollX;
      let cursorYPosition = event.clientY + window.scrollY;
      element.style.left = cursorXPosition + "px";
      element.style.top = cursorYPosition + "px";

      let cappedPositionBuffer = 1; // without this buffer being removed in calculations the element can occassionally be an extra pixel or so over the intended value (which is irritating in cases when this causes the scroll bar to appear). i suspected that it was caused by decimal values on the X & Y values, but that's apparently not the case because Math.floor didn't fix this
      function capPositionByViewport(viewportAxisLength, elementAxisLength, scrollAxisDistance) {
        return (viewportAxisLength - elementAxisLength + scrollAxisDistance - cappedPositionBuffer + "px"); 
      };
      let viewportXLimit = Math.min(document.body.clientWidth, window.innerWidth);
      let viewportYLimit = Math.min(document.body.clientHeight, window.innerHeight);
      if (element.offsetLeft + element.offsetWidth > viewportXLimit + scrollX - cappedPositionBuffer) {
        element.style.left = capPositionByViewport(viewportXLimit, element.offsetWidth, scrollX);
      };
      if (element.offsetTop + element.offsetHeight > viewportYLimit + scrollY - cappedPositionBuffer) {
        element.style.top = capPositionByViewport(viewportYLimit, element.offsetHeight, scrollY);
      };
    },
    slot: function(event) {
      let contextMenuElement = menu.methods.framework(this, false);
      let slotObject = infer.objectOfSlotID(event.currentTarget.id);

      contextMenuElement.appendChild(this.slotInfo(slotObject));

      if (slotObject.itemObject !== item.blank) {
        contextMenuElement.appendChild(this.itemInfo(slotObject.itemObject));

        contextMenuElement.appendChild(this.button("transfer", slotObject));
        switch (slotObject.parentBox) {
          case box.trash: {
            contextMenuElement.appendChild(this.button("fromTrash", slotObject));
            contextMenuElement.appendChild(this.button("empty", slotObject));
            break;
          }
          default: {
            contextMenuElement.appendChild(this.button("toTrash", slotObject));
            break;
          }
        };
      };

      document.body.appendChild(contextMenuElement);
      this.setPosition(event);
    },
  },
  dialogue: {
    id: "dialogueMenu",
    message: function(messageTitle, messageText) {
      let dialogueElement = menu.methods.framework(this, true);

      let title = document.createElement("h1");
      title.id = "messageTitle";
      dialogueElement.appendChild(title);

      let innerText = document.createTextNode("");
      dialogueElement.appendChild(innerText);

      function updateAndAppendDialogue(messageTitle, messageText) {
        document.body.appendChild(dialogueElement);
        title.innerText = messageTitle;
        innerText.nodeValue = messageText;
      };
      updateAndAppendDialogue(messageTitle, messageText);

      menu.dialogue.message = function(messageTitle, messageText) {
        menu.methods.appendDimmer();
        updateAndAppendDialogue(messageTitle, messageText);

        dialogueElement.focus();
      };
    },
    transfer: function(initialSlotObject, targetSlotObject) {
      let dialogueElement = menu.methods.framework(this, true);
      
      let title = document.createElement("h1");
      title.innerText = "TRANSFER";
      dialogueElement.appendChild(title);

      let slotSelectionBox = document.createElement("div");
      slotSelectionBox.id = "transferBox";
      dialogueElement.appendChild(slotSelectionBox);

      let transferMiddleSection = document.createElement("section");
      transferMiddleSection.id = "transferMiddleSection";
      slotSelectionBox.appendChild(transferMiddleSection);

      let transferQuantityInput = create.numberInputWithFunctioningLimits("0", "0.1", "0");
      transferMiddleSection.appendChild(transferQuantityInput);

      let transferSectionImage = document.createElement("img");
      edit.element.massAttribution(transferSectionImage,
        [["src", core.pathToInterfaceImages + "/rightwardArrow.svg"], ["alt", "arrow from initial slot to target slot"], ["draggable", "false"]]
      );
      transferMiddleSection.appendChild(transferSectionImage);

      [["All", function() {return Number(transferQuantityInput.max)}],
      ["Half", function() {return Number(transferQuantityInput.max)/2}]].forEach(buttonSetupArray => {
        let button = document.createElement("button");
        button.innerText = buttonSetupArray[0];
        button.addEventListener("click", function() {
          transferQuantityInput.value = calculate.floorToADecimal(buttonSetupArray[1]());
        });
        transferMiddleSection.appendChild(button);
      });

      let initialSlotSection = dynamicPreviewKit.element("transferInitial", "showSelectedSlot");
      let targetSlotSection = dynamicPreviewKit.element("transferTarget", "showSelectedSlot_depositable");
      slotSelectionBox.insertAdjacentElement("afterbegin", initialSlotSection);
      slotSelectionBox.insertAdjacentElement("beforeend", targetSlotSection);

      [dynamicPreviewKit.query.categorySelectionElement(initialSlotSection),
      dynamicPreviewKit.query.slotNumberSelectionElement(initialSlotSection)].forEach(selectionElement =>
        selectionElement.addEventListener("input", function() {
          let objectOfSlot = dynamicPreviewKit.query.selectedSlotObject(initialSlotSection);
          transferQuantityInput.max = objectOfSlot.itemCount;
          transferQuantityInput.value = Math.min(Number(transferQuantityInput.value), objectOfSlot.itemCount);
        }
      ));
      
      let confirmButton = document.createElement("button");
      confirmButton.id = "transferConfirmButton";
      confirmButton.innerText = "CONFIRM TRANSFER";
      confirmButton.addEventListener("click", function() {
        let finalTransferValue = Number(transferQuantityInput.value);
        let finalInitialSlot = dynamicPreviewKit.query.selectedSlotObject(initialSlotSection);
        let finalTargetSlot = dynamicPreviewKit.query.selectedSlotObject(targetSlotSection);

        if (finalTransferValue === 0) {
          new MutationObserver(function() {
            menu.dialogue.message("TRANSFER FAILED", "Transfer value was at 0");
            this.disconnect();
          }).observe(document.body, {
            childList: true,
          });

          confirmButton.blur();
          return;
        };

        confirmButton.blur();
        order.slotContents.transfer(finalInitialSlot, finalTransferValue , finalTargetSlot);
      });
      dialogueElement.appendChild(confirmButton);


      function dispatchInputAtSelections(previewSectionElement) { // input event updates the dynamicPreviewKit's slot preview
        [dynamicPreviewKit.query.categorySelectionElement(previewSectionElement),
        dynamicPreviewKit.query.slotNumberSelectionElement(previewSectionElement)].forEach(selectionElement =>
          selectionElement.dispatchEvent(new Event("input"))
        );
      };
      function setTransferSlot(previewSectionElement, slotObject) {
        dynamicPreviewKit.query.categorySelectionElement(previewSectionElement).value = slotObject.parentBox.name;
        dynamicPreviewKit.query.slotNumberSelectionElement(previewSectionElement).value = infer.numberOfSlotObject(slotObject);
        dispatchInputAtSelections(previewSectionElement);
      };
      function updateAndAppendDialogue(initialSlotObject, targetSlotObject) {
        transferQuantityInput.value = 0;

        [[initialSlotSection, initialSlotObject], [targetSlotSection, targetSlotObject]].forEach(sectionAndSlotObject => {
          if (sectionAndSlotObject[1]) {
            setTransferSlot(sectionAndSlotObject[0], sectionAndSlotObject[1]);
            return;
          };
          dispatchInputAtSelections(sectionAndSlotObject[0]);
        });

        document.body.appendChild(dialogueElement);
      };
      updateAndAppendDialogue(initialSlotObject, targetSlotObject);

      menu.dialogue.transfer = function(initialSlotObject, targetSlotObject) {
        menu.methods.appendDimmer();
        updateAndAppendDialogue(initialSlotObject, targetSlotObject);

        dialogueElement.focus();
      };
    },
    // crafting: function() {
    //   let dialogueElement = menu.methods.framework(this, true);

    //   let title = document.createElement("h1");
    //   title.innerText = "CRAFTING";
    //   dialogueElement.appendChild(title);

    //   let craftingNavigationAndSelectionSection = document.createElement("div");
    //   dialogueElement.appendChild(craftingNavigationAndSelectionSection);

    //   let craftingCategoriesNavigation = document.createElement("section");
    //   dialogueElement.appendChild(craftingCategoriesNavigation);

    //   let craftingButtonsSection = document.createElement("div");
    //   dialogueElement.appendChild(craftingButtonsSection);
    // },
    dashboard: function() {
      let dialogueElement = menu.methods.framework(this, true);

      let title = document.createElement("h1");
      title.innerText = "DASHBOARD";
      dialogueElement.appendChild(title);

      let tableOfBoxes = document.createElement("table");
      topTableRow = document.createElement("tr");
      topTableRow.appendChild(document.createElement("td"));
      function appendTableHeader(text) {
        let element = document.createElement("th");
        element.innerText = text;
        element.innerHTML = text.replace(" ", "<br>");
        topTableRow.appendChild(element);
      };
      appendTableHeader("slots quantity");
      appendTableHeader("weight capacity");
      tableOfBoxes.appendChild(topTableRow);
      Object.values(box).forEach(boxObject => {
        let boxTableRow = document.createElement("tr");

        let boxHeader = document.createElement("th");
        boxHeader.innerText = boxObject.name;
        boxTableRow.appendChild(boxHeader);

        let boxTableSlotCount = document.createElement("td");
        let slotCountInput = create.numberInputWithFunctioningLimits(1, 1, 500);
        slotCountInput.value = boxObject.slots.length;
        slotCountInput.addEventListener("change", function() { // i usually use "input" for responsiveness, but using it here means annoying situations e.g trying to turn a 10 into 15 by deleting the number 0 and typing a 5 in its place, but deleting the 0 sets the slot count to 1 thus wiping all of those slots with their associated items/upgrades
          let slotCountChange = slotCountInput.value - boxObject.slots.length;

          if (slotCountChange > 0) {
            order.slotQuantity.increase(boxObject, slotCountChange);
            return;
          };
          order.slotQuantity.decrease(boxObject, Math.abs(slotCountChange));
        });
        boxTableSlotCount.appendChild(slotCountInput);
        boxTableRow.appendChild(boxTableSlotCount);

        let boxTableWeightCap = document.createElement("td");
        let weightCapInput = create.numberInputWithFunctioningLimits(10, 1, 10000);
        weightCapInput.value = boxObject.weight.max;
        weightCapInput.addEventListener("change", function() { // i usually use "input" for responsiveness, but using it here means annoying situations e.g trying to turn a 10 into 15 by deleting the number 0 and typing a 5 in its place, but deleting the 0 sets the slot count to 1 thus wiping all of those slots with their associated items/upgrades
          let weightCapChange = weightCapInput.value - boxObject.weight.max;
          console.log(weightCapChange)

          if (weightCapChange > 0) {
            order.boxWeightCap.increase(boxObject, weightCapChange);
            return;
          };
          order.boxWeightCap.decrease(boxObject, Math.abs(weightCapChange));
        });
        boxTableWeightCap.appendChild(weightCapInput);
        boxTableRow.appendChild(boxTableWeightCap);

        tableOfBoxes.appendChild(boxTableRow);
      });
      dialogueElement.appendChild(tableOfBoxes);

      function detailsTemplate(summaryText) {
        let detailsElement = document.createElement("details");
        detailsElement.className = "contentBox";
        let summaryElement = document.createElement("summary");
        summaryElement.innerText = summaryText;
        detailsElement.appendChild(summaryElement);
        return detailsElement;
      };

      let addItemsDetails = detailsTemplate("Add Items");
      let addItemsSelectionKit = dynamicPreviewKit.element("dashboardAddItems", "showAdditionTotal");
      addItemsDetails.appendChild(addItemsSelectionKit);
      let addItemsConfirmButton = document.createElement("button");
      addItemsConfirmButton.id = "dashboardAddItemsConfirm";
      addItemsConfirmButton.innerText = "ADD ITEMS";
      addItemsConfirmButton.addEventListener("click", function confirmAddition() {
        let selectedItem = item[dynamicPreviewKit.query.itemSelectionElement(addItemsSelectionKit).value];
        let typedAmount = Number(dynamicPreviewKit.query.amountInputElement(addItemsSelectionKit).value);
        let selectedSlotCategory = box[dynamicPreviewKit.query.categorySelectionElement(addItemsSelectionKit).value];

        order.slotContents.addAndOverflow(infer.slotObjectByBoxAndNumber(selectedSlotCategory, 1), selectedItem, typedAmount);

        let amountInputElement = dynamicPreviewKit.query.amountInputElement(addItemsSelectionKit);
        amountInputElement.value = "";
        amountInputElement.dispatchEvent(new Event("input"));
      });
      addItemsDetails.appendChild(addItemsConfirmButton);
      dialogueElement.appendChild(addItemsDetails);

      let manageSlotCapacitiesDetails = detailsTemplate("Change Slot Capacity");
      let slotCapacitySelectionSection = document.createElement("div");
      slotCapacitySelectionSection.classList = "dialogueSelectionSection";
      let capacityCategorySection = dynamicPreviewKit.inputElement("slotCategory", true);
      let capacitySlotNumberSection = dynamicPreviewKit.inputElement("slotNumber", true);
      let capacityMultiplierInputSection = dynamicPreviewKit.inputElement("amountInput", true);
      capacityMultiplierInputSection.childNodes[0].nodeValue = "Multiplier";
      [capacityCategorySection, capacitySlotNumberSection, capacityMultiplierInputSection].forEach(element =>
        slotCapacitySelectionSection.appendChild(element)
      );
      let capacityMultiplierInputElement = dynamicPreviewKit.query.amountInputElement(slotCapacitySelectionSection);
      function adjustMultiplierInputElement() {
        let selectedSlotObject = dynamicPreviewKit.query.selectedSlotObject(slotCapacitySelectionSection);
        capacityMultiplierInputElement.value = selectedSlotObject.capacityMultiplier;
      };
      adjustMultiplierInputElement();
      capacityCategorySection.addEventListener("input", function(event) {
        let sectionElement = dynamicPreviewKit.query.sectionElementOfSelectionEvent(event);
        dynamicPreviewKit.update.slotNumbersByCategory(sectionElement);
        adjustMultiplierInputElement();
      });
      capacitySlotNumberSection.addEventListener("input", adjustMultiplierInputElement);
      capacityMultiplierInputElement.addEventListener("change", function() {
        let selectedSlotObject = dynamicPreviewKit.query.selectedSlotObject(slotCapacitySelectionSection);
        selectedSlotObject.capacityMultiplier = Number(capacityMultiplierInputElement.value);
      });
      manageSlotCapacitiesDetails.appendChild(slotCapacitySelectionSection);
      dialogueElement.appendChild(manageSlotCapacitiesDetails);

      let craftingGridTestButton = document.createElement("button");
      craftingGridTestButton.innerText = "Crafting Grid (see planned features)";
      craftingGridTestButton.addEventListener("click", function(event) {
        craftingGrid.complete([]);
      });
      dialogueElement.appendChild(craftingGridTestButton);
      
      document.body.appendChild(dialogueElement);

      menu.dialogue.dashboard = function() {
        dialogueElement.querySelectorAll("details").forEach(detailsElement =>
          detailsElement.open = false
        );
        menu.methods.appendDimmer();
        document.body.appendChild(dialogueElement);
        dialogueElement.focus();
      };
    },
  },
};
//

//CRAFTING GRID
const craftingGrid = {
  basicElement: function() {
    let grid = document.createElement("div");
    grid.id = "craftingGrid";
    grid.tabIndex = 0;

    for (let i = 1; i <= 25 ; i++) {
      let newLense = document.createElement("div");
      newLense.classList = "containerSlot craftingLense";
      grid.appendChild(newLense);
    };
    
    return grid;
  },
  lense: {
    on: function(lenseElement) {
      lenseElement.classList.remove("lenseOff");
      lenseElement.classList.add("lenseOn");

      // something with .getBoundingClientRect() maybe?

    },
    off: function(lenseElement) {
      lenseElement.classList.remove("lenseOn");
      lenseElement.classList.add("lenseOff");
    },
  },
  updateGridBy: {
    detailsArray: function(gridElement, craftingDetails) {
      

    },
    dialogueSelection: function(gridElement){

    },
  },
  complete: function(eventOrCraftingInfo) {
    let grid = this.basicElement();

    function centerGridOnCursor(event) {
      grid.style.left = event.clientX - (grid.offsetWidth / 2) + "px";
      grid.style.top = event.clientY - (grid.offsetHeight / 2) + "px";
    };

    function appendAndUpdateGrid(eventOrCraftingInfo) {
      document.body.appendChild(grid);
      grid.focus();

      // switch (Array.isArray(eventOrCraftingInfo)) {
      //   case true: {
      //     this.updateGridBy.gridDetailsArray(eventOrCraftingInfo);
      //     break;
      //   }
      //   default: {
      //     this.updateGridby.dialogueSelection(eventOrCraftingInfo);
      //   }
      // };

      let centeringEventBeforeMousemove = new MouseEvent("mousemove", {
        clientX: window.innerWidth / 2, 
        clientY: window.innerHeight / 2
      });
      centerGridOnCursor(centeringEventBeforeMousemove);
      window.addEventListener("mousemove", centerGridOnCursor);

      //let eventController = updateCraftingLenses(arrayOfCraftingRequirements);

      grid.addEventListener("click", function() {
        //if (insertCraftingTruthinessCheck) craftThingy();
        grid.blur();
      }, {once: true});
    };

    grid.addEventListener("focusout", function() {
      window.removeEventListener("mousemove", centerGridOnCursor);
      grid.remove();
    });

    appendAndUpdateGrid(eventOrCraftingInfo);
    this.complete = function(eventOrCraftingInfo) {
      appendAndUpdateGrid(eventOrCraftingInfo);
    };
  },
};
//

//KEYBINDS
document.addEventListener("keyup", function(event) {
  switch (event.key) {
    case "Escape": {
      document.activeElement.blur();
    }
  }
})
//

//INITIALIZATION
const initialize = {
  boxElements: function() {
    let projectBoxElement = document.querySelector("#projectBox");

    projectBoxElement.appendChild(create.boxElement(box.storage));

    let trashShopFlex = document.createElement("div");
    trashShopFlex.id = "trashAndShopFlex";
    projectBoxElement.appendChild(trashShopFlex);
    trashShopFlex.appendChild(create.boxElement(box.trash));

    let shipmentsDashboardFlex = document.createElement("div");
    shipmentsDashboardFlex.id = "shipmentsAndDashboardFlex";
    projectBoxElement.appendChild(shipmentsDashboardFlex)
    shipmentsDashboardFlex.appendChild(create.boxElement(box.shipments));
  },
  slotElements: function() {
    Object.values(box).forEach(boxObject => {
      let slotContainerOfBox = document.querySelector(`#${boxObject.elementID} .slotContainer`);
      for (let i = 1; i <= boxObject.slotTotal; i++) {
        let slotID = boxObject.baseSlotID + i;
        slotContainerOfBox.insertAdjacentElement("beforeend", create.slotElement(slotID, true, true));
      };
    });
  },
  boxAndSlotElements: function() {
    this.boxElements();
    this.slotElements();
  },
  complete: function() {
    initialize.boxAndSlotElements();
    create.utilityBox.dashboard();
  },
};
initialize.complete();
//