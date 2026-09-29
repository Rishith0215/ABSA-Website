/**
 * Aspect-Based Sentiment Analysis (ABSA) Engine & UI Controller
 */

// Global App State
const ABSAState = {
    currentDomain: 'restaurant',
    customAspects: [],
    analysisResults: null,
    batchResults: [],
    theme: localStorage.getItem('absa_theme') || 'light'
};

// Domain Aspect Taxonomies
const AspectTaxonomy = {
    restaurant: {
        'Food': ['food', 'dish', 'meal', 'taste', 'flavor', 'pizza', 'burger', 'pasta', 'steak', 'sushi', 'soup', 'dessert', 'breakfast', 'lunch', 'dinner', 'portion', 'quality', 'freshness', 'delicious', 'recipe', 'cuisine', 'ingredient', 'cooked', 'fries', 'bread', 'sauce'],
        'Service': ['service', 'speed', 'order', 'wait', 'time', 'waiting', 'served', 'delivery', 'delay', 'prompt', 'attentive', 'slow', 'fast', 'quick'],
        'Staff': ['staff', 'waiter', 'waitress', 'server', 'manager', 'chef', 'host', 'employee', 'team', 'friendliness', 'behavior', 'polite', 'rude', 'courteous', 'attitude'],
        'Ambience': ['ambience', 'atmosphere', 'music', 'noise', 'decor', 'interior', 'seating', 'lighting', 'vibe', 'view', 'cozy', 'crowded', 'environment', 'tables'],
        'Price': ['price', 'cost', 'expensive', 'cheap', 'value', 'bill', 'overpriced', 'reasonable', 'affordable', 'worth', 'pricing', 'money', 'dollar', 'deal'],
        'Cleanliness': ['clean', 'hygiene', 'dirty', 'restroom', 'toilet', 'table', 'neat', 'sanitary', 'spotless', 'smell', 'tidy'],
        'Drinks': ['drink', 'coffee', 'tea', 'wine', 'beer', 'cocktail', 'beverage', 'bar', 'juice', 'smoothie', 'water']
    },
    hotel: {
        'Room': ['room', 'bed', 'mattress', 'pillow', 'bathroom', 'shower', 'balcony', 'view', 'ac', 'air conditioning', 'space', 'spacious', 'suite'],
        'Service': ['service', 'check-in', 'check-out', 'front desk', 'room service', 'housekeeping', 'luggage', 'concierge'],
        'Staff': ['staff', 'receptionist', 'concierge', 'team', 'manager', 'host', 'helpful', 'friendly', 'rude', 'polite'],
        'Location': ['location', 'position', 'area', 'distance', 'beach', 'center', 'airport', 'accessible', 'neighborhood', 'sightseeing'],
        'Cleanliness': ['clean', 'dirty', 'stain', 'smell', 'maintenance', 'housekeeping', 'hygienic', 'spotless'],
        'WiFi': ['wifi', 'wi-fi', 'internet', 'connection', 'signal', 'network', 'speed'],
        'Amenities': ['pool', 'gym', 'spa', 'breakfast', 'parking', 'elevator', 'facilities', 'fitness'],
        'Price': ['price', 'rate', 'cost', 'value', 'expensive', 'deal', 'worth', 'budget']
    },
    tech: {
        'Build Quality': ['build', 'material', 'quality', 'durable', 'plastic', 'aluminum', 'sturdy', 'fragile', 'premium', 'design', 'weight'],
        'Performance': ['speed', 'performance', 'processor', 'fast', 'lag', 'smooth', 'response', 'freezing', 'power', 'ram', 'gpu', 'cpu'],
        'Battery': ['battery', 'charge', 'charging', 'power', 'life', 'drain', 'endurance', 'mah', 'charger'],
        'Display': ['screen', 'display', 'resolution', 'brightness', 'colors', 'touch', 'panel', 'oled', 'lcd', 'fps', 'hz'],
        'Camera': ['camera', 'photo', 'video', 'picture', 'lens', 'resolution', 'clarity', 'sensor', 'zoom', 'portrait'],
        'Price': ['price', 'cost', 'expensive', 'value', 'affordable', 'budget', 'overpriced', 'deal'],
        'Support': ['support', 'warranty', 'service', 'help', 'refund', 'return', 'representative', 'customer service']
    },
    ecommerce: {
        'Shipping': ['shipping', 'delivery', 'transit', 'arrive', 'fast', 'late', 'dispatch', 'tracking', 'courier', 'carrier'],
        'Packaging': ['package', 'packaging', 'box', 'wrapped', 'sealed', 'damaged', 'wrapper'],
        'Product Quality': ['quality', 'item', 'size', 'color', 'fit', 'description', 'condition', 'defect', 'material'],
        'Price & Value': ['price', 'cost', 'value', 'discount', 'cheap', 'expensive', 'deal', 'worth'],
        'Customer Service': ['service', 'support', 'refund', 'return', 'exchange', 'response', 'chat', 'policy']
    }
};

