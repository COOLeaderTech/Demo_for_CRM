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
            e.target.textContent = 'Sent to Manager';
            addChatMessage('Report sent to manager from your AI in seconds.', 'ai');
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
    }, 400);
}

function addChatMessage(text, sender, isHtml = false) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');

    if (sender === 'user') {
        messageDiv.className = 'chat-message';
        messageDiv.textContent = text;
    } else {
        messageDiv.className = 'ai-message';
        if (isHtml) {
            messageDiv.innerHTML = `<strong>AI:</strong> ${text}`;
        } else {
            messageDiv.innerHTML = `<strong>AI:</strong> ${text}`;
        }
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ==================== AI RESPONSE LOGIC ====================
function generateAIResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    // -------- MATCHING MODE (PrimeAgent Matching demo) --------
    if (activeMode === 'matching') {
        const hasFive = lower.includes('5') || lower.includes('five');      // case 1
        const hasPutney = lower.includes('putney') || lower.includes('patney'); // case 3
        const hasCar = lower.includes('car');                               // case 2

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
        • Allocated parking space in gated courtyard<br>
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
You mentioned <strong>Putney</strong>, so I zoomed into a home that works perfectly without a car — right next to the tube line that serves Putney directly.

<div class="match-results">
  <div class="match-group">
    <h4>🚶 Featured Putney-area match (no car lifestyle)</h4>
    <div class="match-cards">
      <div class="match-card">
        2BR flat • Putney / East Putney • £780k<br>
        • About 5–7 minutes on foot to <strong>East Putney</strong> on the <strong>District line</strong><br>
        • Direct District line connection serving the Putney area<br>
        • Supermarkets, cafés, and schools all walkable<br>
        • <strong>No dedicated parking</strong> — you’re meant to live by tube and on foot here
      </div>
    </div>
  </div>
</div>
            `;
        }

        // Case 2: car → no-car lifestyle, tube + walkability, no parking
        if (hasCar) {
            return `
You now brought up the word <strong>car</strong>, so I’m showing you the opposite: what happens when the family lives as if they have <strong>no car at all</strong> — everything built around the tube and walking, with no money wasted on parking.

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
            // true → "regenerated" variant
            return generateBrokerReport(wantsRegenerate);
        }

        if (selectedReportingMode === 'predictive-forecast') {
            return `<strong>Q4 2025 Forecast:</strong><br>
                Predicted deals: 15–18<br>
                Expected revenue: €3.1M–€3.5M<br>
                Market trend: Upward momentum in luxury segment<br>
                Hot neighbourhoods: Kolonaki (+12%), Kifisia (+8%)<br>
                Recommended action: Increase inventory in premium locations`;
        }

        if (selectedReportingMode === 'recommendations') {
            return `<strong>Strategic Recommendations:</strong><br>
                1. Follow up with 8 warm leads from last week<br>
                2. Schedule property viewings for 3 high-priority buyers<br>
                3. Review pricing on 2 listings (market adjustment needed)<br>
                4. Contact past clients for referrals (23 eligible)<br>
                5. Double-check compliance on 4 near-closing deals`;
        }

        if (selectedReportingMode === 'real-time-performance') {
            return `<strong>Current Status (Live):</strong><br>
                Active conversations: 5<br>
                Scheduled viewings today: 3<br>
                Hot leads requiring immediate action: 2<br>
                Pending offers: 4<br>
                Documents awaiting signature: 1<br>
                System status: All integrations operational`;
        }
    }

    // -------- NORMAL MODE --------
    const normalResponses = [
        "I can help you with that. Our agency has resources on property valuations, market trends, and client management.",
        "Based on recent market data, I’d focus on high-demand areas first. Do you want neighbourhood-level insights?",
        "Let me search our document base and CRM data for the most relevant information on that.",
        "Great question. I can break down the numbers and show you what’s actually happening in your pipeline.",
        "I can assist with property matching, reporting for your broker, and lead follow-up. What should we tackle first?"
    ];

    return normalResponses[Math.floor(Math.random() * normalResponses.length)];
}

