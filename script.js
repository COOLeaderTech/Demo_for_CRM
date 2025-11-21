// ==================== GLOBAL STATE ====================
let currentScreen = 'landing-screen';
let activeMode = null; // 'upload', 'matching', 'reporting'
let selectedReportingMode = null;

// ==================== NAVIGATION ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
}

// Landing screen options
document.querySelectorAll('.landing-card').forEach(card => {
    card.addEventListener('click', function () {
        const action = this.getAttribute('data-action');

        switch (action) {
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
    btn.addEventListener('click', function () {
        const backTo = this.getAttribute('data-back');
        if (backTo === 'landing') {
            showScreen('landing-screen');
        }
    });
});

// ==================== PRIMEAGENT 2.0 ====================

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

function activateReportingMode() {
    deactivateAllModes();
    activeMode = 'reporting';
    document.getElementById('reporting-btn').classList.add('active');
    document.getElementById('reporting-options').style.display = 'flex';
}

// Upload button
document.getElementById('upload-btn').addEventListener('click', function () {
    if (activeMode === 'upload') {
        activeMode = null;
        this.classList.remove('active');
        document.getElementById('upload-panel').style.display = 'none';
    } else {
        deactivateAllModes();
        activeMode = 'upload';
        this.classList.add('active');
        document.getElementById('upload-panel').style.display = 'block';
    }
});

document.getElementById('close-upload').addEventListener('click', function () {
    activeMode = null;
    document.getElementById('upload-btn').classList.remove('active');
    document.getElementById('upload-panel').style.display = 'none';
});

// Matching button
document.getElementById('matching-btn').addEventListener('click', function () {
    if (activeMode === 'matching') {
        activeMode = null;
        this.classList.remove('active');
    } else {
        deactivateAllModes();
        activeMode = 'matching';
        this.classList.add('active');
    }
});

// Reporting button
document.getElementById('reporting-btn').addEventListener('click', function () {
    if (activeMode === 'reporting') {
        activeMode = null;
        this.classList.remove('active');
        document.getElementById('reporting-options').style.display = 'none';
        selectedReportingMode = null;
        document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    } else {
        deactivateAllModes();
        activeMode = 'reporting';
        this.classList.add('active');
        document.getElementById('reporting-options').style.display = 'flex';
    }
});

// Reporting sub-buttons
document.querySelectorAll('.reporting-sub-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.reporting-sub-btn').forEach(b => {
            b.classList.remove('selected');
        });
        this.classList.add('selected');
        selectedReportingMode = this.getAttribute('data-report-type');
    });
});

// ==================== CHAT ====================
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Event delegation for report action buttons
document.getElementById('chat-history').addEventListener('click', function (e) {
    if (e.target.classList.contains('report-action-btn')) {
        const action = e.target.getAttribute('data-action');
        if (action === 'send-manager') {
            e.target.disabled = true;
            e.target.textContent = 'Sent to manager';
            addChatMessage('I’ve noted this report as sent to your broker/manager.', 'ai');
        } else if (action === 'regenerate-report') {
            const newReport = generateBrokerReport(true);
            addChatMessage(newReport, 'ai', true);
        }
    }
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;

    addChatMessage(message, 'user');

    input.value = '';

    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai', true);
    }, 350);
}

