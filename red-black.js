/*
 * Node
 */

function RedBlackNode(value) {
  this.value = value
  this.left = null
  this.right = null
  this.color = 'red'
  this.parent = null
  this.tree = null
}

RedBlackNode.prototype.sibling = function () {
  return this.parent? this === this.parent.left ? this.parent.right : this.parent.left : null
}

RedBlackNode.prototype.uncle = function () {
  return this.parent? this.parent.silbing : null
}

RedBlackNode.prototype.grandparent = function () {
  return this.parent? this.parent.parent : null
}

RedBlackNode.prototype.rotateLeft = function () {
  var right = this.right;
  this.tree.replaceNode(node, right);
  
  // Update pointers
  this.right = right.left;
  if (right.left !== null) right.left.parent = this;
  right.left = this;
  this.parent = right;
};

RedBlackNode.prototype.rotateRight = function () {
  var left = this.left;
  this.tree.replaceNode(node, left);
  
  // Update pointers
  node.left = left.right;
  if (left.right !== null) left.right.parent = this;
  left.right = this;
  this.parent = left;
}

/*
 * Tree
 */

function RedBlackTree() {
  this.root = null
}

RedBlackTree.prototype.replaceNode = function (original, replacement) {
  if (original.parent === null) {
    original.tree.root = replacement
  } else {
    if (original === original.parent.left) {
      original.parent.left = replacement
    } else {
      original.parent.right = replacement
    }
  }
  
  if (replacement !== null) {
    replacement.parent = original.parent
  }
}

RedBlackTree.prototype.add = function (value) {
  if (this.root === null) {
    this.root = new RedBlackNode(value)
    return this
  }
  
  var child = new RedBlackNode(value)
    , index = this.root
    
  while (index) {
    if (value < index.value) {
      if (index.left) index = index.left
      else {
        index.left = child
        break
      }
    } else if (value > index.value) {
      if (index.right) index = index.right
      else {
        index.right = child
        break 
      }
    } else break
  }
  
  child.parent = index
  child.tree = this
  
  return this.balanceFromInsertOf(child)
}

RedBlackTree.prototype.balanceFromInsertOf = function (child) {
  var childParent = child.parent
    , childUncle = child.uncle
    , childGrandparent = child.grandparent()
    , childParentColor = childParent.color
    , childUncleColor = childUncle.color
  
  if (!childParent) child.color = 'black'
  else if (childParentColor == 'black') return this
  else if (childUncle && childUncleColor === 'red') {
    childParentColor = 'black'
    childUncleColor = 'black'
    childGrandparent.color = 'red'
    childGrandparent.balance()
  } else {
    if (child === child.parent.right && child.parent === child.grandparent.left) {
      node.parent.rotateLeft()
      child = node.left
    } else if (child === child.parent.left && child.parent === child.grandparent.right) {
      node.parent.rotateRight()
      child = node.right
    }
    
    child.parent.color = 'black'
    child.grandparent.color = 'red'
    
    if (child === child.parent.left && child.parent === child.grandparent.left) {
      child.rotateRight(child.grandparent)
    } else if (child === child.parent.right && child.parent === child.grandparent.right) {
      child.rotateLeft(child.grandparent)
    }
  }
  
  return this
}

RedBlackTree.prototype.traverse = function (process) {
  this.root? !function over(node) {
    process.call(this, node)
    node.left && over(node.left)
    node.right && over(node.right)
  }(this.root) : false
}

RedBlackTree.prototype.contains = function (value) {
  var found = false
    , index = this._root
  
  while (!found && index) {
    if (value < index.value) index = index.left
    else if (value > index.value) index = index.right
    else found = true
  }
  
  return found
}

RedBlackTree.prototype.size = function (value) {
  var length = 0
  this.traverse(function (node) { length++ })
  return length
}

RedBlackTree.prototype.toArray = function () {
  var result = []
  this.traverse(function (node) { result.push(node.value) })
  return result
}

RedBlackTree.prototype.toString = function () {
  return this.toArray().toString()
}

/* 
 * Tests
 */
 
 var MyTree = new RedBlackTree()

MyTree
  .add(6)
  .add(12)
  .add(3)
  .add(5)
  .add(10)
  .add(32)

MyTree.traverse(function (node) {
  console.log(node.color)
})