import { List } from '../models/Items';

let items: List[] = [];
let currentId = 1;

export const getItems = (): List[] => {
    return items;
};

export const getItemById = (id: number): List | undefined => {
    const item = items.find((item) => item.id === id)
    return item;
}

export const addItem = (name: string, quantity: string, status: boolean) : List => {
    const newItem: List = {id: currentId++, name, quantity, status}
    items.push(newItem)
    return newItem;
}

export const updateItem = (id: number, name: string, quantity: string, status: boolean): List | undefined => {
    const item = items.find((item) => item.id === id);
    if(item){
        item.name = name;
        item.quantity = quantity;
        item.status = status;
    }
    return item;
}

export const deleteItem = (id: number): boolean => {
    const index = items.findIndex((item) => item.id === id);
    if(index !== -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
}