function addChatMessage(text, sender, isHtml = false) {
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

// ==================== AI RESPONSE LOGIC ====================
function generateAIResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    // -------- MATCHING MODE (PrimeAgent Matching demo) --------
    if (activeMode === 'matching') {
        const hasFive = lower.includes('5') || lower.includes('five');      // Case 1
        const hasPutney = lower.includes('putney') || lower.includes('patney'); // Case 3
        const hasCar = lower.includes('car');                               // Case 2

        // Priority: five -> putney -> car

        // Case 1: five-year-old kid → schools + big parking
        if (hasFive) {
            return `
Once you mentioned a <strong>5-year-old kid</strong>, I prioritised family homes in <strong>London</strong> that are close to schools and kindergartens — with generous parking so the parents never fight for a spot.

I found <strong>5 hot prospect homes</strong>, <strong>3 medium-to-hot</strong>, and <strong>7 medium</strong> prospect homes.

<div class="match-results">
  <div class="match-group">
    <h4>🔥 Hot matches (5)</h4>
    <div class="match-cards">
      <div class="match-card">
        3BR semi-detached • Wimbledon • £780k<br>
        • 4-min walk to primary school & nursery<br>
        • Driveway with space for 2 cars<br>
        • Quiet cul-de-sac, very family focused
      </div>
      <div class="match-card">
        3BR house • Southfields • £765k<br>
        • Short walk to two primary schools<br>
        • Off-street parking for 2 cars<br>
        • Parks and playgrounds within 5 minutes
      </div>
      <div class="match-card">
        2BR + study • Clapham South • £745k<br>
        • 6-min walk to local primary<br>
        • Allocated parking in gated courtyard<br>
        • Easy access to Northern line for parents’ commute
      </div>
      <div class="match-card">
        3BR terraced • Finchley • £735k<br>
        • Several schools in a 10-min walk radius<br>
        • Private driveway for 2 cars<br>
        • Calm residential street, family neighbours
      </div>
      <div class="match-card">
        3BR end-of-terrace • Richmond • £810k<br>
        • Close to primary & green spaces<br>
        • Large front drive fitting 2–3 cars<br>
        • Ideal for drop-offs and weekend trips
      </div>
    </div>
  </div>

  <div class="match-group">
    <h4>🔥 Medium-to-hot (3)</h4>
    <div class="match-cards">
      <div class="match-card">
        2BR flat • Highbury & Islington • £730k<br>
        • Walkable to schools and parks<br>
        • Allocated parking for 1 car<br>
        • Strong area for young families
      </div>
      <div class="match-card">
        3BR maisonette • Canary Wharf fringe • £760k<br>
        • Nursery and primary within walking distance<br>
        • Underground parking for 1–2 cars<br>
        • Modern building with lift and concierge
      </div>
      <div class="match-card">
        2BR flat • Canada Water • £720k<br>
        • Close to school and large playground<br>
        • Allocated parking bay in the block<br>
        • Great mix of green & city access
      </div>
    </div>
  </div>

  <div class="match-group">
    <h4>✨ Medium matches (7)</h4>
    <div class="match-cards">
      <div class="match-card">2BR flat • Deptford • £640k • Schools a bit further, 1 parking space included</div>
      <div class="match-card">3BR maisonette • Harrow • £600k • Several schools nearby, street parking is easier</div>
      <div class="match-card">2BR flat • Lewisham • £625k • Good transport, smaller allocated parking</div>
      <div class="match-card">3BR flat • Tottenham Hale • £610k • Near schools, shared parking court</div>
      <div class="match-card">2BR flat • Woolwich • £615k • New-build with 1 parking space, longer school walks</div>
      <div class="match-card">2BR flat • Kentish Town • £705k • Close to schools, residents’ permit parking</div>
      <div class="match-card">3BR house • Bromley fringe • £590k • Driveway + good schools, longer commute in</div>
    </div>
  </div>
</div>
            `;
        }

        // Case 3: Putney / Patney → close to tube line serving Putney, no parking
        if (hasPutney) {
            return `
You mentioned <strong>Putney</strong>, so I zoomed into a home that works well without a car — right next to the tube line that serves the Putney area.

<div class="match-results">
  <div class="match-group">
    <h4>🚶 Putney-area match (no-car lifestyle)</h4>
    <div class="match-cards">
      <div class="match-card">
        2BR flat • Putney / East Putney • £780k<br>
        • About 5–7 minutes on foot to <strong>East Putney</strong> on the <strong>District line</strong><br>
        • Direct District line connection through the Putney area<br>
        • Supermarkets, cafés, and schools all walkable<br>
        • <strong>No dedicated parking</strong> — built for tube and walking
      </div>
    </div>
  </div>
</div>
            `;
        }

        // Case 2: car → no-car lifestyle, tube + walkability, no parking
        if (hasCar) {
            return `
You brought up the word <strong>car</strong>, so here’s the flip side: what it looks like if the family lives as if they have <strong>no car at all</strong> — everything built around the tube and walking, with no money tied up in parking.

<div class="match-results">
  <div class="match-group">
    <h4>🚶 Homes made for living without a car</h4>
    <div class="match-cards">
      <div class="match-card">
        2BR flat • Stockwell • £710k<br>
        • 3-min walk to <strong>Stockwell</strong> (Northern & Victoria lines)<br>
        • Groceries, pharmacy, and cafés within 5 minutes on foot<br>
        • <strong>No private parking</strong> — building optimised for public-transport lifestyle
      </div>
      <div class="match-card">
        2BR flat • Islington • £735k<br>
        • Short walk to <strong>Highbury & Islington</strong> (Victoria line & Overground)<br>
        • Parks, schools, and shops all reachable on foot<br>
        • <strong>No allocated parking</strong>, area works best without a car
      </div>
      <div class="match-card">
        3BR flat • Canary Wharf area • £740k<br>
        • 4-min walk to <strong>Canary Wharf</strong> (Jubilee & Elizabeth lines + DLR)<br>
        • Nurseries, offices, and daily needs all in walking distance<br>
        • <strong>No dedicated parking space</strong> — built for tube and DLR commuters
      </div>
    </div>
  </div>
</div>
            `;
        }

        // Generic fallback
        return `Matching results: Based on your query "${userMessage}", I found several relevant properties in our London portfolio. The top matches balance budget, location, schools, and access to transport.`;
    }

    // -------- REPORTING MODE (Broker / Manager reports) --------
    const wantsBrokerReport = lower.includes('broker') || lower.includes('manager');
    const wantsRegenerate = lower.includes('regenerate');

    if (activeMode === 'reporting') {
        if (wantsBrokerReport || wantsRegenerate || selectedReportingMode === 'report-generation') {
            return generateBrokerReport(wantsRegenerate);
        }

        if (selectedReportingMode === 'predictive-forecast') {
            return `<strong>Q4 2025 forecast (office level):</strong><br>
                • Predicted deals: 15–18<br>
                • Expected closed volume: €3.1M–€3.5M<br>
                • Trend: Upward in mid- to high-end stock<br>
                • Strong areas: Kolonaki (+12%), Kifisia (+8%)<br>
                • Focus: secure inventory and protect today’s pipeline.`;
        }

        if (selectedReportingMode === 'recommendations') {
            return `<strong>Next best actions for the team:</strong><br>
                1. Call back 8 warm leads from last week with no viewing yet.<br>
                2. Book viewings for 3 high-priority buyers who opened your emails.<br>
                3. Adjust price or marketing on 2 long-days-on-market listings.<br>
                4. Ask 5 happy clients for referrals this week.<br>
                5. Double-check compliance on 4 deals close to signing.`;
        }

        if (selectedReportingMode === 'real-time-performance') {
            return `<strong>Live activity snapshot:</strong><br>
                • Active conversations: 5<br>
                • Viewings today: 3<br>
                • Hot leads needing a call now: 2<br>
                • Pending offers: 4<br>
                • Docs waiting for signature: 1<br>
                • System status: All integrations running normally.`;
        }
    }

    // -------- NORMAL MODE --------
    const normalResponses = [
        "I can help you match buyers to homes, prepare a quick broker report, or check follow-ups. What do you want to see first?",
        "Tell me about the client or listing and I’ll pull out the key details for you.",
        "You can say things like “my broker wants a monthly report” or “match this buyer with 2BRs near the metro”.",
        "I can summarise your pipeline, highlight hot leads, and show what to focus on this week.",
        "Ask me about any client, deal, or area and I’ll give you a clear, simple answer."
    ];

    return normalResponses[Math.floor(Math.random() * normalResponses.length)];
}

