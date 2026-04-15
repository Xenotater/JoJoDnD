class ListNode<T> {
  elem: T;
  next?: ListNode<T>;
  previous?: ListNode<T>;

  constructor(elem: T) {
    this.elem = elem;
  }
}

export default class LinkedList<T> {
  private head?: ListNode<T>;
  len: number = 0;

  private getNodeAt(index: number) {
    if (this.head && index > -1 && index < this.len) {
      let current = this.head;

      if (index == 0) return this.head;
      else {
        for (let i = 0; i < index; i++) {
          current = current.next!;
        }
        return current;
      }
    } else return undefined;
  }

  getAt(index: number) {
    return this.getNodeAt(index)?.elem;
  }

  removeAt(index: number) {
    const node = this.getNodeAt(index);
    if (node) {
      node.previous!.next = node.next;
      node.next!.previous = node.previous;
      this.len--;
      return node.elem;
    } else return undefined;
  }

  pop() {
    return this.removeAt(0);
  }

  insertAt(elem: T, index: number) {
    if (index > -1 && (index < this.len || index == 0)) {
      const node = new ListNode(elem);

      if (index == 0) {
        if (this.head == undefined) {
          node.next = node;
          node.previous = node;
          this.head = node;
        }
        else {
          node.next = this.head;
          node.previous = this.head.previous;
          this.head.previous!.next = node;
          this.head.previous = node;
          this.head = node;
        }
      } else {
        const target = this.getNodeAt(index)!;
        node.next = target;
        node.previous = target.previous;
        target.previous!.next = node;
        target.previous = node;
      }
      this.len++;
      return true;
    } else return false;
  }

  append(elem: T) {
    this.insertAt(elem, this.len - 1);
  }

  shiftRightBy(count: number) {
    if (this.head && count > 0 && count < this.len) {
      let current = this.head;

      for (let i = 0; i < count; i++) {
        current = current.next!;
      }
      this.head = current;
      return true;
    }
    return false;
  }

  shiftLeftBy(count: number) {
    if (this.head && count > 0 && count < this.len) {
      let current = this.head;

      for (let i = 0; i < count; i++) {
        current = current.previous!;
      }
      this.head = current;
      return true;
    }
    return false;
  }

  constructor(elem?: T) {
    if (elem)
      this.append(elem);
  }
}