// Sentiment Lexicon & Modifiers
const Lexicon = {
    positive: [
        'delicious', 'tasty', 'amazing', 'excellent', 'wonderful', 'great', 'good', 'awesome', 'fantastic',
        'prompt', 'friendly', 'clean', 'comfortable', 'fast', 'affordable', 'spotless', 'perfect', 'outstanding',
        'superb', 'polite', 'love', 'loved', 'enjoyed', 'best', 'helpful', 'top', 'smooth', 'value', 'fresh',
        'spacious', 'quick', 'cozy', 'sturdy', 'durable', 'high-quality', 'impressed', 'pleased', 'nice', 'pleasant',
        'brilliant', 'exceeded', 'recommend', 'flawless', 'delightful', 'courteous', 'spacious', 'warm', 'attentive'
    ],
    negative: [
        'bad', 'terrible', 'horrible', 'awful', 'slow', 'rude', 'dirty', 'expensive', 'overpriced', 'poor',
        'worst', 'disappointed', 'disappointing', 'noisy', 'cold', 'stale', 'disgusting', 'uncomfortable',
        'broken', 'useless', 'delay', 'delayed', 'wait', 'waste', 'hate', 'hated', 'unacceptable', 'refund',
        'damaged', 'fragile', 'laggy', 'freezing', 'crowded', 'small', 'cramped', 'noisy', 'smelly', 'attitude',
        'incompetent', 'stained', 'rough', 'subpar', 'overrated', 'avoid', 'unhelpful', 'slowest', 'unclean'
    ],
    negations: [
        'not', "n't", 'never', 'no', 'hardly', 'barely', 'without', 'lack', 'lacks', 'neither', 'nor', 'cannot', "can't", "don't", "doesn't", "didn't", "wasn't", "weren't", "won't"
    ],
    amplifiers: [
        'very', 'extremely', 'super', 'exceptionally', 'highly', 'incredibly', 'really', 'immensely', 'ultra',
        'so', 'totally', 'absolutely', 'completely', 'truly', 'remarkably'
    ],
    diminishers: [
        'slightly', 'somewhat', 'a bit', 'marginally', 'barely', 'minor', 'little', 'kind of', 'sort of'
    ],
    contrastWords: [
        'but', 'however', 'although', 'though', 'yet', 'whereas', 'while', 'except', 'despite', 'nevertheless', 'on the other hand'
    ]
};

// Preset Sample Reviews for Testing
const SampleReviews = {
    restaurant: [
        "The pizza was delicious and hot, but the waiter was extremely rude and the wait time was over 45 minutes.",
        "Loved the ambient lighting and cozy seating! Food arrived fast, tasted amazing, and prices were surprisingly reasonable.",
        "Dirty tables, cold soup, and overpriced drinks. The manager didn't even apologize for the terrible service."
    ],
    hotel: [
        "The room was spotless and spacious with a magnificent ocean view. WiFi was super fast, though the pool was a bit crowded.",
        "Check-in took forever and the reception staff was very unhelpful. However, the breakfast buffet was delicious and bed was comfortable.",
        "Horrible stay. The bathroom was dirty, air conditioning didn't work at all, and the street noise was unbearable."
    ],
    tech: [
        "The display is vibrant with smooth 120Hz refresh rate. Battery life is stellar, but the camera performance in low light is disappointing.",
        "Extremely fast processor for gaming! Build quality feels premium and lightweight, definitely worth the price.",
        "Overpriced piece of tech. Battery drains in 3 hours, screen freezes constantly, and customer support was completely useless."
    ],
    ecommerce: [
        "Super fast shipping! Product packaging was sturdy and neat. Item quality exceeded my expectations for the price.",
        "Item arrived late and the box was completely crushed. Product material feels cheap, requesting a full refund immediately."
    ]
};