// Generate broker / manager report (variant=false → first version, true → regenerated)
function generateBrokerReport(variant = false) {
    const v = variant ? 2 : 1;

    const metrics = v === 1 ? {
        period: 'Last 30 days',
        closedDeals: '18',
        closedDelta: '+3 vs previous 30 days',
        volume: '€6.2M',
        volumeDelta: '+9%',
        newLeads: '74',
        newLeadsDelta: 'Lead volume steady',
        avgResponse: '1h 42m',
        avgResponseHint: 'Down from 3h 10m — faster follow-up',
        convRate: '19%',
        convHint: 'Up from 16% — better qualification',
        pipeline: '€4.5M',
        pipelineHint: 'About €1.8M likely to close in the next 45 days'
    } : {
        period: 'This month so far',
        closedDeals: '21',
        closedDelta: '+4 vs same time last month',
        volume: '€6.8M',
        volumeDelta: '+11%',
        newLeads: '69',
        newLeadsDelta: 'Slightly fewer leads, higher quality',
        avgResponse: '1h 25m',
        avgResponseHint: 'Consistently under 2 hours all month',
        convRate: '20%',
        convHint: 'Above office target (18%)',
        pipeline: '€4.9M',
        pipelineHint: 'About €2.1M likely to close inside 45 days'
    };

    return `
<div class="report-block">
  <div class="report-header">
    <h3>Broker / Manager overview — ${metrics.period}</h3>
    <p>This report is built automatically from your CRM activity and deals, ready to email or discuss in your next meeting.</p>
  </div>

  <div class="report-metrics-grid">
    <div class="report-metric">
      <span class="report-metric-label">Closed deals</span>
      <span class="report-metric-value">${metrics.closedDeals}</span>
      <span class="report-metric-hint">${metrics.closedDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Closed volume</span>
      <span class="report-metric-value">${metrics.volume}</span>
      <span class="report-metric-hint">${metrics.volumeDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">New leads</span>
      <span class="report-metric-value">${metrics.newLeads}</span>
      <span class="report-metric-hint">${metrics.newLeadsDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Average response time</span>
      <span class="report-metric-value">${metrics.avgResponse}</span>
      <span class="report-metric-hint">${metrics.avgResponseHint}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Lead → deal conversion</span>
      <span class="report-metric-value">${metrics.convRate}</span>
      <span class="report-metric-hint">${metrics.convHint}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Active pipeline</span>
      <span class="report-metric-value">${metrics.pipeline}</span>
      <span class="report-metric-hint">${metrics.pipelineHint}</span>
    </div>
  </div>

  <div class="report-section">
    <h4>Agent highlights</h4>
    <ul>
      <li><strong>Maria K.</strong> — 6 closed deals, €1.9M volume, ~1h average response time.</li>
      <li><strong>Nikos P.</strong> — 4 listings taken, strong listing-to-meeting ratio.</li>
      <li><strong>Team overall</strong> — response time and conversion both improving.</li>
    </ul>
  </div>

  <div class="report-section">
    <h4>Opportunities for the next 30 days</h4>
    <ul>
      <li>Prioritise 9 hot leads with no viewing booked yet.</li>
      <li>Revisit 5 older listings (price or marketing refresh recommended).</li>
      <li>Lean into the top 2 lead sources that bring most closed volume.</li>
    </ul>
  </div>

  <div class="report-section">
    <h4>Notes for the broker / manager</h4>
    <ul>
      <li>The office is ahead on volume and conversion; risk is keeping the lead flow consistent.</li>
      <li>Fast follow-up is clearly tied to deals — keep response time under 2 hours where possible.</li>
      <li>Next week’s focus: protect the hot pipeline and clean up stalled opportunities.</li>
    </ul>
  </div>

  <div class="report-actions">
    <button class="report-action-btn" data-action="send-manager">Send to manager</button>
    <button class="report-action-btn secondary" data-action="regenerate-report">Regenerate report</button>
  </div>
</div>
`;
}

