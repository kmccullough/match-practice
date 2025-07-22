import { shuffle } from '../util/array.js';
import { Events } from '../util/events.js';
import { byKey } from '../util/sort.js';

export const terms = new class TermsService {
  lists = [];
  nextListId = 1;
  nextTermId = 1;

  events = new Events().setContext(this)
    .setDebounce(true);
  on(event, callback) {
    return this.events.on(event, callback);
  }
  off(event, callback) {
    return this.events.off(event, callback);
  }

  getOrAddList(id = null) {
    return id && this.lists.find(list => list.id === id)
      || this.addList();
  }

  getLists(listIds) {
    const lists = [];
    for (const list of this.lists) {
      if (listIds.includes(list.id)) {
        lists.push(list);
      }
    }
    return lists;
  }

  addList(name = null, terms = []) {
    const id = this.nextListId++;
    terms = terms.map(term => ({
      ...term,
      id: this.nextTermId++
    }));
    const list = { id, terms };
    this.lists.push(list);
    this.renameList(id, name);
    return list;
  }

  renameList(id, name = null) {
    if (name === null) {
      name = 'Untitled List ' + id;
    }
    this.getOrAddList(id).name = name;
    this.sortLists();
  }

  deleteList(id) {
    const isDeleted = !!this.lists.splice(this.lists.findIndex(list => list.id === id), 1).length;
    if (isDeleted) {
      this.events.emit('change');
    }
    return isDeleted;
  }

  sortLists() {
    this.lists.sort(byKey('name'));
    this.events.emit('change');
  }

  addTerms(listId, terms) {
    const list = this.getOrAddList(listId);
    list.terms = [
      ...list.terms,
      ...terms.map(term => ({
        ...term,
        id: this.nextTermId++
      })),
    ];
    this.events.emit('change');
    return list;
  }

  deleteTerm(listId, termId) {
    const { terms } = this.getOrAddList(listId);
    for (let i = 0; i < terms.length; ++i) {
      if (terms[i].id === termId) {
        terms.splice(i, 1);
        this.events.emit('change');
        return true;
      }
    }
    return false;
  }

  getRandomByCount(count, listsIds) {
    const availableTerms = [];
    for (const list of this.getLists(listsIds)) {
      availableTerms.push(...list.terms);
    }
    const terms = [];
    let shuffled;
    while (count > 0 && availableTerms.length) {
      shuffled = shuffle(availableTerms.slice());
      count -= shuffled.length;
      terms.push(...count >= 0 ? shuffled : shuffled.slice(0, count));
    }
    return terms;
  }
};