/**
 * ABSA Core Algorithm: Sentence Tokenization, Clause Breakdown, Aspect & Sentiment Extraction
 */
class ABSAEngine {

    static analyze(text, domain = 'restaurant', customTaxonomy = null) {
        if (!text || text.trim() === '') {
            return { aspects: [], text: '', score: 0, overallSentiment: 'Neutral' };
        }

        const taxonomy = customTaxonomy || { ...AspectTaxonomy[domain] };
        if (ABSAState.customAspects.length > 0) {
            ABSAState.customAspects.forEach(ca => {
                if (ca.name && ca.keywords) {
                    taxonomy[ca.name] = ca.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
                }
            });
        }

        const clauses = this.splitIntoClauses(text);
        const aspectResults = [];

        clauses.forEach(clauseObj => {
            const clauseText = clauseObj.text;
            const clauseLower = clauseText.toLowerCase();
            const words = this.tokenize(clauseLower);

            for (const [aspectName, keywords] of Object.entries(taxonomy)) {
                // Find matching aspect keywords in clause
                const matchedAspectWord = keywords.find(kw => {
                    const pattern = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
                    return pattern.test(clauseLower);
                });

                if (matchedAspectWord) {
                    // Compute sentiment for this specific aspect clause
                    const sentimentAnalysis = this.evaluateClauseSentiment(words, clauseLower);

                    // Find match position in full original text
                    const startIdx = text.toLowerCase().indexOf(clauseLower.trim());
                    const endIdx = startIdx >= 0 ? startIdx + clauseLower.trim().length : -1;

                    // Avoid duplicate aspects in same clause unless different sentiment
                    const existing = aspectResults.find(a => a.aspect === aspectName && Math.abs(a.startIdx - startIdx) < 20);
                    if (!existing) {
                        aspectResults.push({
                            aspect: aspectName,
                            sentiment: sentimentAnalysis.sentiment,
                            score: sentimentAnalysis.score,
                            confidence: sentimentAnalysis.confidence,
                            matchedKeyword: matchedAspectWord,
                            opinionWords: sentimentAnalysis.opinionWords,
                            evidenceSnippet: clauseText.trim(),
                            startIdx: startIdx,
                            endIdx: endIdx
                        });
                    }
                }
            }
        });

        // Compute overall review statistics
        const overall = this.calculateOverallMetrics(aspectResults, text);

        return {
            text: text,
            aspects: aspectResults,
            overallScore: overall.score,
            overallSentiment: overall.sentiment,
            breakdown: overall.breakdown
        };
    }

    static splitIntoClauses(text) {
        // Split by major punctuation, then contrast conjunctions
        const sentenceRegex = /[^.!?\n]+[.!?\n]+/g;
        let sentences = text.match(sentenceRegex) || [text];

        const clauses = [];
        sentences.forEach(sentence => {
            // Split sentence by contrast words or punctuation like commas / semicolons
            const contrastPattern = new RegExp(`\\b(${Lexicon.contrastWords.join('|')})\\b|,|;`, 'gi');
            let lastIdx = 0;
            let match;

            while ((match = contrastPattern.exec(sentence)) !== null) {
                const sub = sentence.substring(lastIdx, match.index).trim();
                if (sub.length > 2) {
                    clauses.push({ text: sub });
                }
                lastIdx = match.index + match[0].length;
            }
            const remainder = sentence.substring(lastIdx).trim();
            if (remainder.length > 2) {
                clauses.push({ text: remainder });
            }
        });

        return clauses.length > 0 ? clauses : [{ text: text }];
    }