// ==================== CRM — PEOPLE ====================
const mariaColumnData = {
    0: {
        title: "Name",
        content: `<p><strong>Full name:</strong> Maria Karathanasi</p>
                  <p><strong>Nickname:</strong> "Mari"</p>
                  <p><strong>Note:</strong> Maria is pregnant and they are looking for a family apartment.</p>`
    },
    1: {
        title: "Contact details",
        content: `<p><strong>Primary:</strong> WhatsApp +30 691 234 5678</p>
                  <p><strong>Email:</strong> maria.karathanasi@example.com</p>
                  <p><strong>Alternative:</strong> Phone +30 210 123 4567 (home)</p>
                  <p><strong>Preferred contact:</strong> WhatsApp (09:00–19:00)</p>`
    },
    2: {
        title: "Need / Requirement",
        content: `<p><strong>Type:</strong> Buyer</p>
                  <p><strong>Bedrooms:</strong> 2BR (open to 3BR)</p>
                  <p><strong>Location:</strong> City centre, safe neighbourhood</p>
                  <p><strong>Budget:</strong> Up to €350,000</p>
                  <p><strong>Must-have:</strong> Parking space (if possible)</p>
                  <p><strong>Nice-to-have:</strong> Near schools, playground, parks</p>
                  <p><strong>Move-in:</strong> Within 6 months</p>`
    },
    3: {
        title: "Heat",
        content: `<p><strong>Status:</strong> Hot</p>
                  <p><strong>Financing:</strong> Pre-approved mortgage (€280k)</p>
                  <p><strong>Additional cash:</strong> €70k available</p>
                  <p><strong>Motivation:</strong> Very high (expecting baby in 4 months)</p>
                  <p><strong>Decision maker:</strong> Joint with husband (Kostas K.)</p>`
    },
    4: {
        title: "Stage",
        content: `<p><strong>Current stage:</strong> Contacted</p>
                  <p><strong>First contact:</strong> 2025-10-15 (phone)</p>
                  <p><strong>Last interaction:</strong> 2025-10-30 (WhatsApp)</p>
                  <p><strong>Viewings scheduled:</strong> 2 properties (Nov 5 & Nov 8)</p>
                  <p><strong>Next step:</strong> Show 2BR apartments in Pagrati and Kolonaki</p>`
    },
    5: {
        title: "Papers",
        content: `<p><strong>Submitted:</strong> ID (national ID card copy)</p>
                  <p><strong>Submitted:</strong> KYC form (completed)</p>
                  <p><strong>Pending:</strong> Proof of income</p>
                  <p><strong>Pending:</strong> Bank statement (last 3 months)</p>
                  <p><strong>Status:</strong> About 60% complete</p>`
    },
    6: {
        title: "Last contact / follow-up",
        content: `<p><strong>Last contact:</strong> 2025-10-30</p>
                  <p><strong>Method:</strong> WhatsApp message</p>
                  <p><strong>Summary:</strong> Confirmed viewing appointments, sent 3 listings</p>
                  <p><strong>Next follow-up:</strong> 2025-11-04 (day before first viewing)</p>
                  <p><strong>Agent notes:</strong> Very responsive, serious buyer</p>`
    },
    7: {
        title: "Type / tags",
        content: `<p><strong>Type:</strong> Buyer</p>
                  <p><strong>Tags:</strong> First-time buyer, Family, Urgent</p>
                  <p><strong>Lead source:</strong> Facebook ad campaign (Oct 2025)</p>
                  <p><strong>Assigned agent:</strong> You</p>`
    }
};

