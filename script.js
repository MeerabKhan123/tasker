        let tasks = [];
        let currentFilter = 'all';

        function addTask() {
            const input = document.getElementById('taskInput');
            const priority = document.getElementById('prioritySelect').value;
            const taskText = input.value.trim();

            if (taskText === '') return;

            const task = {
                id: Date.now(),
                text: taskText,
                priority: priority,
                completed: false,
                time: new Date().toLocaleString()
            };

            tasks.unshift(task);
            input.value = '';
            renderTasks();
            updateStats();
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                updateStats();
            }
        }

        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
            updateStats();
        }

        function filterTasks(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderTasks();
        }

        function renderTasks() {
            const tasksList = document.getElementById('tasksList');
            let filteredTasks = tasks;

            if (currentFilter === 'active') {
                filteredTasks = tasks.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                filteredTasks = tasks.filter(t => t.completed);
            }

            if (filteredTasks.length === 0) {
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <h3>No tasks found</h3>
                        <p>Add a new task to get started!</p>
                    </div>
                `;
                return;
            }

            tasksList.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="task-checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id})">
                    <div class="task-content">
                        <div class="task-text">${task.text}</div>
                        <div class="task-meta">
                            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                            <span class="task-time">${task.time}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        renderTasks();
        updateStats();