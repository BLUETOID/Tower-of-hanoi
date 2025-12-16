class TowerOfHanoi {
    constructor() {
        this.towers = [[], [], []];
        this.moves = [];
        this.moveMeta = []; // parallel metadata for each move (call-stack, highlight info)
        this._callStack = [];
        this.moveCount = 0;
        this.isRunning = false;
        this.isAnimating = false; // prevents overlapping animations
        this.currentMoveIndex = 0; // for step mode
        this.diskCount = 5;
        this.speed = 1200;

        // C++ implementation to display (matches executed moves)
        this.codeLines = [
            "// C++ implementation",
            "void generateMoves(int n, char source, char auxiliary, char target) {",
            "  if (n == 1) {",
            "    moves.push_back({source, target});",
            "    return;",
            "  }",
            "  generateMoves(n - 1, source, target, auxiliary);",
            "  moves.push_back({source, target});",
            "  generateMoves(n - 1, auxiliary, source, target);",
            "}"
        ];
        
        this.initElements();
        this.bindEvents();
        this.reset();
    }
    
    initElements() {
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.diskCountSelect = document.getElementById('diskCount');
        this.speedSelect = document.getElementById('speed');
        this.moveCountDisplay = document.getElementById('moveCount');
        this.minMovesDisplay = document.getElementById('minMoves');
        this.statusDisplay = document.getElementById('status');
        this.towerElements = [
            document.querySelector('#tower-0 .disks-container'),
            document.querySelector('#tower-1 .disks-container'),
            document.querySelector('#tower-2 .disks-container')
        ];
        this.codeBlock = document.getElementById('codeBlock');
        this.callFramesContainer = document.querySelector('.call-frames');
        this.stepBtn = document.getElementById('stepBtn');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.diskCountSelect.addEventListener('change', (e) => {
            this.diskCount = parseInt(e.target.value);
            this.reset();
        });
        this.speedSelect.addEventListener('change', (e) => {
            this.speed = parseInt(e.target.value);
        });
        if (this.stepBtn) this.stepBtn.addEventListener('click', () => this.step());
    }
    
    reset() {
        this.isRunning = false;
        this.moveCount = 0;
        this.moves = [];
        this.moveMeta = [];
        this._callStack = [];
        this.towers = [[], [], []];
        this.currentMoveIndex = 0;
        this.isAnimating = false;
        if (this.stepBtn) this.stepBtn.disabled = false;
        
        // Initialize first tower with all disks
        for (let i = this.diskCount; i >= 1; i--) {
            this.towers[0].push(i);
        }
        
        this.renderCodeBlock();
        this.clearCallStackDisplay();
        this.updateDisplay();
        this.updateMoveCount();
        this.updateMinMoves();
        this.statusDisplay.textContent = 'Click Start to begin the animation';
        this.statusDisplay.classList.remove('complete');
        this.startBtn.disabled = false;
        this.diskCountSelect.disabled = false;
    }
    
    updateDisplay() {
        // Clear all tower displays
        this.towerElements.forEach(el => el.innerHTML = '');
        
        // Render disks on each tower
        this.towers.forEach((tower, towerIndex) => {
            tower.forEach((diskSize) => {
                const disk = document.createElement('div');
                disk.className = `disk disk-${diskSize}`;
                disk.dataset.size = diskSize;
                this.towerElements[towerIndex].appendChild(disk);
            });
        });
    }
    
    updateMoveCount() {
        this.moveCountDisplay.textContent = this.moveCount;
    }
    
    updateMinMoves() {
        const minMoves = Math.pow(2, this.diskCount) - 1;
        this.minMovesDisplay.textContent = minMoves;
    }
    
    // Generate all moves using recursive algorithm
    generateMoves(n, source, auxiliary, target) {
        // push current frame
        this._callStack.push({ n, source, auxiliary, target });

        if (n === 1) {
            this.moves.push({ from: source, to: target });
            // record metadata: base case => highlight the push line (index 2)
            this.moveMeta.push({ callStack: [...this._callStack], highlightLine: 2 });
            this._callStack.pop();
            return;
        }

        this.generateMoves(n - 1, source, target, auxiliary);

        this.moves.push({ from: source, to: target });
        // record metadata: the explicit push of the nth disk => highlight the push line (index 6)
        this.moveMeta.push({ callStack: [...this._callStack], highlightLine: 6 });

        this.generateMoves(n - 1, auxiliary, source, target);

        this._callStack.pop();
    }
    
    async start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startBtn.disabled = true;
        if (this.stepBtn) this.stepBtn.disabled = true;
        this.diskCountSelect.disabled = true;
        this.currentMoveIndex = 0;
        this.statusDisplay.textContent = 'Solving...';

        // Generate all moves and metadata
        this.moves = [];
        this.moveMeta = [];
        this._callStack = [];
        this.generateMoves(this.diskCount, 0, 1, 2);

        // Execute moves with animation, showing the corresponding code & call-stack
        for (let i = 0; i < this.moves.length; i++) {
            const move = this.moves[i];
            const meta = this.moveMeta[i];

            if (!this.isRunning) break;

            if (meta) {
                this.showCodeAndStack(meta);
                await this.delay(120); // small pause so user sees current line
            }

            await this.animateMove(move.from, move.to);
            this.moveCount++;
            this.updateMoveCount();
        }

        if (this.isRunning) {
            this.statusDisplay.textContent = 'Complete! All disks moved successfully.';
            this.statusDisplay.classList.add('complete');
        }

        this.isRunning = false;
        this.startBtn.disabled = false;
        if (this.stepBtn) this.stepBtn.disabled = false;
        this.diskCountSelect.disabled = false;
    }

    async step() {
        if (this.isAnimating) return;

        // If we don't have moves, generate them
        if (!this.moves || this.moves.length === 0) {
            this.moves = [];
            this.moveMeta = [];
            this._callStack = [];
            this.generateMoves(this.diskCount, 0, 1, 2);
            this.currentMoveIndex = 0;
        }

        if (this.currentMoveIndex >= this.moves.length) {
            this.statusDisplay.textContent = 'All moves completed.';
            this.statusDisplay.classList.add('complete');
            return;
        }

        // Prepare UI state
        if (this.stepBtn) this.stepBtn.disabled = true;
        this.startBtn.disabled = true;
        this.diskCountSelect.disabled = true;
        this.statusDisplay.textContent = `Stepping... (${this.currentMoveIndex + 1}/${this.moves.length})`;

        this.isAnimating = true;
        const meta = this.moveMeta[this.currentMoveIndex];
        if (meta) {
            this.showCodeAndStack(meta);
            await this.delay(120);
        }

        const move = this.moves[this.currentMoveIndex];
        await this.animateMove(move.from, move.to);

        this.moveCount++;
        this.updateMoveCount();

        this.currentMoveIndex++;
        this.isAnimating = false;

        // Update UI after step
        if (this.currentMoveIndex >= this.moves.length) {
            this.statusDisplay.textContent = 'Complete! All disks moved successfully.';
            this.statusDisplay.classList.add('complete');
            if (this.stepBtn) this.stepBtn.disabled = true;
            this.startBtn.disabled = false;
            this.diskCountSelect.disabled = false;
        } else {
            this.statusDisplay.textContent = `Ready for next step (${this.currentMoveIndex + 1}/${this.moves.length})`;
            if (this.stepBtn) this.stepBtn.disabled = false;
        }
    }
    
    async animateMove(fromTower, toTower) {
        const disk = this.towers[fromTower].pop();
        const diskElement = this.towerElements[fromTower].lastElementChild;
        
        if (!diskElement) return;
        
        // Get positions
        const diskRect = diskElement.getBoundingClientRect();
        const fromTowerRect = this.towerElements[fromTower].getBoundingClientRect();
        const toTowerRect = this.towerElements[toTower].getBoundingClientRect();
        
        // Calculate target position
        const targetDiskCount = this.towers[toTower].length;
        const diskHeight = 26; // disk height + margin
        
        // Start position
        diskElement.style.position = 'fixed';
        diskElement.style.left = `${diskRect.left}px`;
        diskElement.style.top = `${diskRect.top}px`;
        diskElement.style.zIndex = '100';
        diskElement.classList.add('moving');
        
        // Phase 1: Move up
        await this.delay(20);
        diskElement.style.top = `${fromTowerRect.top - 60}px`;
        
        await this.delay(this.speed * 0.4);
        
        // Phase 2: Move horizontally
        const toTowerCenterX = toTowerRect.left + toTowerRect.width / 2;
        const diskWidth = diskRect.width;
        diskElement.style.left = `${toTowerCenterX - diskWidth / 2}px`;
        
        await this.delay(this.speed * 0.4);
        
        // Phase 3: Move down
        const targetTop = toTowerRect.bottom - (targetDiskCount + 1) * diskHeight + 4;
        diskElement.style.top = `${targetTop}px`;
        
        await this.delay(this.speed * 0.4);
        
        // Remove from DOM and update model
        diskElement.remove();
        this.towers[toTower].push(disk);
        
        // Re-render the target tower
        this.renderTower(toTower);
        
        // Update status
        const towerNames = ['A', 'B', 'C'];
        this.statusDisplay.textContent = `Move disk ${disk} from ${towerNames[fromTower]} to ${towerNames[toTower]}`;
    }
    
    renderTower(towerIndex) {
        this.towerElements[towerIndex].innerHTML = '';
        this.towers[towerIndex].forEach((diskSize) => {
            const disk = document.createElement('div');
            disk.className = `disk disk-${diskSize}`;
            disk.dataset.size = diskSize;
            this.towerElements[towerIndex].appendChild(disk);
        });
    }
    
    renderCodeBlock() {
        if (!this.codeBlock) return;
        this.codeBlock.innerHTML = '';
        this.codeLines.forEach((line, idx) => {
            const ln = document.createElement('div');
            ln.className = 'code-line';
            ln.dataset.idx = idx;
            ln.textContent = line;
            this.codeBlock.appendChild(ln);
        });
    }

    clearCallStackDisplay() {
        if (!this.callFramesContainer) return;
        this.callFramesContainer.innerHTML = '';
    }

    showCodeAndStack(meta) {
        // Highlight code line
        if (!this.codeBlock) return;
        const prev = this.codeBlock.querySelectorAll('.code-line.active');
        prev.forEach(p => p.classList.remove('active'));
        const lineEl = this.codeBlock.querySelector(`.code-line[data-idx='${meta.highlightLine}']`);
        if (lineEl) lineEl.classList.add('active');

        // Render call stack (root at top, current on bottom)
        if (!this.callFramesContainer) return;
        this.callFramesContainer.innerHTML = '';
        const stack = meta.callStack || [];
        const towerName = i => ['A','B','C'][i] || i;
        for (let i = 0; i < stack.length; i++) {
            const frame = stack[i];
            const f = document.createElement('div');
            f.className = 'call-frame';
            if (i === stack.length - 1) f.classList.add('top');
            f.textContent = `n=${frame.n}  |  ${towerName(frame.source)} → ${towerName(frame.target)}`;
            this.callFramesContainer.appendChild(f);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TowerOfHanoi();
});