const clickableRow = document.querySelector('.clickable-row[data-row="1"]');
if (clickableRow) {
    const cells = clickableRow.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
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

document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('cell-modal').style.display = 'none';
});

document.getElementById('cell-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// ==================== LEAD AGGREGATION ====================
document.querySelectorAll('.action-select').forEach(select => {
    select.addEventListener('change', function () {
        const action = this.value;
        const row = this.closest('tr');

        if (action === 'approve') {
            approveLead(row);
        } else if (action === 'reject') {
            rejectLead(row);
        } else if (action === 'needs-review') {
            markNeedsReview(row);
        }

        this.value = '';
    });
});

function approveLead(row) {
    const cells = row.querySelectorAll('td');
    const name = cells[1].textContent;
    const source = cells[2].textContent;
    const propertyReq = cells[3].textContent;
    const qualification = cells[4].textContent;
    const stage = cells[5].textContent;
    const tag = cells[6].textContent;

    const contactInfo = `Source: ${source}, waiting to be contacted`;

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

    row.remove();
    updateLeadCount();
}

function rejectLead(row) {
    row.remove();
    updateLeadCount();
}

function markNeedsReview(row) {
    row.classList.add('needs-review-row');
}

function updateLeadCount() {
    const remainingLeads = document.querySelectorAll('#lead-table-body tr').length;
    document.getElementById('lead-count').textContent = remainingLeads;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    showScreen('landing-screen');
});