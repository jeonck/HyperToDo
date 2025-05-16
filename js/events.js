/**
 * 이벤트 처리 모듈
 * 사용자 상호작용에 대한 이벤트 처리를 담당합니다.
 */
export const Events = {
    // 이벤트 핸들러 등록을 위한 초기화
    init(ui, todoList, storage, effects, app) {
        this.ui = ui;
        this.todoList = todoList;
        this.storage = storage;
        this.effects = effects;
        this.app = app;
        
        this.registerEvents();
    },
    
    // 이벤트 리스너 등록
    registerEvents() {
        const ui = this.ui;
        
        // 할 일 추가 버튼 이벤트
        ui.elements.addBtn.addEventListener('click', () => this.handleAddTodo());
        
        // 입력 필드 엔터키 이벤트
        ui.elements.todoInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleAddTodo();
            }
        });
        
        // 필터 버튼 이벤트
        ui.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                if (filter !== this.todoList.getCurrentFilter()) {
                    this.handleFilterChange(filter);
                    ui.animateButtonClick(btn);
                }
            });
        });
    },
    
    // 할 일 추가 핸들러
    handleAddTodo() {
        const text = this.ui.getInputValue();
        
        if (this.todoList.addTodo(text, this.storage)) {
            this.ui.clearInput();
            this.ui.flashInputField('success');
            this.effects.sounds.play('success');
            this.app.render();
        } else {
            this.ui.flashInputField('error');
        }
    },
    
    // 할 일 삭제 핸들러
    handleDeleteTodo(id) {
        if (this.todoList.deleteTodo(id, this.storage)) {
            this.effects.sounds.play('delete');
            this.app.render();
        }
    },
    
    // 할 일 수정 핸들러
    handleEditTodo(id, newText) {
        if (this.todoList.editTodo(id, newText, this.storage)) {
            this.effects.sounds.play('edit');
            this.ui.showToast('할 일이 수정되었습니다.');
            this.app.render();
        }
    },
    
    // 할 일 완료 상태 토글 핸들러
    handleToggleTodo(id) {
        const isCompleted = this.todoList.toggleTodo(id, this.storage);
        this.effects.sounds.play(isCompleted ? 'complete' : 'undo');
        this.app.render();
    },
    
    // 필터 변경 핸들러
    handleFilterChange(filter) {
        this.todoList.changeFilter(filter);
        this.ui.updateFilterButtons(filter);
        this.app.render();
    }
};