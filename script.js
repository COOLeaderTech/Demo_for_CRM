// ==================== GLOBAL STATE ====================
let currentScreen = 'landing-screen';
let activeMode = null; // Can be 'upload', 'matching', or 'reporting'
let selectedReportingMode = null;

// ==================== NAVIGATION ====================
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
}

// Landing screen options
document.querySelectorAll('.landing-card').forEach(card => {
    card.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        
        switch(action) {
            case 'dashboard':
                showScreen('crm-people-screen');
                break;
            case 'primeagent':
                showScreen('primeagent-screen');
                resetPrimeAgent();
                break;
            case 'lead-aggregation':
                showScreen('lead-aggregation-screen');
                break;
            case 'reporting':
                showScreen('primeagent-screen');
                activateReportingMode();
                break;
        }
    });
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const backTo = this.getAttribute('data-back');
        if (backTo === 'landing') {
            showScreen('landing-screen');
        }
    });
});

// ==================== PRIMEAGENT 2.0 ====================

// Reset PrimeAgent to normal state
function resetPrimeAgent() {
    activeMode = null;
    selectedReportingMode = null;
    
    document.getElementById('upload-btn').classList.remove('active');
    document.getElementById('matching-btn').classList.remove('active');
    document.getElementById('reporting-btn').classList.remove('active');
    
    document.getElementById('reporting-options').style.display = 'none';
    document.getElementById('upload-panel').style.display = 'none';
    
    document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// Deactivate all modes
function deactivateAllModes() {
    document.getElementById('upload-btn').classList.remove('active');
    document.getElementById('matching-btn').classList.remove('active');
    document.getElementById('reporting-btn').classList.remove('active');
    
    document.getElementById('reporting-options').style.display = 'none';
    document.getElementById('upload-panel').style.display = 'none';
    
    selectedReportingMode = null;
    document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// Activate Reporting Mode (from Landing Option 4)
function activateReportingMode() {
    deactivateAllModes();
    activeMode = 'reporting';
    document.getElementById('reporting-btn').classList.add('active');
    document.getElementById('reporting-options').style.display = 'flex';
}

// Upload button
document.getElementById('upload-btn').addEventListener('click', function() {
    if (activeMode === 'upload') {
        // Toggle off
        activeMode = null;
        this.classList.remove('active');
        document.getElementById('upload-panel').style.display = 'none';
    } else {
        // Deactivate others and activate upload
        deactivateAllModes();
        activeMode = 'upload';
        this.classList.add('active');
        document.getElementById('upload-panel').style.display = 'block';
    }
});

document.getElementById('close-upload').addEventListener('click', function() {
    activeMode = null;
    document.getElementById('upload-btn').classList.remove('active');
    document.getElementById('upload-panel').style.display = 'none';
});

// Matching button
document.getElementById('matching-btn').addEventListener('click', function() {
    if (activeMode === 'matching') {
        // Toggle off
        activeMode = null;
        this.classList.remove('active');
    } else {
        // Deactivate others and activate matching
        deactivateAllModes();
        activeMode = 'matching';
        this.classList.add('active');
    }
});

// Reporting button
document.getElementById('reporting-btn').addEventListener('click', function() {
    if (activeMode === 'reporting') {
        // Toggle off
        activeMode = null;
        this.classList.remove('active');
        document.getElementById('reporting-options').style.display = 'none';
        selectedReportingMode = null;
        document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    } else {
        // Deactivate others and activate reporting
        deactivateAllModes();
        activeMode = 'reporting';
        this.classList.add('active');
        document.getElementById('reporting-options').style.display = 'flex';
    }
});

// Reporting sub-buttons
document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Deselect all
        document.querySelectorAll('.reporting-sub-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Select this one
        this.classList.add('selected');
        selectedReportingMode = this.getAttribute('data-report-type');
    });
});

// Chat functionality
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 500);
}

