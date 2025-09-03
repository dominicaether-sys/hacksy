document.addEventListener('DOMContentLoaded', function() {
    const universitySelect = document.getElementById('university-select');
    const streamSelect = document.getElementById('stream-select');
    const yearSelect = document.getElementById('year-select');
    const subjectSelect = document.getElementById('subject-select');
    const modes = document.querySelectorAll('.mode');
    const predictBtn = document.getElementById('predict-btn');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progress-bar');
    const resultsSection = document.getElementById('results-section');
    const terminalText = document.querySelector('.terminal-text');

    let selectedMode = null;

    // Defaults
    universitySelect.value = 'calcutta';
    streamSelect.value = 'bba';
    yearSelect.value = '1';
    subjectSelect.value = 'pom';

    // Mode selection
    modes.forEach(mode => {
        mode.addEventListener('click', function() {
            modes.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            selectedMode = this.dataset.mode;

            terminalText.innerHTML = `
                <div>> SYSTEM: ${universitySelect.options[universitySelect.selectedIndex].text.toUpperCase()} SELECTED</div>
                <div>> STREAM: ${streamSelect.options[streamSelect.selectedIndex].text.toUpperCase()}</div>
                <div>> YEAR: ${yearSelect.options[yearSelect.selectedIndex].text.toUpperCase()}</div>
                <div>> SUBJECT: ${subjectSelect.options[subjectSelect.selectedIndex].text.toUpperCase()}</div>
                <div>> MODE: ${this.querySelector('.mode-title').textContent.toUpperCase()} SELECTED</div>
            `;
            predictBtn.disabled = false;
        });
    });

    // Auto-select Be Decent by default
    document.querySelector('.mode-2').click();

    // Predict button
    predictBtn.addEventListener('click', function() {
        if (!selectedMode) {
            alert("Please select a mode first!");
            return;
        }

        progressContainer.style.display = 'block';
        predictBtn.disabled = true;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    loadPrediction(selectedMode, subjectSelect.value);
                    resultsSection.style.display = 'block';
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                    predictBtn.disabled = false;
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);

        terminalText.innerHTML = `
            <div>> ANALYZING: ${universitySelect.options[universitySelect.selectedIndex].text.toUpperCase()} ${streamSelect.options[streamSelect.selectedIndex].text.toUpperCase()}</div>
            <div>> SUBJECT: ${subjectSelect.options[subjectSelect.selectedIndex].text.toUpperCase()}</div>
            <div>> MODE: ${selectedMode.toUpperCase()}</div>
            <div>> STATUS: FETCHING TOPICS FROM FILE...</div>
        `;
    });

    // Load prediction topics
    function loadPrediction(mode, subjectValue) {
        const file = mode === 'just-pass' ? 'pass.txt' : 'decent.txt';

        fetch(file)
            .then(response => {
                if (!response.ok) throw new Error(`File not found: ${file}`);
                return response.text();
            })
            .then(text => {
                const highTopics = document.getElementById('high-topics');
                const mediumTopics = document.getElementById('medium-topics');
                const lowTopics = document.getElementById('low-topics');

                highTopics.innerHTML = '';
                mediumTopics.innerHTML = '';
                lowTopics.innerHTML = '';

                // Map dropdown -> file headings
                const subjectMap = {
                    pom: "Principles of Management & Organizational Behavior",
                    ethics: "Business Ethics",
                    finance: "Financial Institutions & Markets",
                    communication: "Business Communication",
                    it: "IT in Business",
                    constitution: "Constitutional Values"
                };

                const subjectName = subjectMap[subjectValue];
                if (!subjectName) {
                    terminalText.innerHTML += `<div>> ERROR: SUBJECT NOT MAPPED</div>`;
                    return;
                }

                // Regex: find section starting with "n. SUBJECT" until next "n."
                const regex = new RegExp(`\\d+\\. ${subjectName}[\\s\\S]*?(?=\\d+\\. |$)`, "i");
                const subjectSection = text.match(regex);

                if (!subjectSection) {
                    terminalText.innerHTML += `<div>> ERROR: SUBJECT "${subjectName.toUpperCase()}" NOT FOUND IN ${file.toUpperCase()}</div>`;
                    return;
                }

                terminalText.innerHTML += `<div>> FILE LOADED: ${file.toUpperCase()} | SUBJECT: ${subjectName.toUpperCase()}</div>`;

                // Parse High / Moderate / Low
                const highMatch = subjectSection[0].match(/High Probability([\s\S]*?)Moderate Probability/);
                const moderateMatch = subjectSection[0].match(/Moderate Probability([\s\S]*?)Low Probability/);
                const lowMatch = subjectSection[0].match(/Low Probability([\s\S]*)/);

                if (highMatch) fillList(highTopics, highMatch[1]);
                if (moderateMatch) fillList(mediumTopics, moderateMatch[1]);
                if (lowMatch) fillList(lowTopics, lowMatch[1]);
            })
            .catch(err => {
                terminalText.innerHTML += `<div>> ERROR: ${err.message}</div>`;
                console.error(err);
            });
    }

    // Helper: fill topics into list
    function fillList(listElement, textBlock) {
        textBlock.trim().split('\n').forEach(line => {
            if (line.trim()) {
                const li = document.createElement('li');
                li.className = 'topic-item';
                li.textContent = line.replace(/^- /, '').toUpperCase();
                listElement.appendChild(li);
            }
        });
    }
});
