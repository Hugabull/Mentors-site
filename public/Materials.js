document.addEventListener('DOMContentLoaded', function() {
    
    // Reference to the Firestore database
    const database = firebase.firestore();
    const todosRef = database.collection('todos');

    // Add a new todo
    document.getElementById('add-button').addEventListener('click', function() {
        const todoInput = document.getElementById('todo-input');
        const todoText = todoInput.value;

        if (todoText.trim() !== '') {
            todosRef.add({
                text: todoText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            todoInput.value = '';
        }
    });

    // Remove a todo
    function removeTodo(id) {
        todosRef.doc(id).delete();
    }

    // Listen for new todos and changes
    todosRef.orderBy('timestamp').onSnapshot((snapshot) => {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ''; // Clear the list before re-rendering

        snapshot.forEach((doc) => {
            const todoItem = document.createElement('li');
            todoItem.setAttribute('id', doc.id);
            todoItem.textContent = doc.data().text;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Check Off';
            removeButton.addEventListener('click', () => removeTodo(doc.id));

            todoItem.appendChild(removeButton);
            todoList.appendChild(todoItem);
        });
    });
});
