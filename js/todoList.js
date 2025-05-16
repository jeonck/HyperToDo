/**
 * 할 일 목록 관리 모듈
 * 할 일 데이터의 CRUD 작업과 상태 관리를 담당합니다.
 */
export const TodoList = {
    todos: [],
    currentFilter: 'all',
    
    // 로컬 스토리지에서 할 일 항목 불러오기
    loadTodos(storage) {
        this.todos = storage.getTodos();
        console.log('로드된 할 일 목록:', this.todos);
        return this.todos;
    },
    
    // 새 할 일 추가
    addTodo(text, storage) {
        if (!text.trim()) return false;
        
        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.push(todo);
        storage.saveTodos(this.todos);
        
        return true;
    },
    
    // 할 일 삭제
    deleteTodo(id, storage) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        storage.saveTodos(this.todos);
        
        return true;
    },
    
    // 할 일 완료 상태 토글
    toggleTodo(id, storage) {
        let wasCompleted = false;
        
        this.todos = this.todos.map(todo => {
            if (todo.id !== id) return todo;
            
            wasCompleted = !todo.completed;
            return { ...todo, completed: wasCompleted };
        });
        
        storage.saveTodos(this.todos);
        
        return wasCompleted;
    },
    
    // 필터 변경
    changeFilter(filter) {
        this.currentFilter = filter;
        return filter;
    },
    
    // 현재 필터에 따른 할 일 가져오기
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    },
    
    // 모든 할 일이 완료되었는지 확인
    isAllCompleted() {
        return this.todos.length > 0 && this.todos.every(todo => todo.completed);
    },
    
    // 현재 필터 가져오기
    getCurrentFilter() {
        return this.currentFilter;
    },
    
    // 모든 할 일 가져오기
    getAllTodos() {
        return this.todos;
    }
};