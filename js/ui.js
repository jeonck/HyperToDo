/**
 * UI 관리 모듈
 * 화면 렌더링 및 사용자 인터페이스 요소를 관리합니다.
 */
export const UI = {
    elements: {},
    
    // UI 요소 초기화
    init() {
        // DOM 요소 캐싱
        this.elements = {
            todoInput: document.getElementById('todo-input'),
            addBtn: document.getElementById('add-btn'),
            todoList: document.getElementById('todo-list'),
            completedCount: document.getElementById('completed-count'),
            totalCount: document.getElementById('total-count'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            statsContainer: document.querySelector('.stats')
        };
    },
    
    // 할 일 목록 렌더링
    renderTodoList(todos, currentFilter, handleToggleTodo, handleDeleteTodo) {
        const todoList = this.elements.todoList;
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            this.renderEmptyState(currentFilter);
            return;
        }
        
        todos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo, handleToggleTodo, handleDeleteTodo);
            
            // 지연 애니메이션 효과
            setTimeout(() => {
                todoElement.style.opacity = '1';
                todoElement.style.transform = 'translateY(0)';
            }, 50 * index);
            
            todoList.appendChild(todoElement);
        });
    },
    
    // 빈 상태 메시지 렌더링
    renderEmptyState(filter) {
        const emptyMessage = filter === 'all' 
            ? '할 일 목록이 비어있습니다. 새로운 할 일을 추가해 보세요!' 
            : filter === 'active' 
            ? '진행 중인 할 일이 없습니다. 모든 일을 완료했군요!' 
            : '완료된 할 일이 없습니다.';
            
        const emptyIcon = filter === 'all' 
            ? 'clipboard-list' 
            : filter === 'active' 
            ? 'tasks' 
            : 'check-double';
            
        this.elements.todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${emptyIcon}"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
    },
    
    // 할 일 요소 생성
    createTodoElement(todo, handleToggleTodo, handleDeleteTodo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => handleToggleTodo(todo.id));
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = "항목 삭제";
        deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        return li;
    },
    
    // 통계 업데이트
    updateStats(todos) {
        const completedCount = todos.filter(todo => todo.completed).length;
        
        this.elements.completedCount.textContent = completedCount;
        this.elements.totalCount.textContent = todos.length;
    },
    
    // 완료 축하 메시지 표시
    showCompletionCelebration() {
        // 이미 축하 메시지가 있다면 추가하지 않음
        if (document.querySelector('.celebration')) return;
        
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '<span>🎉</span><span>모든 할 일을 완료했습니다!</span>';
        
        this.elements.statsContainer.appendChild(celebration);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 3000);
    },
    
    // 입력 필드 효과 (성공/에러)
    flashInputField(type) {
        const inputField = this.elements.todoInput;
        
        inputField.classList.add(`${type}-flash`);
        setTimeout(() => {
            inputField.classList.remove(`${type}-flash`);
        }, 500);
    },
    
    // 버튼 클릭 효과
    animateButtonClick(button) {
        button.classList.add('btn-clicked');
        setTimeout(() => {
            button.classList.remove('btn-clicked');
        }, 200);
    },
    
    // 필터 버튼 활성화 상태 업데이트
    updateFilterButtons(activeFilter) {
        this.elements.filterBtns.forEach(btn => {
            if (btn.dataset.filter === activeFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    // 입력 필드 초기화
    clearInput() {
        this.elements.todoInput.value = '';
    },
    
    // 입력 필드 값 가져오기
    getInputValue() {
        return this.elements.todoInput.value;
    }
};