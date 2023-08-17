const itemForm  = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList  = document.getElementById('item-list') 
const clearBtn = document.getElementById('clear')
const filter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false;


function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item))
    checkUI()
}   

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;
    //Validation
    if(newItem === ''){
        alert('Please add something')
        return;
    }

    //Check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode =false 
    }else{
        if(checkIfItemExists(newItem)){
            alert('Item already exists')
            return
        }
    }

    //Create item DOM element
    addItemToDOM(newItem)

    //Add item to local storage
    addItemToStorage(newItem)
    checkUI()
    itemInput.value = ''
}

function addItemToDOM(item){
    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    //Create buttons
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button)
    //Adding list items to the DOM
    itemList.appendChild(li);
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage(); 

    //Adding new item to array
    itemsFromStorage.push(item)
    //Convert back to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage(){
    let itemsFromStorage; 
    if(localStorage.getItem('items')=== null){
        itemsFromStorage = []
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    }else{
        setItemToEdit(e.target)
    }
}

function setItemToEdit(item){
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i)=> i.classList.remove('edit-mode'))

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm('Are you sure?')){
        //Remove item from DOM
        item.remove()

        //Remove item from storage
        removeItemFromStorage(item.textContent)
        checkUI()
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage()
    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i)=> i !== item);

    //Re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

//Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit)
  
itemList.addEventListener('click', onClickItem)

clearBtn.addEventListener('click', (e) => { 
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    //clear from localstorage
    localStorage.removeItem('items')
    checkUI()
})

filter.addEventListener('input', (e) => {
    const lists = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();
    lists.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex'
        }else{
            item.style.display = 'none'
        }
    } )
})

document.addEventListener('DOMContentLoaded', displayItems)

function checkUI(){
    itemInput.value = ''
    const lists = itemList.querySelectorAll('li')
    if(lists.length === 0){
        filter.style.display = 'none'
        clearBtn.style.display = 'none'
    }else{
        filter.style.display = 'block'
        clearBtn.style.display = 'block'
    }

    formBtn.innerHTML = '<i class= "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333'

    isEditMode = false;
}


checkUI()