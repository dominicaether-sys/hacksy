// script.js

document.addEventListener("DOMContentLoaded", () => {
  const disclaimerModal = document.getElementById("disclaimer-modal");
  const acceptBtn = document.getElementById("accept-disclaimer");

  acceptBtn.addEventListener("click", () => {
    disclaimerModal.style.display = "none";
  });

  const subjectSelect = document.getElementById("subject-select");
  const predictBtn = document.getElementById("predict-btn");
  const progressBar = document.getElementById("progress-bar");
  const analysisLog = document.getElementById("analysis-log");
  const resultsSection = document.getElementById("results-section");

  const highTopics = document.getElementById("high-topics");
  const mediumTopics = document.getElementById("medium-topics");
  const lowTopics = document.getElementById("low-topics");

  let selectedMode = "just-pass";

  // Mode selection
  document.querySelectorAll(".mode").forEach(mode => {
    mode.addEventListener("click", () => {
      document.querySelectorAll(".mode").forEach(m => m.classList.remove("selected"));
      mode.classList.add("selected");
      selectedMode = mode.dataset.mode;
    });
  });

  // Dummy topics for demonstration
  const topicsData = {
    pom: {
      high: ["Organizational Behavior", "Management Principles"],
      medium: ["Motivation & Leadership", "Decision Making"],
      low: ["History of Management"]
    },
    ethics: {
      high: ["Corporate Governance", "Ethical Theories"],
      medium: ["CSR & Sustainability"],
      low: ["Business Law Basics"]
    },
    finance: {
      high: ["Financial Markets", "Banking Systems"],
      medium: ["Stock Valuation", "Mutual Funds"],
      low: ["Insurance Basics"]
    },
    communication: {
      high: ["Business Writing", "Presentation Skills"],
      medium: ["Email Etiquette", "Report Writing"],
      low: ["Networking Skills"]
    },
    it: {
      high: ["MIS Basics", "IT Trends"],
      medium: ["Database Management"],
      low: ["Hardware Overview"]
    },
    constitution: {
      high: ["Fundamental Rights", "Directive Principles"],
      medium: ["Parliament & Judiciary"],
      low: ["State Govt Structure"]
    }
  };

  function simulateProgress(callback) {
    let progress = 0;
    progressBar.style.width = "0%";
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        callback();
      }
      progressBar.style.width = progress + "%";
    }, 300);
  }

  predictBtn.addEventListener("click", () => {
    const subject = subjectSelect.value;
    if (!subject) {
      alert("Please select a subject first.");
      return;
    }

    resultsSection.style.display = "block";
    analysisLog.innerHTML = "";

    // Simulate analysis logs
    const logs = [
      `> ANALYZING SUBJECT: ${subject.toUpperCase()}`,
      `> MODE: ${selectedMode.toUpperCase()}`,
      "> EXTRACTING SYLLABUS DATA...",
      "> IDENTIFYING HIGH PROBABILITY TOPICS...",
      "> COMPILING STUDY PLAN..."
    ];

    let index = 0;
    const logInterval = setInterval(() => {
      if (index < logs.length) {
        analysisLog.innerHTML += `<div>${logs[index]}</div>`;
        analysisLog.scrollTop = analysisLog.scrollHeight;
        index++;
      } else {
        clearInterval(logInterval);
      }
    }, 500);

    // Simulate progress bar
    simulateProgress(() => {
      // Populate topics
      const data = topicsData[subject];
      highTopics.innerHTML = data.high.map(t => `<li>${t}</li>`).join("");
      mediumTopics.innerHTML = data.medium.map(t => `<li>${t}</li>`).join("");
      lowTopics.innerHTML = data.low.map(t => `<li>${t}</li>`).join("");

      analysisLog.innerHTML += "<div>> PREDICTION COMPLETE ✅</div>";
    });
  });
});