    static tokenize(str) {
        return str.replace(/[^\w\s']/g, ' ').split(/\s+/).filter(w => w.length > 0);
    }

    static evaluateClauseSentiment(words, clauseText) {
        let score = 0;
        let opinionWordsFound = [];
        let totalHits = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            let wordVal = 0;
            if (Lexicon.positive.includes(word)) wordVal = 1;
            else if (Lexicon.negative.includes(word)) wordVal = -1;

            if (wordVal !== 0) {
                // Check preceeding 3 words for negation & intensity amplifiers
                const window = words.slice(Math.max(0, i - 3), i);

                const hasNegation = window.some(w => Lexicon.negations.includes(w));
                const hasAmplifier = window.some(w => Lexicon.amplifiers.includes(w));
                const hasDiminisher = window.some(w => Lexicon.diminishers.includes(w));

                if (hasNegation) {
                    wordVal = wordVal * -1; // Reverse sentiment
                }

                if (hasAmplifier) {
                    wordVal = wordVal * 1.5;
                } else if (hasDiminisher) {
                    wordVal = wordVal * 0.6;
                }

                score += wordVal;
                totalHits++;

                let desc = word;
                if (hasNegation) desc = `not ${desc}`;
                if (hasAmplifier) desc = `very ${desc}`;
                opinionWordsFound.push(desc);
            }
        }

        let sentiment = 'Neutral';
        let confidence = 70; // Base default

        if (score > 0.2) {
            sentiment = 'Positive';
            confidence = Math.min(99, Math.round(75 + score * 15));
        } else if (score < -0.2) {
            sentiment = 'Negative';
            confidence = Math.min(99, Math.round(75 + Math.abs(score) * 15));
        } else {
            sentiment = 'Neutral';
            confidence = totalHits > 0 ? 65 : 50;
        }

        return {
            sentiment: sentiment,
            score: parseFloat(score.toFixed(2)),
            confidence: confidence,
            opinionWords: opinionWordsFound
        };
    }

    static calculateOverallMetrics(aspects, text) {
        if (!aspects || aspects.length === 0) {
            // Fallback clause sentiment over raw text if no explicit aspect detected
            const words = this.tokenize(text.toLowerCase());
            const rawEval = this.evaluateClauseSentiment(words, text);
            return {
                score: rawEval.sentiment === 'Positive' ? 75 : rawEval.sentiment === 'Negative' ? 25 : 50,
                sentiment: rawEval.sentiment,
                breakdown: { positive: rawEval.sentiment === 'Positive' ? 100 : 0, negative: rawEval.sentiment === 'Negative' ? 100 : 0, neutral: rawEval.sentiment === 'Neutral' ? 100 : 0 }
            };
        }

        let pos = 0, neg = 0, neu = 0;
        let totalScoreSum = 0;

        aspects.forEach(a => {
            if (a.sentiment === 'Positive') pos++;
            else if (a.sentiment === 'Negative') neg++;
            else neu++;
            totalScoreSum += a.score;
        });

        const total = aspects.length;
        const posPct = Math.round((pos / total) * 100);
        const negPct = Math.round((neg / total) * 100);
        const neuPct = 100 - posPct - negPct;

        let overallSent = 'Neutral';
        let normalizedScore = 50;

        if (pos > neg && pos > neu) {
            overallSent = 'Positive';
            normalizedScore = Math.round(50 + (pos / total) * 50);
        } else if (neg > pos && neg > neu) {
            overallSent = 'Negative';
            normalizedScore = Math.round(50 - (neg / total) * 50);
        } else if (pos > 0 && neg > 0) {
            overallSent = 'Mixed';
            normalizedScore = Math.round(50 + ((pos - neg) / total) * 30);
        }

        return {
            score: normalizedScore,
            sentiment: overallSent,
            breakdown: { positive: posPct, negative: negPct, neutral: Math.max(0, neuPct) }
        };
    }
}


/**
 * UI Controller & Interactivity
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindEvents();
    loadPresetSample();
});

function initTheme() {
    document.documentElement.setAttribute('data-theme', ABSAState.theme);
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = ABSAState.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

function toggleTheme() {
    ABSAState.theme = ABSAState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('absa_theme', ABSAState.theme);
    initTheme();
}

function bindEvents() {
    // Domain selector change
    const domainSelect = document.getElementById('domainSelect');
    if (domainSelect) {
        domainSelect.addEventListener('change', (e) => {
            ABSAState.currentDomain = e.target.value;
            loadPresetSample();
        });
    }

    // Input text counter
    const reviewInput = document.getElementById('reviewInput');
    if (reviewInput) {
        reviewInput.addEventListener('input', updateInputStats);
    }
}

function updateInputStats() {
    const input = document.getElementById('reviewInput').value;
    const charCount = input.length;
    const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
    
    document.getElementById('charCount').textContent = `${charCount} chars`;
    document.getElementById('wordCount').textContent = `${wordCount} words`;
}

function loadPresetSample(index = 0) {
    const samples = SampleReviews[ABSAState.currentDomain];
    if (samples && samples[index]) {
        const input = document.getElementById('reviewInput');
        if (input) {
            input.value = samples[index];
            updateInputStats();
        }
    }
}

function loadNextSample() {
    const samples = SampleReviews[ABSAState.currentDomain];
    const input = document.getElementById('reviewInput');
    const currentVal = input.value;
    
    let nextIdx = 0;
    const currentIdx = samples.indexOf(currentVal);
    if (currentIdx !== -1) {
        nextIdx = (currentIdx + 1) % samples.length;
    }
    input.value = samples[nextIdx];
    updateInputStats();
}

function clearInput() {
    document.getElementById('reviewInput').value = '';
    updateInputStats();
    document.getElementById('resultContainer').innerHTML = `
        <div class="placeholder-box">
            <span class="icon">🔍</span>
            <p>Your aspect-based analysis results will appear here after clicking "Analyze Review".</p>
        </div>
    `;
    document.getElementById('overallMetricsCard').style.display = 'none';
}

function analyzeReview() {
    const reviewText = document.getElementById('reviewInput').value;
    const resultContainer = document.getElementById('resultContainer');
    const overallMetricsCard = document.getElementById('overallMetricsCard');

    if (!reviewText.trim()) {
        resultContainer.innerHTML = `
            <div class="alert alert-warning">
                ⚠️ Please enter a review text or click a sample preset before running analysis.
            </div>
        `;
        overallMetricsCard.style.display = 'none';
        return;
    }

    // Run Engine
    const results = ABSAEngine.analyze(reviewText, ABSAState.currentDomain);
    ABSAState.analysisResults = results;

    // Render Overall Score Card
    renderOverallCard(results);

    // Render Annotated Interactive Text & Aspect Cards
    renderResultsView(results);
}

function renderOverallCard(results) {
    const card = document.getElementById('overallMetricsCard');
    card.style.display = 'block';

    const sentBadge = document.getElementById('overallSentimentBadge');
    sentBadge.textContent = results.overallSentiment;
    sentBadge.className = `badge badge-${results.overallSentiment.toLowerCase()}`;

    document.getElementById('overallScoreMetric').textContent = `${results.overallScore}/100`;
    document.getElementById('aspectsCountMetric').textContent = results.aspects.length;

    // Render Bar breakdown
    const posBar = document.getElementById('posProgressBar');
    const negBar = document.getElementById('negProgressBar');
    const neuBar = document.getElementById('neuProgressBar');

    posBar.style.width = `${results.breakdown.positive}%`;
    negBar.style.width = `${results.breakdown.negative}%`;
    neuBar.style.width = `${results.breakdown.neutral}%`;

    posBar.title = `Positive: ${results.breakdown.positive}%`;
    negBar.title = `Negative: ${results.breakdown.negative}%`;
    neuBar.title = `Neutral: ${results.breakdown.neutral}%`;
}

function renderResultsView(results) {
    const container = document.getElementById('resultContainer');
    container.innerHTML = '';

    if (results.aspects.length === 0) {
        container.innerHTML = `
            <div class="placeholder-box">
                <span class="icon">ℹ️</span>
                <p>No specific aspect categories matched the current taxonomy. Try switching domain categories or adding custom aspect terms below.</p>
            </div>
        `;
        return;
    }

    // 1. Interactive Annotated Text Block
    const annotatedSection = document.createElement('div');
    annotatedSection.className = 'annotated-text-container';
    annotatedSection.innerHTML = `
        <h4 class="section-subtitle">📍 Contextual Highlighted Review Text</h4>
        <div class="annotated-text" id="annotatedTextContent">${generateHighlightedText(results.text, results.aspects)}</div>
        <p class="hint-text">💡 Tip: Click on any aspect card below to highlight its matching segment in the review.</p>
    `;
    container.appendChild(annotatedSection);

    // 2. Aspect Filter Controls
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';
    filterBar.innerHTML = `
        <div class="filter-group">
            <label>Filter Aspects:</label>
            <button class="btn-filter active" onclick="filterAspects('all', this)">All (${results.aspects.length})</button>
            <button class="btn-filter" onclick="filterAspects('positive', this)">Positive</button>
            <button class="btn-filter" onclick="filterAspects('negative', this)">Negative</button>
            <button class="btn-filter" onclick="filterAspects('neutral', this)">Neutral</button>
        </div>
        <div class="search-aspect-box">
            <input type="text" id="aspectSearchInput" placeholder="Search aspect..." oninput="searchAspects(this.value)">
        </div>
    `;
    container.appendChild(filterBar);

    // 3. Grid of Aspect Cards
    const grid = document.createElement('div');
    grid.className = 'aspect-grid';
    grid.id = 'aspectGrid';

    results.aspects.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = `aspect-card card-sentiment-${item.sentiment.toLowerCase()}`;
        card.setAttribute('data-sentiment', item.sentiment.toLowerCase());
        card.setAttribute('data-aspect', item.aspect.toLowerCase());
        card.onclick = () => highlightAspectText(idx);

        const aspectIcon = getAspectIcon(item.aspect);

        card.innerHTML = `
            <div class="aspect-card-header">
                <div class="aspect-name">
                    <span class="aspect-icon">${aspectIcon}</span>
                    <span>${escapeHTML(item.aspect)}</span>
                </div>
                <span class="badge badge-${item.sentiment.toLowerCase()}">${item.sentiment}</span>
            </div>
            <div class="aspect-card-body">
                <div class="metric-row">
                    <span class="label">Matched Key:</span>
                    <span class="val highlight-kw">${escapeHTML(item.matchedKeyword)}</span>
                </div>
                <div class="metric-row">
                    <span class="label">Confidence:</span>
                    <span class="val">${item.confidence}%</span>
                </div>
                ${item.opinionWords.length > 0 ? `
                <div class="metric-row">
                    <span class="label">Opinions:</span>
                    <span class="val opinion-tag">${item.opinionWords.map(o => escapeHTML(o)).join(', ')}</span>
                </div>
                ` : ''}
                <div class="snippet-quote">
                    "${escapeHTML(item.evidenceSnippet)}"
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function generateHighlightedText(text, aspects) {
    let html = escapeHTML(text);

    // Apply span highlights for identified aspect snippets
    aspects.forEach((a, i) => {
        if (a.evidenceSnippet) {
            const escapedSnippet = escapeHTML(a.evidenceSnippet);
            const span = `<mark class="mark-${a.sentiment.toLowerCase()}" id="mark-snippet-${i}">${escapedSnippet}</mark>`;
            html = html.replace(escapedSnippet, span);
        }
    });

    return html;
}

function highlightAspectText(index) {
    // Remove active highlight from all marks
    document.querySelectorAll('.annotated-text mark').forEach(m => m.classList.remove('active-mark'));
    
    const targetMark = document.getElementById(`mark-snippet-${index}`);
    if (targetMark) {
        targetMark.classList.add('active-mark');
        targetMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function filterAspects(type, btn) {
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.aspect-card');
    cards.forEach(card => {
        const sent = card.getAttribute('data-sentiment');
        if (type === 'all' || sent === type) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchAspects(query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.aspect-card');

    cards.forEach(card => {
        const aspect = card.getAttribute('data-aspect');
        if (!q || aspect.includes(q)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function getAspectIcon(aspect) {
    const icons = {
        'Food': '🍔', 'Service': '⚡', 'Staff': '👥', 'Ambience': '✨', 'Price': '💰', 'Cleanliness': '🧹', 'Drinks': '🍹',
        'Room': '🛏️', 'Location': '📍', 'WiFi': '📶', 'Amenities': '🏊', 'Build Quality': '🛠️', 'Performance': '🚀',
        'Battery': '🔋', 'Display': '📱', 'Camera': '📷', 'Shipping': '📦', 'Packaging': '🎁', 'Product Quality': '⭐'
    };
    return icons[aspect] || '🏷️';
}


/**
 * Tab Management
 */
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    document.querySelectorAll('.nav-tab').forEach(tb => tb.classList.remove('active'));

