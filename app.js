/**
 * HyperToDo App 메인 모듈
 * 애플리케이션의 초기화 및 모듈 간 조정을 담당합니다.
 */
import { Storage } from './js/storage.js';
import { UI } from './js/ui.js';
import { TodoList } from './js/todoList.js';
import { Effects } from './js/effects.js';
import { Events } from './js/events.js';

const App = {
    // 초기화 메서드
    init() {
        // 필요한 모듈 초기화
        Storage.init();
        UI.init();
        TodoList.loadTodos(Storage);
        
        // 이벤트 핸들러에 참조 전달
        Events.init(UI, TodoList, Storage, Effects, this);
        
        // 앱 로드 애니메이션
        Effects.initializeAppAnimation();
        
        // 초기 렌더링
        this.render();
    },
    
    // 앱 렌더링
    render() {
        const filteredTodos = TodoList.getFilteredTodos();
        const currentFilter = TodoList.getCurrentFilter();
        
        // UI 업데이트
        UI.renderTodoList(
            filteredTodos, 
            currentFilter,
            (id) => Events.handleToggleTodo(id),
            (id) => Events.handleDeleteTodo(id),
            (id, newText) => Events.handleEditTodo(id, newText)
        );
        
        UI.updateStats(TodoList.getAllTodos());
        
        // 모든 일이 완료된 경우 축하 효과
        if (TodoList.isAllCompleted()) {
            UI.showCompletionCelebration();
        }
    }
};

// 앱 초기화 (DOMContentLoaded 이벤트 발생 시)
document.addEventListener('DOMContentLoaded', () => App.init());