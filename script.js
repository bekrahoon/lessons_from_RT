        const counter = document.getElementById('counter');
        const speedBtn = document.getElementById('speedBtn');
        const speedMinusBtn = document.getElementById('speedMinusBtn');
        const resetBtn = document.getElementById('resetBtn');

        let count = 0;

        speedBtn.addEventListener('click', function() {
            count++;
            counter.textContent = count;
            
            counter.style.backgroundColor = '#90EE90'; // светло-зеленый
            counter.style.color = '#FF6B6B'; // светло-красный
        });

        // SPEED -
        speedMinusBtn.addEventListener('click', function() {
            count--;
            counter.textContent = count;
            
            counter.style.backgroundColor = '#FFB6C1'; // светло-красный
            counter.style.color = '#90EE90'; // светло-зеленый
        });

        // RESET
        resetBtn.addEventListener('click', function() {
            count = 0;
            counter.textContent = count;
            
            // начальный вид 
            counter.style.backgroundColor = '#f0f0f0';
            counter.style.color = '#667eea';
        });