    document.getElementById(tabId).style.display = 'block';
    btn.classList.add('active');

    if (tabId === 'tabCustomTaxonomy') {
        renderCustomAspectList();
    }
}


/**
 * Custom Taxonomy Management
 */
function addCustomAspect() {
    const nameInput = document.getElementById('customAspectName');
    const kwInput = document.getElementById('customAspectKeywords');

    const name = nameInput.value.trim();
    const keywords = kwInput.value.trim();

    if (!name || !keywords) {
        alert('Please enter both aspect category name and keywords.');
        return;
    }

    ABSAState.customAspects.push({ name: name, keywords: keywords });
    nameInput.value = '';
    kwInput.value = '';

    renderCustomAspectList();
}

function removeCustomAspect(idx) {
    ABSAState.customAspects.splice(idx, 1);
    renderCustomAspectList();
}

function renderCustomAspectList() {
    const container = document.getElementById('customAspectsList');
    if (!container) return;

    if (ABSAState.customAspects.length === 0) {
        container.innerHTML = '<p class="text-muted">No custom aspects added yet. Add one above to enhance analysis!</p>';
        return;
    }

    container.innerHTML = ABSAState.customAspects.map((ca, i) => `
        <div class="custom-aspect-item">
            <div>
                <strong>${escapeHTML(ca.name)}</strong>
                <span class="kw-tags">${escapeHTML(ca.keywords)}</span>
            </div>
            <button class="btn-sm btn-danger" onclick="removeCustomAspect(${i})">Remove</button>
        </div>
    `).join('');
}


