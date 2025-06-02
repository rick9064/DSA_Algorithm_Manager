class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        if not self.root:
            self.root = Node(data)
        else:
            queue = [self.root]
            while queue:
                temp = queue.pop(0)
                if not temp.left:
                    temp.left = Node(data)
                    break
                else:
                    queue.append(temp.left)
                if not temp.right:
                    temp.right = Node(data)
                    break
                else:
                    queue.append(temp.right)

    def inorder(self, node, result):
        if node:
            self.inorder(node.left, result)
            result.append(node.key)
            self.inorder(node.right, result)

    def preorder(self, node, result):
        if node:
            result.append(node.key)
            self.preorder(node.left, result)
            self.preorder(node.right, result)

    def postorder(self, node, result):
        if node:
            self.postorder(node.left, result)
            self.postorder(node.right, result)
            result.append(node.key)
