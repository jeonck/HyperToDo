// 표준 JavaScript를 사용한 간단한 로직
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const completedCount = document.getElementById('completed-count');
    const totalCount = document.getElementById('total-count');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let todos = [];
    let currentFilter = 'all';

    // 로컬 스토리지에서 할 일 불러오기
    try {
        const savedTodos = localStorage.getItem('hypertodo-items');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            console.log('로컬 스토리지에서 불러온 할 일 목록:', todos);
        }
    } catch (error) {
        console.error('로컬 스토리지에서 할 일을 불러오는 중 오류 발생:', error);
    }

    // 로컬 스토리지에 할 일 저장
    function saveTodos() {
        try {
            localStorage.setItem('hypertodo-items', JSON.stringify(todos));
            console.log('로컬 스토리지에 저장됨:', todos);
        } catch (error) {
            console.error('로컬 스토리지에 할 일을 저장하는 중 오류 발생:', error);
        }
    }

    // 할 일 추가 함수
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(todo);
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    // 할 일 삭제 함수
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    // 할 일 완료 상태 토글 함수
    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    // 할 일 목록 렌더링 함수
    function renderTodos() {
        // 현재 필터에 따라 표시할 할 일 필터링
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        // 할 일 목록 렌더링
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
            
            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        // 통계 업데이트
        completedCount.textContent = todos.filter(todo => todo.completed).length;
        totalCount.textContent = todos.length;
    }

    // 필터 변경 함수
    function changeFilter(filter) {
        currentFilter = filter;
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderTodos();
    }

    // 이벤트 리스너 등록
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.dataset.filter);
        });
    });

    // 초기 렌더링
    renderTodos();
});