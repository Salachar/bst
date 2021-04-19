const BST = {
    head: null,
};

function createNode (value, parent, direction) {
    let node = {
        value: value,
        left: null,
        right: null,
        html_node: null,
    };

    let el = document.createElement('div');
    el.classList.add('node');
    el.classList.add(direction);

    let el_value = document.createElement('div');
    el_value.classList.add('value');
    el_value.innerHTML = value;
    el.appendChild(el_value);

    let el_children = document.createElement('div');
    el_children.classList.add('children');
    el.appendChild(el_children);

    node.html_node = el;
    node.child_container = el_children;

    if (parent) {
        if (direction === 'right') {
            parent.child_container.appendChild(el);
        } else {
            parent.child_container.prepend(el);
        }
    } else {
        document.getElementById('tree_view').appendChild(el);
    }

    return node;
}

function addtoTree (tree, value) {
    // Create the head of the tree if it doesnt exist
    if (!tree.head) {
        tree.head = createNode(value, null, 'root');
        return;
    }

    let current = tree.head;
    while (current) {
        if (current.value === value) {
            console.log('Ignoring duplicate value: ' + value);
            return;
        }

        let direction = (value < current.value) ? 'left' : 'right';

        if (!current[direction]) {
            // We've reached where the new node goes, create it and return
            current[direction] = createNode(value, current, direction);
            return;
        }

        current = current[direction];
    }
}

function levelOrderTraversal (root) {
    if (!root) return;

    let current_queue = [root];
    let next_queue = [];

    while (current_queue.length > 0) {
        let temp = current_queue.shift();
        console.log(temp.value + " ");

        if (temp.left) next_queue.push(temp.left);
        if (temp.right) next_queue.push(temp.right);

        if (!current_queue.length) {
            if (!next_queue.length) return;
            current_queue = next_queue;
            next_queue = [];
        }
    }
};

function isBalanced (root) {
    if (root === null) return true;
    return checkHeight(root) !== false;
}

function checkHeight (node) {
    if (!node) return 0;
    const left = checkHeight(node.left);
    const right = checkHeight(node.right);
    // if a previous call has returned false, we need to pass false all the way up
    if (left === false || right === false || Math.abs(left - right) > 1) return false;
    // height of a node
    return Math.max(left, right) + 1;
}

function balance () {
    let sorted_array = [];
    traverse(BST.head, sorted_array);
    document.getElementById('tree_view').innerHTML = '';
    BST.head = createTree(sorted_array, null, 'root');
}

function traverse (node, array) {
    if (!node) return;
    traverse(node.left, array);
    array.push(node.value);
    traverse(node.right, array);
}

function createTree (array, parent, direction) {
    if (!array.length) return;
    let mid_index = Math.floor(array.length / 2);
    let root = createNode(array[mid_index], parent, direction);
    root.left = createTree(array.slice(0, mid_index), root, 'left');
    root.right = createTree(array.slice(mid_index + 1), root, 'right');
    return root;
}

window.onload = () => {
    setEvents();
    const arr = [];
    for (let i = 0; i < 100; ++i) {
        arr.push((Math.random() * 100).toFixed(2));
    }
    arr.forEach(value => addtoTree(BST, value));
};

function setEvents () {
    document.getElementById('tree_input').addEventListener('keydown', (e) => {
        if (e.key.toLocaleLowerCase() === 'enter') {
            if (!e.currentTarget.value) return;
            const value = parseFloat(e.currentTarget.value, 10);
            e.currentTarget.value = value + 1;
            addtoTree(BST, value);
            console.log(isBalanced(BST.head));
        }
    });

    document.getElementById('balance').addEventListener('click', (e) => {
        balance();
    });

    document.getElementById('clear').addEventListener('click', (e) => {
        BST.head = null;
        document.getElementById('tree_view').innerHTML = '';
    });
}