function addChatMessage(text, sender) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    
    if (sender === 'user') {
        messageDiv.className = 'chat-message';
        messageDiv.textContent = text;
    } else {
        messageDiv.className = 'ai-message';
        messageDiv.innerHTML = `<strong>AI:</strong> ${text}`;
    }
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function generateAIResponse(userMessage) {
    // Matching mode active
    if (activeMode === 'matching') {
        const lower = userMessage.toLowerCase();
        const hasFive = lower.includes('5') || lower.includes('five');
        const hasKid = lower.includes('kid');

        // Special demo behavior: query contains "5/five" and "kid"
        if (hasFive && hasKid) {
            return `
I found <strong>5 hot prospect homes</strong>, <strong>3 medium-to-hot</strong>, and <strong>7 medium</strong> prospect homes.

<div class="match-results">
  <div class="match-group">
    <h4>🔥 Hot matches (5)</h4>
    <div class="match-cards">
      <div class="match-card">2BR apartment • City center • €340k • Near primary school</div>
      <div class="match-card">2BR apartment • Pagrati • €330k • Quiet street, playground nearby</div>
      <div class="match-card">3BR apartment • Kallithea • €355k • 5-min walk to park</div>
      <div class="match-card">2BR + office • Neos Kosmos • €345k • Close to kindergarten</div>
      <div class="match-card">2BR apartment • Ampelokipi • €348k • Elevator, family building</div>
    </div>
  </div>

  <div class="match-group">
    <h4>🔥 Medium-to-hot (3)</h4>
    <div class="match-cards">
      <div class="match-card">2BR apartment • Center • €320k • 12-min from school</div>
      <div class="match-card">2BR apartment • Mets • €335k • Near playground, older building</div>
      <div class="match-card">2BR apartment • Kypseli • €310k • Large living room, bus to school</div>
    </div>
  </div>

  <div class="match-group">
    <h4>✨ Medium matches (7)</h4>
    <div class="match-cards">
      <div class="match-card">2BR apartment • Piraeus • €300k • 20-min commute to center</div>
      <div class="match-card">1BR + office • Center • €285k • Compact but bright</div>
      <div class="match-card">3BR apartment • Ilisia • €365k • Needs renovation</div>
      <div class="match-card">2BR apartment • Sepolia • €295k • New building, fewer schools around</div>
      <div class="match-card">2BR apartment • Victoria • €280k • Close to metro</div>
      <div class="match-card">2BR apartment • Kolonos • €290k • Top floor, no elevator</div>
      <div class="match-card">2BR apartment • Petralona • €305k • Near park, older interior</div>
    </div>
  </div>
</div>
            `;
        }

        // Default matching response if "5"/"five" + "kid" are NOT in the query
        return `Matching results: Based on your query "${userMessage}", I found 3 relevant properties in our agency documents. The top match is a family-friendly apartment close to schools and parks.`;
    }
    
    // Reporting mode active
    if (activeMode === 'reporting' && selectedReportingMode) {
        switch(selectedReportingMode) {
            case 'report-generation':
                return `<strong>Monthly Performance Report:</strong><br>
                Total deals closed: 12<br>
                Revenue generated: €2.4M<br>
                Active leads: 47<br>
                Conversion rate: 18.5%<br>
                Top performing agent: Maria K.<br>
                Average deal closure time: 23 days`;
                
            case 'predictive-forecast':
                return `<strong>Q4 2025 Forecast:</strong><br>
                Predicted deals: 15-18<br>
                Expected revenue: €3.1M - €3.5M<br>
                Market trend: Upward momentum in luxury segment<br>
                Hot neighborhoods: Kolonaki (+12%), Kifisia (+8%)<br>
                Recommended action: Increase inventory in premium locations`;
                
            case 'recommendations':
                return `<strong>Strategic Recommendations:</strong><br>
                1. Follow up with 8 warm leads from last week<br>
                2. Schedule property viewings for 3 high-priority buyers<br>
                3. Review pricing on 2 listings (market adjustment needed)<br>
                4. Contact past clients for referrals (23 eligible)<br>
                5. Attend networking event on Nov 15th`;
                
            case 'real-time-performance':
                return `<strong>Current Status (Live):</strong><br>
                Active conversations: 5<br>
                Scheduled viewings today: 3<br>
                Hot leads requiring immediate action: 2<br>
                Pending offers: 4<br>
                Documents awaiting signature: 1<br>
                System status: All integrations operational`;
        }
    }
    
    // Normal mode
    const normalResponses = [
        "I can help you with that. Our agency has extensive resources on property valuations, market trends, and client management.",
        "Based on the latest market data, I recommend focusing on properties in high-demand areas. Would you like specific neighborhood insights?",
        "I've analyzed your request. Let me search our document database for relevant information about this topic.",
        "Great question! I can provide detailed analytics and suggestions based on our agency's historical performance data.",
        "I'm here to assist with property matching, market analysis, reporting, and client management. What would you like to explore?"
    ];
    
    return normalResponses[Math.floor(Math.random() * normalResponses.length)];
}

// ==================== CRM — PEOPLE ====================

