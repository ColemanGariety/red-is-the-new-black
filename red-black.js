/*
 * Node
 */

function RedBlackNode(key, value) {
  this.value = value
  this.left = null
  this.right = null
  this.color = 'red'
  this.parent = null
  this.tree = null
  this.key = key
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
  var right = this.right
  this.tree.replaceNode(node, right)
  
  // Update pointers
  this.right = right.left
  if (right.left !== null) right.left.parent = this
  right.left = this
  this.parent = right
}

RedBlackNode.prototype.rotateRight = function () {
  var left = this.left
  this.tree.replaceNode(node, left)
  
  // Update pointers
  node.left = left.right
  if (left.right !== null) left.right.parent = this
  left.right = this
  this.parent = left
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

RedBlackTree.prototype.add = function (key, value) {
  if (this.root === null) {
    this.root = new RedBlackNode(key, value)
    return this
  }
  
  var node = new RedBlackNode(key, value)
    , index = this.root
    
  while (index) {
    if (key < index.key) {
      if (index.left) index = index.left
      else {
        index.left = node
        break
      }
    } else if (key > index.key) {
      if (index.right) index = index.right
      else {
        index.right = node
        break 
      }
    } else break
  }
  
  node.parent = index
  node.tree = this
  
  return this.balanceFromInsertOf(node)
}

RedBlackTree.prototype.balanceFromInsertOf = function (node) {
  var nodeParent = node.parent
    , nodeUncle = node.uncle
    , nodeGrandparent = node.grandparent()
    , nodeParentColor = nodeParent.color
    , nodeUncleColor = nodeUncle.color
  
  if (!nodeParent) node.color = 'black'
  else if (nodeParentColor == 'black') return this
  else if (nodeUncle && nodeUncleColor === 'red') {
    nodeParentColor = 'black'
    nodeUncleColor = 'black'
    nodeGrandparent.color = 'red'
    nodeGrandparent.balance()
  } else {
    if (node === node.parent.right && node.parent === node.grandparent.left) {
      node.parent.rotateLeft()
      node = node.left
    } else if (node === node.parent.left && node.parent === node.grandparent.right) {
      node.parent.rotateRight()
      node = node.right
    }
    
    node.parent.color = 'black'
    node.grandparent.color = 'red'
    
    if (node === node.parent.left && node.parent === node.grandparent.left) {
      node.rotateRight(node.grandparent)
    } else if (node === node.parent.right && node.parent === node.grandparent.right) {
      node.rotateLeft(node.grandparent)
    }
  }
  
  return this
}

RedBlackTree.prototype.get = function (key) {
  var index = this.root
  while (index) {
    if (key === index.key) return index.value
    else if (key < index.key) index = index.left
    else if (key > index.key) index = index.right
  }
  
  return false
}

RedBlackTree.prototype.delete = function (key) {
  var node = this.root
  while (node) {
    if (key === node.key) break
    else if (key < node.key) node = node.left
    else if (key > node.key) node = node.right
  }
  
  if (node.left !== null && node.right !== null) {
    var pred = node.left;
    while (pred.right !== null) pred = pred.right;
    
    node.key = pred.key;
    node.value = pred.value;
    node = pred;
  }
  
  var child = (node.right === null) ? node.left : node.right
  if (node.color === 'black') {
    node.color = child.color
    this.balanceFromDeletionOf(node)
  }
  
  this.replaceNode(node, child)
  this.root.color = 'black'
  
  return this
}

RedBlackTree.prototype.balanceFromDeletionOf = function (node) {
  if (node.parent !== null) {
    var sibling = node.sibling()
    
    if (sibling && sibling.color === 'red') {
      node.parent.color = 'red'
      sibling.color = 'black'
      if (node === node.parent.left) node.parent.rotateLeft()
      else node.parent.rotateRight()
    }
    
    if (node.parent && node.parent.color === 'black' && sibling && sibling.color === 'black' && sibling.left.color === 'black' && sibling.right.color === 'black') {
      sibling.color = 'red'
      this.balanceFromDeletionOf(node.parent)
    } else {
      if (node.parent && node.parent.color === 'red' && sibling && sibling.color === 'black' && sibling.left.color === 'black' && sibling.right.color === 'black') {
        sibling.color = 'red'
        node.parent.color = 'black'
      } else {
        if (node.parent && node === node.parent.left && sibling && sibling.color === 'black' && sibling.left.color === 'red' && sibling.right.color === 'black') {
          sibling.color = 'red'
          sibling.left.color = 'black'
          sibling.rotateRight()
        } else if (node.parent && node === node.parent.right && sibling && sibling.color === 'black' && sibling.right.color === 'red' && sibling.left.color === 'black') {
          sibling.color = 'red'
          sibling.right.color = 'black'
          sibling.rotateLeft()
        }
        
        if (sibling) {
          sibling.color = node.parent.color
          node.parent.color = 'black'
          
          if (node === node.parent.left) {
            sibling.right.color = 'black'
            node.parent.rotateLeft()
          } else {
            sibling.left.color = 'black'
            node.parent.rotateRight()
          }
        }
      }
    }
  }
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
  .add('z', 6)
  .add('b', 12)
  .add('c', 3)
  .add('d', 5)
  .add('e', 10)
  .add('f', 32)
  .delete('d')
  .add('g', 234)

MyTree.traverse(function (node) {
  console.log(node.color)
})

console.log(MyTree.toString())