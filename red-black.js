/*
 *
 * @name RED IS THE NEW BLACK
 * @homeapge https://github.com/JacksonGariety/red-is-the-new-black
 * @author Jackson Gariety (jacksongariety.com)
 * @version 0.0.1
 * @license MIT
 * A red-black tree implementation in pure JavaScript
 *   - It's a self-balancing binary tree!
 *   - It has no dependencies! (fuck underscore.js)
 *   - It's annotated!
 *   - It has a minified dist!
 *
 */

/*
 * Node
 */

// The Node class
function RedBlackNode(key, value) {
  this.value = value // holds value as a key/value store would, this is not sorted
  this.left = null   // points to either a left-branching node or a leaf (null)
  this.right = null  // points to either a right-branch not or a leaf (null)
  this.color = 'red' // the color of the node, used for balancing the tree
  this.parent = null // a pointer to the parent node
  this.tree = null   // a pointer to the tree which owns the node
  this.key = key     // holds the key as a key/value store would, this is sorted
}

// Points to sibling node, doesn't care wether
// it's left or right.
RedBlackNode.prototype.sibling = function () {
  return this.parent? this === this.parent.left ? this.parent.right : this.parent.left : null
}

// Points to the sibling of the parent node.
RedBlackNode.prototype.uncle = function () {
  return this.parent? this.parent.silbing : null
}

// Points to the parent of the parent node.
RedBlackNode.prototype.grandparent = function () {
  return this.parent? this.parent.parent : null
}

// Updates the pointers for left-branching nodes which have just
// been swapped by the RedBlackTree.prototype.replace function
RedBlackNode.prototype.swapLeft = function () {
  var right = this.right // variable is cached for later pointer update
  this.tree.replaceNode(this, right) // swaps a node with its right branch
  
  // Update pointers after replacing node
  this.right = right.left
  if (right.left !== null) right.left.parent = this
  right.left = this
  this.parent = right
}

// Updates the pointers for right-branching nodes which have just
// been swapped by the RedBlackTree.prototype.replace function
RedBlackNode.prototype.swapRight = function () {
  var left = this.left // variable is cached for later pointer update
  this.tree.replaceNode(this, left) // swaps the node with its left branch
  
  // Update pointers after replacing node
  this.left = left.right
  if (left.right !== null) left.right.parent = this
  left.right = this
  this.parent = left
}

/*
 * Tree
 */

// The class for every tree
// Trees are made with:
// `var MyTree = new RedBlackTree`
function RedBlackTree() {
  this.root = null
}

