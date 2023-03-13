const form = document.getElementById('item-form');
const list = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const filter = document.getElementById('filter');



form.addEventListener('submit', addAndUpdateItem);
list.addEventListener('click', edit);
clearButton.addEventListener('click', clearAll);
filter.addEventListener('input', filterProducts)
checkItems()
loadItems();


function filterProducts(e){
    const filter = e.target.value;
    for (let child of list.children) {
        if(!child.innerText.trim().includes(filter))
            child.style.display = 'none'
        else
            child.style.display = 'flex'
    }
}
function clearAll(e){
    list.innerHTML = ''
    localStorage.clear()
    checkItems()
}
function removeProduct(e){
    const product = e.target.parentElement.parentElement;
    removeFromStorage(product.textContent.trim())
    removeFromUi(product)
    checkItems()
}

function removeFromStorage(item){
    let items = JSON.parse(localStorage.getItem('items'))
    items = items.filter((element) => {return element !== item})
    localStorage.setItem('items', JSON.stringify(items))
}

function removeFromUi(item){
    item.remove()
}
function edit(e){
    e.preventDefault();
    if(e.target.tagName === 'LI'){
        const items = document.getElementById('item-list').querySelectorAll('li')
        items.forEach((key) => {
            if(key.style.background === 'lightgray'){
                updateItemToUi(key, key.textContent.trim())
            }
        })
        const li = e.target;
        li.style.background = 'lightgray';
        const input = document.getElementById('item-input');
        input.value = li.innerText;
        const button = document.getElementById('item-form').querySelector('.btn');
        button.textContent = 'update';
    }
}
function addAndUpdateItem(e){
    e.preventDefault();
    const submitButton = e.target.querySelector('.btn');
    if(submitButton.textContent.trim() === 'Add Item'){
        const input = e.target.querySelector('#item-input');
        const inputValue = input.value;
        if (inputValue === ''){
            alert('pls fill the product name section');
            return;
        }
        if(addItemToStorage(inputValue) === false){
            alert('the product name has been use before')
            document.getElementById('item-input').value = ''
            return;
        }
        addItemToUi(inputValue);
        input.value = '';
    }
    else if(submitButton.textContent.trim() === 'update'){
        const input = e.target.querySelector('.form-input');
        const list = document.getElementById('item-list').children;
        for (let listElement of list) {
            if (listElement.style.background === 'lightgray') {
                if(updateItemToStorage(listElement.textContent, input.value) === false){
                    alert('this product name already exists')
                    return;
                }
                updateItemToUi(listElement, input.value)
            }
        }
        submitButton.innerText = '';
        submitButton.innerHTML = '';
        submitButton.appendChild(plusMark());
        submitButton.appendChild(document.createTextNode(' Add Item'))
        input.value = ''
    }
    checkItems()
}

function updateItemToStorage(oldItem, newItem){
    console.log(oldItem, newItem)
    let items = JSON.parse(localStorage.getItem('items'));
    if(items.includes(newItem))
        return false
    items[items.indexOf(oldItem)] = newItem
    localStorage.setItem('items', JSON.stringify(items))

    return true;
}


function updateItemToUi(oldElement, newItem){
    oldElement.style = ''
    oldElement.innerHTML = ''
    oldElement.appendChild(document.createTextNode(newItem))
    const button = xButton(xMark());
    button.addEventListener('click', removeProduct)
    oldElement.appendChild(button)
}
function xMark(){
    const i = document.createElement('i');
    i.className = 'fa-solid fa-xmark';
    return i;
}

function plusMark(){
    const i = document.createElement('i');
    i.className = 'fa-solid fa-plus';
    return i;
}

function xButton(i){
    const button = document.createElement('button');
    button.className = 'remove-item btn-link text-red';
    button.appendChild(i);
    return button;
}

function li(productName, button){
    const li = document.createElement('li');
    const text = document.createTextNode(productName);
    li.appendChild(text);
    li.appendChild(button);
    return li;
}

function checkItems(){
    const items = document.getElementById('item-list').children;
    if(items.length === 0){
        clearButton.style.display = 'none'
        filter.style.display = 'none'
    }
    else{
        clearButton.style.display = 'flex'
        filter.style.display = 'flex'
    }
}

function addItemToUi(item){
    const newProduct = li(item, xButton(xMark()));
    newProduct.querySelector('button').addEventListener('click', removeProduct)
    const list = document.getElementById('item-list');
    list.appendChild(newProduct);
}
function addItemToStorage(item){
    let items;
    if (localStorage.getItem('items') === null){
        items = []
    }
    else
        items = JSON.parse(localStorage.getItem('items'));

    if(items.includes(item))
        return false

    items.push(item);

    localStorage.setItem('items',JSON.stringify(items))

    return true

}

function loadItems(){
    let items = JSON.parse(localStorage.getItem('items'))
    for (let item of items) {
        addItemToUi(item)
    }
    checkItems()
}