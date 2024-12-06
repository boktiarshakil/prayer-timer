document.addEventListener('DOMContentLoaded', () => {
    const habitList = document.getElementById('habit-list');
    const scheduleList = document.getElementById('schedule-list');
    const addHabitBtn = document.getElementById('add-habit');

    // উদাহরণস্বরূপ হ্যাবিট যোগ করার ফাংশন
    addHabitBtn.addEventListener('click', () => {
        const habitName = prompt('অভ্যাসের নাম দিন:');
        const habitDuration = prompt('অভ্যাসের সময় (মিনিটে):');

        if (habitName && habitDuration) {
            const habitDiv = document.createElement('div');
            habitDiv.classList.add('habit');
            habitDiv.setAttribute('draggable', 'true');
            habitDiv.innerHTML = `
                <span>${habitName}</span>
                <input type="number" value="${habitDuration}" min="1"> মিনিট
            `;
            habitList.appendChild(habitDiv);
            addDragAndDrop();
        }
    });

    // ড্র্যাগ এবং ড্রপ ফিচার
    function addDragAndDrop() {
        const draggables = document.querySelectorAll('.habit');
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                updateSchedule();
            });
        });

        const container = habitList;
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.habit:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    addDragAndDrop();

    // সময়সূচী আপডেট করার ফাংশন
    function updateSchedule() {
        scheduleList.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(5, 10, 0); // ফজর নামাজের সময় শুরু

        const prayers = [
            { name: 'ফজর', time: '৫:১০ PM', duration: 35 },
            { name: 'যোহর', time: '১:১৫ PM', duration: 35 },
            { name: 'আসর', time: '৪:৩০ PM', duration: 35 },
            { name: 'মাগরিব', time: '৭:৩০ PM', duration: 35 },
            { name: 'ইশা', time: '৯:০০ PM', duration: 35 }
        ];

        prayers.forEach(prayer => {
            const li = document.createElement('li');
            li.textContent = `${prayer.name}: ${prayer.time} - ${prayer.time} + 35 মিনিট`;
            scheduleList.appendChild(li);
        });

        const habits = document.querySelectorAll('.habit');
        habits.forEach(habit => {
            const name = habit.querySelector('span').textContent;
            const duration = parseInt(habit.querySelector('input').value);
            const endTime = new Date(currentTime.getTime() + duration * 60000);

            const li = document.createElement('li');
            li.textContent = `${name}: ${formatTime(currentTime)} - ${formatTime(endTime)}`;
            scheduleList.appendChild(li);

            currentTime = endTime;
        });
    }

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 => 12
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    // প্রাথমিকভাবে সময়সূচী আপডেট
    updateSchedule();
});