// Replace one node with another
RedBlackTree.prototype.replaceNode = function (original, replacement) {
  if (original.parent === null) {
    original.tree.root = replacement // special case for when you're pointing to the root node
  } else {
    // simple binary node rotation
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

/*
 * ADD (INSERT)
 */

// Add a node to the tree
// balancing is done in balanceFromInsertionOf()
RedBlackTree.prototype.add = function (key, value) {
  if (this.root === null) { // special case for when the tree is completely empty
    this.root = new RedBlackNode(key, value)
    return this // return the tree to allow for chaining
  }
  
  var node = new RedBlackNode(key, value) // cache the node that is to be added
    , index = this.root // start at the root
    
  // climb the tree, this is a simple binary search algorithm
  // binary searching = using the key to speed up finding data in an object
  // the red-black part is seen in balanceFromInsertionOf(node)
  while (index) {
    if (key < index.key) { // binary search left, sorting by key
      if (index.left) index = index.left
      else {
        index.left = node // set the node to the left branch if it doesn't exist
        break
      }
    } else if (key > index.key) { // binary search right, sorting by key
      if (index.right) index = index.right // if it does exist, move the index forward
      else {
        index.right = node // set the node to the right branch if it doesn't exist
        break 
      }
    } else break // just prevents a superfluous trip through the loop
  }
  
  // two required properties of a node
  node.parent = index // set node's parent to whichever node the while() loop finished on
  node.tree = this // save the node's tree
  
  return this.balanceFromInsertionOf(node) // return the balanced tree to allow for chaining
}

// Re-balance the tree after inserting
// The magic of the red-black tree
RedBlackTree.prototype.balanceFromInsertionOf = function (node) {
  // These are cached for speed, since there can be no ndoe udpates in this block
  var nodeParent = node.parent
    , nodeUncle = node.uncle
    , nodeGrandparent = node.grandparent()
    , nodeParentColor = nodeParent.color
    , nodeUncleColor = nodeUncle.color
  
  // red-black tree roots should always be black
  if (!nodeParent) node.color = 'black' // special case for when you have the root of the tree
  else if (nodeParentColor == 'black') return this // no need to balance if parent happens to be black
  else if (nodeUncle && nodeUncleColor === 'red') { // Balancing black #1
    nodeParentColor = 'black'
    nodeUncleColor = 'black'
    nodeGrandparent.color = 'red'
    nodeGrandparent.balance()
  } else { // Balancing block #2, no longer using cached variables to preserve node states
    if (node === node.parent.right && node.parent === node.grandparent.left) {
      node.parent.swapLeft() // rotate node with it's left-branching child
      node = node.left
    } else if (node === node.parent.left && node.parent === node.grandparent.right) {
      node.parent.swapRight() // rotate node with it's right-branching child
      node = node.right
    }
    
    // keep family up-to-date for all cases, regardless of control-flow results
    node.parent.color = 'black'
    node.grandparent.color = 'red'
    
    // Balancing block #3, can occur simultaneous to block #2 and is opposite
    if (node === node.parent.left && node.parent === node.grandparent.left) {
      node.swapRight(node.grandparent)
    } else if (node === node.parent.right && node.parent === node.grandparent.right) {
      node.swapLeft(node.grandparent)
    }
  }
  
  return this // return the tree to allow for chaining
}

/*
 * GET
 */

// Return a value from the tree by its key
RedBlackTree.prototype.get = function (key) {
  var index = this.root // start at the root
  while (index) { // climb the tree using simple binary search
    if (key === index.key) return index.value
    else if (key < index.key) index = index.left
    else if (key > index.key) index = index.right
  }
  
  return false // makes this function useful in if-else statements
}

/*
 * DELETE
 */

// Remove a key/value pair from the tree and re-balance
// Balancing is done in balanceFromDeletionOf()
RedBlackTree.prototype.delete = function (key) {
  var node = this.root // start at the root
  while (node) { // climb the tree using simple binary search
    if (key === node.key) break
    else if (key < node.key) node = node.left
    else if (key > node.key) node = node.right
  } // 'node' is now the node with the key
  
  // Removes object from tree and re-arrange the children,
  // since they no longer have a parent node. :-(
  // IMPORTANT: this re-arranges nodes but DOES NOT RE-PAINT THEM
  // Re-painting is still handled by balanceFromDeletionOf(node)
  if (node.left !== null && node.right !== null) { // don't re-balance children unless it has children, of course
    var pred = node.left // climg the left branch
    while (pred.right !== null) pred = pred.right // switch to the right branch
    
    // bye bye!
    node.key = pred.key
    node.value = pred.value
    node = pred
  }
  
  // find old child to re-balance from
  var child = (node.right === null) ? node.left : node.right
  if (node.color === 'black') {
    node.color = child.color // re-painting
    this.balanceFromDeletionOf(node) // re-balance the tree from the deletion
  }
  
  this.replaceNode(node, child) // swap the two nodes
  this.root.color = 'black' // make sure the root color is still black,
                            // since a deletion is the only thing that
                            // could make it red
  
  return this // return the tree for chaining
}

RedBlackTree.prototype.balanceFromDeletionOf = function (node) {
  // make sure we aren't at the top of the tree, first
  // but even if we were, there's no special case for
  // it because it can't have a parent that was deleted
  if (node.parent !== null) {
    var sibling = node.sibling()
    
    if (sibling && sibling.color === 'red') {
      node.parent.color = 'red'
      sibling.color = 'black'
      if (node === node.parent.left) node.parent.swapLeft()
      else node.parent.swapRight()
    }
    
    // Special case, the else of this statement is balacning block #1
    if (node.parent && node.parent.color === 'black' &&
        sibling && sibling.color === 'black' &&
        sibling.left.color === 'black' &&
        sibling.right.color === 'black') {
      sibling.color = 'red'
      this.balanceFromDeletionOf(node.parent) // balance the parent instead if already black
    } else { // Balancing block #1, always runs except for one case
      if (node.parent && node.parent.color === 'red' &&
          sibling && sibling.color === 'black' &&
          sibling.left.color === 'black' &&
          sibling.right.color === 'black') {
        sibling.color = 'red'
        node.parent.color = 'black'
      } else {
        // Balancing block #2
        if (node.parent && node === node.parent.left &&
            sibling && sibling.color === 'black' &&
            sibling.left.color === 'red' &&
            sibling.right.color === 'black') {
          sibling.color = 'red'
          sibling.left.color = 'black'
          sibling.swapRight()
        } else if (node.parent && node === node.parent.right && sibling && sibling.color === 'black' && sibling.right.color === 'red' && sibling.left.color === 'black') {
          sibling.color = 'red'
          sibling.right.color = 'black'
          sibling.swapLeft()
        }
        
        // Balancing block #3 is actually more of a special case
        if (sibling) {
          sibling.color = node.parent.color
          node.parent.color = 'black'
          
          if (node === node.parent.left) {
            sibling.right.color = 'black'
            node.parent.swapLeft()
          } else {
            sibling.left.color = 'black'
            node.parent.swapRight()
          }
        }
      }
    }
  }
}

/*
 * TRAVERSE
 */

// Runs an interator for each node in the tree
// English: equivalent of _.map() in a JS utility library
RedBlackTree.prototype.traverse = function (process) {
  this.root? !function over(node) {
    process.call(this, node)
    node.left && over(node.left)
    node.right && over(node.right)
  }(this.root) : false
}

/*
 * CONTAINS
 */

// Returns true if node exists with key, false if not
// Just a nice thing to have for any binary search tree
RedBlackTree.prototype.contains = function (key) {
  var found = false
    , index = this._root
  
  while (!found && index) {
    if (key < index.key) index = index.left
    else if (key > index.key) index = index.right
    else found = true
  }
  
  return found
}

/*
 * SIZE
 */

// How...  many... nodes in my tree, node in my tree, nodes in my tree?
RedBlackTree.prototype.size = function (value) {
  var length = 0
  this.traverse(function (node) { length++ })
  return length
}
/*
 * TOARRAY
 */

// Maps each node in the tree to an array
// Note that they are in order of their addition
RedBlackTree.prototype.toArray = function () {
  var result = []
  this.traverse(function (node) { result.push(node.value) })
  return result
}

/*
 * TOSTRING
 */

// Just a shortcut, no non-native logic here buddy
RedBlackTree.prototype.toString = function () {
  return this.toArray().toString()
}

/* 
 * Examples
 */
 
// Let's make a tree!
var MyTree = new RedBlackTree()

// Add some stuff, delete some stuff
MyTree
  .add(1, 'foo')
  .add(10, 'bar')
  .add(3, 'raz')
  .add(67, 'za')

// Logs the color of every node we added
// except for 'd', which was deleted :-)
// IT'S RED/BLACK BALANCED!!!
MyTree.traverse(function (node) {
  console.log(node.color)
})

// Log the entire tree with order of additon preserved!
console.log(MyTree.toString())