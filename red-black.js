/*
 * Classes
 */

function RedBlackNode(value) {
  this.value = value
  this.left = null
  this.right = null
  this.height = 1
}

function RedBlackTree() {
  this.root = null
}

/*
 * Public Methods
 */

RedBlackTree.prototype.add = function (value) {
  if (this.root === null) {
    this.root = new RedBlackNode(value)
    return this
  }
  
  var index = this.root
  
  while (index) {
    if (value < index.value) { index.left? index = index.left : index.left = new RedBlackNode(value); break }
    else if (value > index.value) { index.right? index = index.right : index.right = new RedBlackNode(value); break }
    else break
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
  
  this.traverse(function (node) {
    length++
  })
  
  return length
}

RedBlackTree.prototype.toArray = function () {
  var result = []

  this.traverse(function (node) {
    result.push(node.value)
  })

  return result
}

RedBlackTree.prototype.toString = function () {
  return this.toArray().toString()
}

var MyTree = new RedBlackTree()

/* 
 * Tests
 */

MyTree.add(6)
MyTree.add(2)
MyTree.add(10)

MyTree.traverse(function (node) {
  console.log(node.value)
})

console.log(MyTree.size())