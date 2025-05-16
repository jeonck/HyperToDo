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
    renderTodoList(todos, currentFilter, handleToggleTodo, handleDeleteTodo, handleEditTodo) {
        const todoList = this.elements.todoList;
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            this.renderEmptyState(currentFilter);
            return;
        }
        
        todos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo, handleToggleTodo, handleDeleteTodo, handleEditTodo);
            
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
    createTodoElement(todo, handleToggleTodo, handleDeleteTodo, handleEditTodo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => handleToggleTodo(todo.id));
        
        const textContainer = document.createElement('div');
        textContainer.className = 'todo-text-container';
        
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        span.addEventListener('dblclick', () => this.activateEditMode(li, todo, handleEditTodo));
        
        textContainer.appendChild(span);
        
        // 수정 버튼 추가
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = "항목 수정";
        editBtn.addEventListener('click', () => this.activateEditMode(li, todo, handleEditTodo));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = "항목 삭제";
        deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));
        
        const actionBtns = document.createElement('div');
        actionBtns.className = 'action-buttons';
        actionBtns.appendChild(editBtn);
        actionBtns.appendChild(deleteBtn);
        
        li.appendChild(checkbox);
        li.appendChild(textContainer);
        li.appendChild(actionBtns);
        
        return li;
    },
    
    // 수정 모드 활성화
    activateEditMode(todoItem, todo, handleEditTodo) {
        // 이미 수정 중이면 무시
        if (todoItem.classList.contains('editing')) return;
        
        // 완료된 할 일은 수정 금지
        if (todo.completed) {
            this.showToast('완료된 항목은 수정할 수 없습니다.');
            return;
        }
        
        const textContainer = todoItem.querySelector('.todo-text-container');
        const originalText = todo.text;
        const textSpan = todoItem.querySelector('.todo-text');
        
        // 현재 텍스트 숨기기
        textSpan.style.display = 'none';
        
        // 입력 필드 생성
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = originalText;
        
        // 수정 완료 버튼
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-edit-btn';
        confirmBtn.innerHTML = '<i class="fas fa-check"></i>';
        confirmBtn.title = '수정 완료';
        
        // 수정 취소 버튼
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-edit-btn';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
        cancelBtn.title = '수정 취소';
        
        // 수정 버튼 그룹
        const editBtns = document.createElement('div');
        editBtns.className = 'edit-buttons';
        editBtns.appendChild(confirmBtn);
        editBtns.appendChild(cancelBtn);
        
        // 수정 요소 추가
        textContainer.appendChild(editInput);
        textContainer.appendChild(editBtns);
        
        // 수정 모드 활성화
        todoItem.classList.add('editing');
        
        // 입력 필드에 포커스
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
        
        // 추가 이벤트 리스너
        const handleConfirm = () => {
            const newText = editInput.value;
            this.deactivateEditMode(todoItem, textSpan, textContainer);
            
            if (newText !== originalText) {
                handleEditTodo(todo.id, newText);
            }
        };
        
        const handleCancel = () => {
            this.deactivateEditMode(todoItem, textSpan, textContainer);
        };
        
        // 이벤트 리스너 추가
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        
        // 키보드 이벤트 처리
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleConfirm();
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        });
    },
    
    // 수정 모드 비활성화
    deactivateEditMode(todoItem, textSpan, textContainer) {
        // 수정 모드 클래스 제거
        todoItem.classList.remove('editing');
        
        // 입력 필드 및 버튼 제거
        const editInput = textContainer.querySelector('.edit-input');
        const editBtns = textContainer.querySelector('.edit-buttons');
        
        if (editInput) textContainer.removeChild(editInput);
        if (editBtns) textContainer.removeChild(editBtns);
        
        // 원래 텍스트 표시
        textSpan.style.display = '';
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
    
    // 토스트 메시지 표시
    showToast(message, duration = 2000) {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 토스트 요소 생성
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // 토스트 요소 추가
        document.body.appendChild(toast);
        
        // 토스트 표시
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 토스트 자동 제거
        setTimeout(() => {
            toast.classList.remove('show');
            
            // 애니메이션 종료 후 요소 제거
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
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