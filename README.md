# 📊 Aspect-Based Sentiment Analysis (ABSA) Studio

A full-featured, interactive **Aspect-Based Sentiment Analysis (ABSA)** web application built with modern HTML5, CSS3, and JavaScript NLP engine.

---

## 🌟 Key Features

1. **Intelligent ABSA NLP Engine**:
   - **Clause Segmentation**: Intelligently breaks complex sentences by contrastive shifters (`but`, `however`, `although`, `yet`) and punctuation.
   - **Negation & Modifier Shifting**: Recognizes negations (*"not bad"* -> Positive, *"not clean"* -> Negative) and intensity amplifiers (*"extremely fast"*, *"slightly cold"*).
   - **Span Extraction**: Exact character indexing for real-time contextual highlighting in the UI.

2. **Multi-Domain Taxonomies**:
   - 🍽️ **Restaurant & Dining**: Food, Service, Staff, Ambience, Price, Cleanliness, Drinks.
   - 🏨 **Hotels & Hospitality**: Room, Service, Staff, Location, Cleanliness, WiFi, Amenities, Price.
   - 💻 **Tech & Electronics**: Build Quality, Performance, Battery, Display, Camera, Price, Support.
   - 📦 **E-Commerce & Retail**: Shipping, Packaging, Product Quality, Price & Value, Customer Service.

3. **Interactive UI & Visualization**:
   - **Contextual Highlighted Review Text**: Visual color-coded tags for positive, negative, and neutral aspect phrases.
   - **Interactive Aspect Cards Grid**: Clicking an aspect card scrolls to and highlights the matching sentence segment.
   - **Overall Sentiment Metrics**: Overall sentiment score (0-100), sentiment ratio progress bar, aspect count metrics.
   - **Filter & Search Controls**: Filter aspects by sentiment type or search by aspect category name.

4. **Batch Analysis & Analytics Dashboard**:
   - Analyze multiple reviews simultaneously.
   - Generates aggregated aspect sentiment distribution tables and heatmap mini-bars.

5. **Custom Aspect Taxonomy Builder**:
   - Add user-defined aspect categories and keyword triggers dynamically.

6. **Export & Print**:
   - Export analysis results to formatted **JSON** or **CSV**.
   - One-click print-ready PDF layout.

7. **Dark / Light Theme Toggle**:
   - Full dark mode theme support with preference persistence.

---

## 🚀 How to Run

### Option 1: Standalone Browser Mode (Zero Dependencies)
Simply open `index.html` directly in any web browser!

### Option 2: Local Web Server (Node.js)
Run the built-in HTTP server:
```bash
npm start
```
Then open your browser at `http://localhost:3000`.

---

## 📂 Project Structure

```
ABSA-Website/
├── index.html       # Main HTML5 User Interface with Navigation Tabs
├── style.css        # Responsive CSS3 Stylesheet with Dark Mode & Glassmorphism
├── script.js        # ABSA NLP Engine & Interactive UI Controller
├── server.js        # Built-in Node.js HTTP Web Server
├── package.json     # Project Metadata & npm Scripts
└── README.md        # Documentation
```

---

## 📜 License
MIT License. Created for Aspect-Based Sentiment Analysis web applications.
