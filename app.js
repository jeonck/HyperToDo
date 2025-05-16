// 모던 JavaScript 로직
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
                completed: false,
                createdAt: new Date().toISOString()
            };
            todos.push(todo);
            todoInput.value = '';
            
            // 애니메이션을 위한 효과
            todoInput.classList.add('success-flash');
            setTimeout(() => {
                todoInput.classList.remove('success-flash');
            }, 500);
            
            // 성공 효과음 (선택 사항)
            playSound('success');
            
            saveTodos();
            renderTodos();
        } else {
            // 빈 입력에 대한 경고 효과
            todoInput.classList.add('error-flash');
            setTimeout(() => {
                todoInput.classList.remove('error-flash');
            }, 500);
        }
    }

    // 할 일 삭제 함수
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        playSound('delete');
        saveTodos();
        renderTodos();
    }

    // 할 일 완료 상태 토글 함수
    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                const newTodo = { ...todo, completed: !todo.completed };
                // 완료 상태에 따라 다른 효과음 재생
                playSound(newTodo.completed ? 'complete' : 'undo');
                return newTodo;
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }

    // 효과음 재생 함수 (선택 사항)
    function playSound(type) {
        // 효과음 기능은 구현하지 않았지만, 나중에 추가할 수 있는 구조 유지
        console.log(`Sound played: ${type}`);
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
        
        if (filteredTodos.length === 0) {
            // 할 일이 없을 때 빈 상태 메시지 표시
            const emptyMessage = currentFilter === 'all' 
                ? '할 일 목록이 비어있습니다. 새로운 할 일을 추가해 보세요!' 
                : currentFilter === 'active' 
                ? '진행 중인 할 일이 없습니다. 모든 일을 완료했군요!' 
                : '완료된 할 일이 없습니다.';
                
            const emptyIcon = currentFilter === 'all' 
                ? 'clipboard-list' 
                : currentFilter === 'active' 
                ? 'tasks' 
                : 'check-double';
                
            todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-${emptyIcon}"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', todo.id);
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleTodo(todo.id));
                
                const span = document.createElement('span');
                span.className = 'todo-text';
                span.textContent = todo.text;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.title = "항목 삭제";
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
                
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
                
                // 각 항목에 애니메이션 지연 효과 추가
                setTimeout(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateY(0)';
                }, 50 * filteredTodos.indexOf(todo));
            });
        }

        // 통계 업데이트
        completedCount.textContent = todos.filter(todo => todo.completed).length;
        totalCount.textContent = todos.length;
        
        // 진행 상황에 따른 모션 효과
        const progressRatio = todos.length > 0 ? todos.filter(todo => todo.completed).length / todos.length : 0;
        
        if (progressRatio === 1 && todos.length > 0) {
            // 모든 할 일 완료 시 축하 효과
            celebrateCompletion();
        }
    }
    
    // 모든 할 일 완료 시 축하 효과
    function celebrateCompletion() {
        if (document.querySelector('.celebration')) return;
        
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '<span>🎉</span><span>모든 할 일을 완료했습니다!</span>';
        
        document.querySelector('.stats').appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 3000);
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
            const filter = btn.dataset.filter;
            if (filter !== currentFilter) {
                changeFilter(filter);
                // 버튼 클릭 효과
                btn.classList.add('btn-clicked');
                setTimeout(() => {
                    btn.classList.remove('btn-clicked');
                }, 200);
            }
        });
    });
    
    // 초기 렌더링
    renderTodos();
    
    // 앱 초기화 애니메이션
    document.querySelector('.app-container').classList.add('app-loaded');
});