// Column-specific data for Maria K. (first row)
const mariaColumnData = {
    0: { // Name
        title: "Name",
        content: `<p><strong>Full Name:</strong> Maria Karathanasi</p>
                  <p><strong>Nickname:</strong> "Mari"</p>
                  <p><strong>Note:</strong> Maria is pregnant and they are looking for a family apartment.</p>`
    },
    1: { // Contact Information
        title: "Contact Information",
        content: `<p><strong>Primary:</strong> WhatsApp +30 691 234 5678</p>
                  <p><strong>Email:</strong> maria.karathanasi@example.com</p>
                  <p><strong>Alternative:</strong> Phone +30 210 123 4567 (home)</p>
                  <p><strong>Preferred Contact:</strong> WhatsApp (9am-7pm weekdays)</p>`
    },
    2: { // Property Requirements
        title: "Property Requirements",
        content: `<p><strong>Type:</strong> Buyer</p>
                  <p><strong>Bedrooms:</strong> 2BR (open to 3BR)</p>
                  <p><strong>Location:</strong> City center, safe neighborhood</p>
                  <p><strong>Budget:</strong> Up to €350,000</p>
                  <p><strong>Must-have:</strong> Parking space (if possible)</p>
                  <p><strong>Nice-to-have:</strong> Near schools, playground, parks</p>
                  <p><strong>Move-in:</strong> Flexible, within 6 months</p>`
    },
    3: { // Client Qualification
        title: "Client Qualification",
        content: `<p><strong>Status:</strong> Hot</p>
                  <p><strong>Financing:</strong> Pre-approved mortgage (€280k)</p>
                  <p><strong>Additional cash:</strong> €70k available</p>
                  <p><strong>Motivation:</strong> Very high (expecting baby in 4 months)</p>
                  <p><strong>Decision maker:</strong> Joint with husband (Kostas K.)</p>`
    },
    4: { // Stage
        title: "Stage",
        content: `<p><strong>Current Stage:</strong> Contacted</p>
                  <p><strong>First Contact:</strong> 2025-10-15 (via phone)</p>
                  <p><strong>Last Interaction:</strong> 2025-10-30 (WhatsApp)</p>
                  <p><strong>Viewings Scheduled:</strong> 2 properties (Nov 5 & Nov 8)</p>
                  <p><strong>Next Step:</strong> Show 2BR apartments in Pagrati and Kolonaki areas</p>`
    },
    5: { // Compliance Papers
        title: "Compliance Papers",
        content: `<p><strong>Submitted:</strong> ID (National ID card copy)</p>
                  <p><strong>Submitted:</strong> KYC form (completed)</p>
                  <p><strong>Pending:</strong> Proof of income (requested, awaiting)</p>
                  <p><strong>Pending:</strong> Bank statement (last 3 months)</p>
                  <p><strong>Status:</strong> 60% complete</p>`
    },
    6: { // Last Contact / Follow-up
        title: "Last Contact / Follow-up",
        content: `<p><strong>Last Contact:</strong> 2025-10-30</p>
                  <p><strong>Method:</strong> WhatsApp message</p>
                  <p><strong>Discussion:</strong> Confirmed viewing appointments, sent 3 property listings</p>
                  <p><strong>Next Follow-up:</strong> 2025-11-04 (day before first viewing)</p>
                  <p><strong>Agent Notes:</strong> Very responsive, asks good questions, serious buyer</p>`
    },
    7: { // Tag
        title: "Tag",
        content: `<p><strong>Primary Tag:</strong> Buyer</p>
                  <p><strong>Additional Tags:</strong> First-time buyer, Family, Urgent</p>
                  <p><strong>Lead Source:</strong> Facebook ad campaign (Oct 2025)</p>
                  <p><strong>Assigned Agent:</strong> You</p>`
    }
};

// Make only row 1 clickable with column-specific data
const clickableRow = document.querySelector('.clickable-row[data-row="1"]');
if (clickableRow) {
    const cells = clickableRow.querySelectorAll('td');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            const colIndex = parseInt(this.getAttribute('data-col'));
            showColumnModal(colIndex);
        });
    });
}

function showColumnModal(columnIndex) {
    const modal = document.getElementById('cell-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    
    const columnData = mariaColumnData[columnIndex];
    
    if (columnData) {
        modalTitle.textContent = columnData.title;
        modalText.innerHTML = columnData.content;
        modal.style.display = 'flex';
    }
}

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('cell-modal').style.display = 'none';
});

// Close modal on outside click
document.getElementById('cell-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// ==================== LEAD AGGREGATION ====================

// Handle lead actions
document.querySelectorAll('.action-select').forEach(select => {
    select.addEventListener('change', function() {
        const action = this.value;
        const row = this.closest('tr');
        const leadId = row.getAttribute('data-lead-id');
        
        if (action === 'approve') {
            approveLead(row);
        } else if (action === 'reject') {
            rejectLead(row);
        } else if (action === 'needs-review') {
            markNeedsReview(row);
        }
        
        // Reset select
        this.value = '';
    });
});

function approveLead(row) {
    // Extract lead data
    const cells = row.querySelectorAll('td');
    const name = cells[1].textContent;
    const source = cells[2].textContent;
    const propertyReq = cells[3].textContent;
    const qualification = cells[4].textContent;
    const stage = cells[5].textContent;
    const tag = cells[6].textContent;
    
    // Create contact info based on source
    const contactInfo = `Source: ${source}, awaiting contact details`;
    
    // Add to CRM table
    const crmTableBody = document.getElementById('crm-table-body');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${contactInfo}</td>
        <td>${propertyReq}</td>
        <td>${qualification}</td>
        <td>${stage}</td>
        <td>Missing</td>
        <td>Not contacted</td>
        <td>${tag}</td>
    `;
    
    crmTableBody.appendChild(newRow);
    
    // Remove from lead aggregation
    row.remove();
    
    // Update count
    updateLeadCount();
}

function rejectLead(row) {
    // Simply remove the row
    row.remove();
    
    // Update count
    updateLeadCount();
}

function markNeedsReview(row) {
    // Add red background class
    row.classList.add('needs-review-row');
}

function updateLeadCount() {
    const remainingLeads = document.querySelectorAll('#lead-table-body tr').length;
    document.getElementById('lead-count').textContent = remainingLeads;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Show landing screen by default
    showScreen('landing-screen');
});