

class TaskManager {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                this.init();
            }

            init() {
                this.renderTasks();
                this.setupEventListeners();
                this.updateProgress();
            }

            setupEventListeners() {
                const form = document.getElementById('add-task-form');
                const clearAll = document.getElementById('clear-all');
                const markAllDone = document.getElementById('mark-all-done');
                const markAllPending = document.getElementById('mark-all-pending');

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addTask();
                });

                clearAll.addEventListener('click', () => {
                    if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
                        this.clearAllTasks();
                    }
                });

                markAllDone.addEventListener('click', () => {
                    this.markAll(true);
                });

                markAllPending.addEventListener('click', () => {
                    this.markAll(false);
                });
            }

            addTask() {
                const input = document.getElementById('task-input');
                const text = input.value.trim();
                
                if (text) {
                    const task = {
                        id: Date.now(),
                        text: text,
                        completed: false,
                        createdAt: new Date().toISOString()
                    };
                    
                    this.tasks.push(task);
                    this.saveTasks();
                    this.renderTasks();
                    input.value = '';
                    input.focus();
                }
            }

            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.saveTasks();
                    this.renderTasks();
                }
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveTasks();
                this.renderTasks();
            }

            markAll(completed) {
                this.tasks.forEach(task => {
                    task.completed = completed;
                });
                this.saveTasks();
                this.renderTasks();
            }

            clearAllTasks() {
                this.tasks = [];
                this.saveTasks();
                this.renderTasks();
            }

            saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                this.updateProgress();
            }

            updateProgress() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                document.getElementById('progress-text').textContent = `${percentage}%`;
                document.getElementById('progress-bar').style.width = `${percentage}%`;
                document.getElementById('completed-count').textContent = completed;
                document.getElementById('total-count').textContent = total;
            }

            renderTasks() {
                const container = document.getElementById('tasks-container');
                const emptyState = document.getElementById('empty-state');
                
                if (this.tasks.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-8 text-gray-500" id="empty-state">
                            <i class="fas fa-clipboard-list text-4xl mb-3 opacity-50"></i>
                            <p>Nenhuma tarefa ainda. Adicione sua primeira tarefa!</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = this.tasks.map(task => `
                    <div class="checklist-item flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${task.completed ? 'completed' : ''} fade-in">
                        <div class="flex items-center flex-1">
                            <input 
                                type="checkbox" 
                                ${task.completed ? 'checked' : ''} 
                                onchange="taskManager.toggleTask(${task.id})"
                                class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3 cursor-pointer"
                            >
                            <span class="item-text text-gray-800 font-medium flex-1">${task.text}</span>
                        </div>
                        <button 
                            onclick="taskManager.deleteTask(${task.id})" 
                            class="ml-3 p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        // Initialize the task manager
        const taskManager = new TaskManager();