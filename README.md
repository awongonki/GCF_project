# 🔍 AI Transparency Visualizer: LLM vs. Supervised Learning

> **An interactive 3D UX demonstration designed for the Independent Evaluation Unit (IEU) at the Green Climate Fund (GCF).**

<!-- 👇 PASTE YOUR SCREENSHOT/GIF LINK HERE LATER 👇 -->
![Visualization Preview](https://2dp6z2-3000.csb.app/)

## 🎯 Project Context
**Presentation:** *Advancing Evaluation Methods in the Age of AI*  
**Audience:** Green Climate Fund (GCF) Board & Stakeholders  

This project was engineered to visually articulate a critical distinction in algorithmic auditing: **The "Black Box" problem.** 

While Large Language Models (LLMs) offer power, their probabilistic nature creates "foggy," non-deterministic outcomes. For high-accountability use cases—such as GCF funding evaluations—classic **Supervised Machine Learning (Linear Regression / Decision Trees)** offers superior interpretability and audit trails.

## 🕹️ The Experience

This web-based simulation demonstrates two states of algorithmic transparency:

### 1. The "Black Box" (LLM State) ☁️
*   **Visual:** The logic network is shrouded in thick, volumetric fog.
*   **Behavior:** The data pulse (Decision Signal) is Red. It moves slowly and uncertainly.
*   **Metaphor:** Represents the opacity of deep learning models where the reasoning behind an output cannot be fully traced or audited.

### 2. The "Glass Box" (Supervised ML State) 💎
*   **Visual:** The fog vanishes. Nodes become transparent glass.
*   **Behavior:** The data pulse turns Gold. It travels a specific, highlighted path (Root -> Node -> Leaf).
*   **Metaphor:** Represents the deterministic nature of Decision Trees. We can trace exactly *why* a decision was made, fulfilling the "Traceability" requirement for GCF evaluations.

---

## 🛠️ Technical Implementation

*   **Engine:** React Three Fiber (Three.js ecosystem)
*   **Lighting:** Physically Based Rendering (PBR) with Volumetric Fog logic.
*   **Animation:** Custom frame-loop interpolation for the "Data Pulse" physics.
*   **Deployment:** WebGL (Runs in browser).

## 🚀 Usage
1.  **Launch the Demo:** [Insert Link to your Live Demo Here]
2.  **Toggle the Simulation:** Click the button at the bottom center to switch between "Black Box" and "Transparent" modes.

---

*Concept & Design by Arix Interaction Lab // Co-developed with Gemini 3*