// Generate broker / manager report (variant=false → first version, true → regenerated)
function generateBrokerReport(variant = false) {
    // Two slightly different sets of numbers / wording
    const v = variant ? 2 : 1;

    const metrics = v === 1 ? {
        period: 'Last 30 days',
        closedDeals: '18',
        closedDelta: '+3 vs previous 30 days',
        volume: '€6.2M',
        volumeDelta: '+9%',
        newLeads: '74',
        newLeadsDelta: 'Lead volume stable',
        avgResponse: '1h 42m',
        avgResponseHint: 'Down from 3h 10m — faster follow-up',
        convRate: '19%',
        convHint: 'Up from 16% — better qualification',
        pipeline: '€4.5M',
        pipelineHint: '€1.8M expected to close in next 45 days'
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
        convHint: 'Stable, above office target (18%)',
        pipeline: '€4.9M',
        pipelineHint: '€2.1M likely to close inside 45 days'
    };

    return `
<div class="report-block">
  <div class="report-header">
    <h3>Broker Overview — ${metrics.period}</h3>
    <p>Instant report built from listings, CRM activity, and deals — ready for your broker/manager in seconds.</p>
  </div>

  <div class="report-metrics-grid">
    <div class="report-metric">
      <span class="report-metric-label">Closed deals</span>
      <span class="report-metric-value">${metrics.closedDeals}</span>
      <span class="report-metric-hint">${metrics.closedDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Sales volume</span>
      <span class="report-metric-value">${metrics.volume}</span>
      <span class="report-metric-hint">${metrics.volumeDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">New leads</span>
      <span class="report-metric-value">${metrics.newLeads}</span>
      <span class="report-metric-hint">${metrics.newLeadsDelta}</span>
    </div>
    <div class="report-metric">
      <span class="report-metric-label">Avg. response time</span>
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
      <li><strong>Maria K.</strong> — 6 closed deals, €1.9M volume, 1h avg. response.</li>
      <li><strong>Nikos P.</strong> — 4 listings taken, strong listing-to-meeting ratio.</li>
      <li><strong>Team overall</strong> — response time and conversion trending in the right direction.</li>
    </ul>
  </div>

  <div class="report-section">
    <h4>Opportunities for the next 30 days</h4>
    <ul>
      <li>Prioritise 9 hot leads with no viewing scheduled yet.</li>
      <li>Revisit 5 long-days-on-market listings with price or marketing refresh.</li>
      <li>Double down on top 2 lead sources; they generate most closed volume.</li>
    </ul>
  </div>

  <div class="report-section">
    <h4>Broker-level notes</h4>
    <ul>
      <li>The team is above target on volume and conversion; risk is lead consistency.</li>
      <li>Faster follow-up is clearly linked to higher close rate — keep under 2 hours.</li>
      <li>Focus next week: protect pipeline and clean up stalled opportunities.</li>
    </ul>
  </div>

  <div class="report-actions">
    <button class="report-action-btn" data-action="send-manager">Send to Manager</button>
    <button class="report-action-btn secondary" data-action="regenerate-report">Regenerate Report</button>
  </div>
</div>
`;
}

// ==================== CRM — PEOPLE ====================
const mariaColumnData = {
    0: {
        title: "Name",
        content: `<p><strong>Full Name:</strong> Maria Karathanasi</p>
                  <p><strong>Nickname:</strong> "Mari"</p>
                  <p><strong>Note:</strong> Maria is pregnant and they are looking for a family apartment.</p>`
    },
    1: {
        title: "Contact Information",
        content: `<p><strong>Primary:</strong> WhatsApp +30 691 234 5678</p>
                  <p><strong>Email:</strong> maria.karathanasi@example.com</p>
                  <p><strong>Alternative:</strong> Phone +30 210 123 4567 (home)</p>
                  <p><strong>Preferred Contact:</strong> WhatsApp (9am–7pm weekdays)</p>`
    },
    2: {
        title: "Property Requirements",
        content: `<p><strong>Type:</strong> Buyer</p>
                  <p><strong>Bedrooms:</strong> 2BR (open to 3BR)</p>
                  <p><strong>Location:</strong> City center, safe neighborhood</p>
                  <p><strong>Budget:</strong> Up to €350,000</p>
                  <p><strong>Must-have:</strong> Parking space (if possible)</p>
                  <p><strong>Nice-to-have:</strong> Near schools, playground, parks</p>
                  <p><strong>Move-in:</strong> Flexible, within 6 months</p>`
    },
    3: {
        title: "Client Qualification",
        content: `<p><strong>Status:</strong> Hot</p>
                  <p><strong>Financing:</strong> Pre-approved mortgage (€280k)</p>
                  <p><strong>Additional cash:</strong> €70k available</p>
                  <p><strong>Motivation:</strong> Very high (expecting baby in 4 months)</p>
                  <p><strong>Decision maker:</strong> Joint with husband (Kostas K.)</p>`
    },
    4: {
        title: "Stage",
        content: `<p><strong>Current Stage:</strong> Contacted</p>
                  <p><strong>First Contact:</strong> 2025-10-15 (via phone)</p>
                  <p><strong>Last Interaction:</strong> 2025-10-30 (WhatsApp)</p>
                  <p><strong>Viewings Scheduled:</strong> 2 properties (Nov 5 & Nov 8)</p>
                  <p><strong>Next Step:</strong> Show 2BR apartments in Pagrati and Kolonaki areas</p>`
    },
    5: {
        title: "Compliance Papers",
        content: `<p><strong>Submitted:</strong> ID (National ID card copy)</p>
                  <p><strong>Submitted:</strong> KYC form (completed)</p>
                  <p><strong>Pending:</strong> Proof of income (requested, awaiting)</p>
                  <p><strong>Pending:</strong> Bank statement (last 3 months)</p>
                  <p><strong>Status:</strong> 60% complete</p>`
    },
    6: {
        title: "Last Contact / Follow-up",
        content: `<p><strong>Last Contact:</strong> 2025-10-30</p>
                  <p><strong>Method:</strong> WhatsApp message</p>
                  <p><strong>Discussion:</strong> Confirmed viewing appointments, sent 3 property listings</p>
                  <p><strong>Next Follow-up:</strong> 2025-11-04 (day before first viewing)</p>
                  <p><strong>Agent Notes:</strong> Very responsive, asks good questions, serious buyer</p>`
    },
    7: {
        title: "Tag",
        content: `<p><strong>Primary Tag:</strong> Buyer</p>
                  <p><strong>Additional Tags:</strong> First-time buyer, Family, Urgent</p>
                  <p><strong>Lead Source:</strong> Facebook ad campaign (Oct 2025)</p>
                  <p><strong>Assigned Agent:</strong> You</p>`
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

    const contactInfo = `Source: ${source}, awaiting contact details`;

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