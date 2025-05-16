/**
 * 스토리지 관리 모듈
 * 로컬 스토리지를 통한 데이터의 저장 및 불러오기를 담당합니다.
 */
export const Storage = {
    STORAGE_KEY: 'hypertodo-items',
    
    // 초기화 메서드
    init() {
        // 스토리지 유효성 검사
        this.validateStorage();
    },
    
    // 로컬 스토리지 유효성 확인
    validateStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            console.error('로컬 스토리지를 사용할 수 없습니다:', e);
            return false;
        }
    },
    
    // 할 일 목록 저장
    saveTodos(todos) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
            console.log('로컬 스토리지에 저장됨:', todos);
            return true;
        } catch (error) {
            console.error('로컬 스토리지에 저장 중 오류 발생:', error);
            return false;
        }
    },
    
    // 할 일 목록 불러오기
    getTodos() {
        try {
            const savedTodos = localStorage.getItem(this.STORAGE_KEY);
            return savedTodos ? JSON.parse(savedTodos) : [];
        } catch (error) {
            console.error('로컬 스토리지에서 불러오는 중 오류 발생:', error);
            return [];
        }
    }
};