document.addEventListener('DOMContentLoaded', function() {

    // ============================
    // Disclaimer Modal
    // ============================
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const acceptDisclaimerBtn = document.getElementById('accept-disclaimer');

    // Always show disclaimer
    disclaimerModal.style.display = "flex";

    acceptDisclaimerBtn.addEventListener('click', () => {
        disclaimerModal.style.display = "none";
    });

    // ============================
    // Main App Elements
    // ============================
    const universitySelect = document.getElementById('university-select');
    const streamSelect = document.getElementById('stream-select');
    const yearSelect = document.getElementById('year-select');
    const subjectSelect = document.getElementById('subject-select');
    const modes = document.querySelectorAll('.mode');
    const predictBtn = document.getElementById('predict-btn');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progress-bar');
    const resultsSection = document.getElementById('results-section');
    const analysisLog = document.getElementById('analysis-log');

    let selectedMode = null;

    // Default selections
    universitySelect.value = 'calcutta';
    streamSelect.value = 'bba';
    yearSelect.value = '1';
    subjectSelect.value = 'pom';

    // ============================
    // Logging Helper
    // ============================
    function log(message, type = 'info') {
        const div = document.createElement('div');
        div.textContent = `> ${message}`;
        if(type === 'error') div.style.color = '#e53935';  // red
        else div.style.color = '#4caf50'; // green
        analysisLog.appendChild(div);
        analysisLog.scrollTop = analysisLog.scrollHeight;
    }

    // ============================
    // Mode Selection
    // ============================
    modes.forEach(mode => {
        mode.addEventListener('click', function() {
            modes.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            selectedMode = this.dataset.mode;

            analysisLog.innerHTML = "";
            log(`SYSTEM: ${universitySelect.options[universitySelect.selectedIndex].text.toUpperCase()}`);
            log(`STREAM: ${streamSelect.options[streamSelect.selectedIndex].text.toUpperCase()}`);
            log(`YEAR: ${yearSelect.options[yearSelect.selectedIndex].text.toUpperCase()}`);
            log(`SUBJECT: ${subjectSelect.options[subjectSelect.selectedIndex].text.toUpperCase()}`);
            log(`MODE: ${this.querySelector('.mode-title').textContent.toUpperCase()} SELECTED`);

            predictBtn.disabled = false;
        });
    });

    // Auto-select "Be Decent" mode by default
    document.querySelector('.mode-2').click();

    // ============================
    // Predict Button
    // ============================
    predictBtn.addEventListener('click', function() {
        if (!selectedMode) {
            alert("Please select a mode first!");
            return;
        }

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        predictBtn.disabled = true;
        resultsSection.style.display = 'none';
        analysisLog.innerHTML = "";

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                progressBar.style.width = '100%';

                setTimeout(() => {
                    loadPrediction(selectedMode, subjectSelect.value);
                    resultsSection.style.display = 'block';
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                    predictBtn.disabled = false;
                }, 500);
            }
            progressBar.style.width = progress + '%';
        }, 200);

        log(`ANALYZING: ${universitySelect.options[universitySelect.selectedIndex].text.toUpperCase()} ${streamSelect.options[streamSelect.selectedIndex].text.toUpperCase()}`);
        log(`SUBJECT: ${subjectSelect.options[subjectSelect.selectedIndex].text.toUpperCase()}`);
        log(`MODE: ${selectedMode.toUpperCase()}`);
        log("STATUS: FETCHING TOPICS...");
    });

    // ============================
    // Load Prediction Topics
    // ============================
    function loadPrediction(mode, subjectValue) {
        const file = mode === 'just-pass' ? 'pass.txt' : 'decent.txt';

        fetch(file)
            .then(response => response.text())
            .then(text => {
                const highTopics = document.getElementById('high-topics');
                const mediumTopics = document.getElementById('medium-topics');
                const lowTopics = document.getElementById('low-topics');

                highTopics.innerHTML = '';
                mediumTopics.innerHTML = '';
                lowTopics.innerHTML = '';

                const subjectMap = {
                    pom: "Principles of Management & Organizational Behavior",
                    ethics: "Business Ethics",
                    finance: "Financial Institutions & Markets",
                    communication: "Business Communication",
                    it: "IT in Business",
                    constitution: "Constitutional Values"
                };

                const subjectName = subjectMap[subjectValue];

                const regex = new RegExp(`\\d+\\.\\s*${subjectName}[\\s\\S]*?(?=\\n\\d+\\.|$)`, "i");
                const subjectSection = text.match(regex);

                if (!subjectSection) {
                    log(`ERROR: SUBJECT "${subjectName}" NOT FOUND IN ${file.toUpperCase()}`, 'error');
                    return;
                }

                log(`FILE LOADED: ${file.toUpperCase()}`);
                log(`SUBJECT SECTION FOUND: ${subjectName.toUpperCase()}`);
                log("STATUS: PARSING TOPICS...");

                const sectionText = subjectSection[0];
                const highMatch = sectionText.match(/High Probability([\s\S]*?)(Moderate Probability|Low Probability|$)/i);
                const moderateMatch = sectionText.match(/Moderate Probability([\s\S]*?)(Low Probability|$)/i);
                const lowMatch = sectionText.match(/Low Probability([\s\S]*)/i);

                if (highMatch) fillList(highTopics, highMatch[1]);
                if (moderateMatch) fillList(mediumTopics, moderateMatch[1]);
                if (lowMatch) fillList(lowTopics, lowMatch[1]);

                log("STATUS: TOPICS LOADED SUCCESSFULLY ✅");
            })
            .catch(err => {
                log(`ERROR LOADING FILE: ${err.message}`, 'error');
            });
    }

    // ============================
    // Fill List Helper
    // ============================
    function fillList(listElement, textBlock) {
        textBlock.trim().split('\n').forEach(line => {
            if (line.trim()) {
                const li = document.createElement('li');
                li.className = 'topic-item';
                li.textContent = line.replace(/^- /, '').trim();
                listElement.appendChild(li);
            }
        });
    }

});