/**
 * Batch Analysis
 */
function runBatchAnalysis() {
    const batchInput = document.getElementById('batchInput').value;
    const batchResultsDiv = document.getElementById('batchResultsDiv');

    if (!batchInput.trim()) {
        batchResultsDiv.innerHTML = '<div class="alert alert-warning">Please paste at least two reviews separated by newline.</div>';
        return;
    }

    const lines = batchInput.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    if (lines.length === 0) {
        batchResultsDiv.innerHTML = '<div class="alert alert-warning">No valid review lines found.</div>';
        return;
    }

    const allAnalyses = lines.map(line => ABSAEngine.analyze(line, ABSAState.currentDomain));
    ABSAState.batchResults = allAnalyses;

    // Aggregate statistics
    let totalAspects = 0;
    let posCount = 0, negCount = 0, neuCount = 0;
    const aspectCounts = {};

    allAnalyses.forEach(res => {
        res.aspects.forEach(a => {
            totalAspects++;
            if (a.sentiment === 'Positive') posCount++;
            else if (a.sentiment === 'Negative') negCount++;
            else neuCount++;

            if (!aspectCounts[a.aspect]) {
                aspectCounts[a.aspect] = { positive: 0, negative: 0, neutral: 0, total: 0 };
            }
            aspectCounts[a.aspect][a.sentiment.toLowerCase()]++;
            aspectCounts[a.aspect].total++;
        });
    });

    batchResultsDiv.innerHTML = `
        <div class="batch-summary-grid">
            <div class="metric-card">
                <h3>${lines.length}</h3>
                <p>Total Reviews Analyzed</p>
            </div>
            <div class="metric-card">
                <h3>${totalAspects}</h3>
                <p>Aspect Instances Found</p>
            </div>
            <div class="metric-card pos-card">
                <h3>${totalAspects > 0 ? Math.round((posCount / totalAspects) * 100) : 0}%</h3>
                <p>Positive Aspect Ratio</p>
            </div>
            <div class="metric-card neg-card">
                <h3>${totalAspects > 0 ? Math.round((negCount / totalAspects) * 100) : 0}%</h3>
                <p>Negative Aspect Ratio</p>
            </div>
        </div>

        <h4 class="section-subtitle">📊 Aspect Sentiment Heatmap Table</h4>
        <table class="batch-table">
            <thead>
                <tr>
                    <th>Aspect Category</th>
                    <th>Total Mentions</th>
                    <th>Positive %</th>
                    <th>Negative %</th>
                    <th>Neutral %</th>
                    <th>Sentiment Distribution</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(aspectCounts).map(([asp, counts]) => {
                    const posP = Math.round((counts.positive / counts.total) * 100);
                    const negP = Math.round((counts.negative / counts.total) * 100);
                    const neuP = 100 - posP - negP;
                    return `
                        <tr>
                            <td><strong>${getAspectIcon(asp)} ${escapeHTML(asp)}</strong></td>
                            <td>${counts.total}</td>
                            <td class="text-pos">${posP}%</td>
                            <td class="text-neg">${negP}%</td>
                            <td class="text-neu">${neuP}%</td>
                            <td>
                                <div class="mini-bar-container">
                                    <div class="mini-bar bg-pos" style="width: ${posP}%" title="Pos: ${posP}%"></div>
                                    <div class="mini-bar bg-neg" style="width: ${negP}%" title="Neg: ${negP}%"></div>
                                    <div class="mini-bar bg-neu" style="width: ${neuP}%" title="Neu: ${neuP}%"></div>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div class="export-actions">
            <button class="btn btn-secondary" onclick="exportBatchJSON()">📥 Export Batch JSON</button>
            <button class="btn btn-secondary" onclick="exportBatchCSV()">📊 Export Batch CSV</button>
        </div>
    `;
}


/**
 * Export Functions
 */
function exportResultsJSON() {
    if (!ABSAState.analysisResults) {
        alert('Run an analysis first before exporting!');
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ABSAState.analysisResults, null, 2));
    downloadFile(dataStr, 'absa_analysis_result.json');
}

function exportResultsCSV() {
    if (!ABSAState.analysisResults || ABSAState.analysisResults.aspects.length === 0) {
        alert('No aspects to export!');
        return;
    }

    let csv = 'Aspect,Sentiment,Confidence,MatchedKeyword,OpinionWords,Snippet\n';
    ABSAState.analysisResults.aspects.forEach(a => {
        csv += `"${a.aspect}","${a.sentiment}",${a.confidence},"${a.matchedKeyword}","${a.opinionWords.join('; ')}","${a.evidenceSnippet.replace(/"/g, '""')}"\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadFile(dataStr, 'absa_aspects_export.csv');
}

function exportBatchJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ABSAState.batchResults, null, 2));
    downloadFile(dataStr, 'absa_batch_results.json');
}

function exportBatchCSV() {
    if (ABSAState.batchResults.length === 0) return;
    let csv = 'ReviewIndex,ReviewText,Aspect,Sentiment,Confidence,MatchedKeyword,Snippet\n';
    
    ABSAState.batchResults.forEach((res, i) => {
        res.aspects.forEach(a => {
            csv += `${i+1},"${res.text.replace(/"/g, '""')}","${a.aspect}","${a.sentiment}",${a.confidence},"${a.matchedKeyword}","${a.evidenceSnippet.replace(/"/g, '""')}"\n`;
        });
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadFile(dataStr, 'absa_batch_export.csv');
}

function printReport() {
    window.print();
}

function downloadFile(content, fileName) {
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", content);
    dlAnchorElem.setAttribute("download", fileName);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
