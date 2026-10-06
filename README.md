# SkillReel — “Scroll. Learn. Grow.”
> A modern, production-grade social learning platform where short-form vertical video is engineered for verified skills, personal growth, and interactive micro-challenges.

---

## 🌟 Key Features Built & Live

1. **📱 TikTok/Reels Style Vertical Feed**
   - Seamless swipe & keyboard feed transitions.
   - For You, Following, and Learning-specific feeds.
   - Like, comment, save, share, and creator follow interactions.
   - **⚡ Interactive Micro-Challenges:** Every educational Reel includes a tap-to-test quiz that rewards instant XP (+10 to +20 XP).

2. **🎓 Full Learning Center & Roadmaps**
   - Multi-step structured roadmaps (e.g. *Become an AI Engineer*, *Full-Stack Architect*).
   - Interactive lesson completions with instant progress calculations.
   - Visual progress bars for individual skills (Python, PyTorch, Transformers, DSA, System Design).

3. **🤖 Dedicated AI Learning Coach & Creator Co-Pilot**
   - Chat-based AI Coach that uses the user's specific skill level and career goals to generate 8-step custom learning roadmaps.
   - Creator Studio AI: auto-generates Reel titles, descriptions, hashtags, skill tags, and micro-challenge quizzes in 1 click.

4. **💬 Real-Time Messaging & Study Groups**
   - 1-on-1 direct messaging and collaborative study groups (e.g. *Python & AI Study Group*).
   - Reel attachments and challenge sharing directly in chat threads.

5. **📹 Study Calls & Simulated WebRTC Room**
   - Live video study room interface with mic/camera toggle, screen sharing, and collaborative whiteboard note taking.

6. **🏆 Gamification & Anti-Brainrot Architecture**
   - XP system, Level progression (Lvl 1 to Lvl 8+), and daily learning streak counter.
   - Badges & Milestones showcase (e.g. *7-Day Streak Warrior*, *Python Pioneer*).
   - Designed to reward active problem-solving rather than passive doomscrolling.

7. **⚙️ Preferences & Customization**
   - Account customization, career goal selection, daily learning targets (5m, 15m, 30m, 60m).
   - SkillReel Plus subscription tier architecture.

---

## 🚀 Setup & Running Locally

### 1. Requirements
- Node.js (version 18+ or 20+)
- npm or yarn

### 2. Installation
Open your terminal inside the project root (`skillup`):
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The app will launch at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables
Create a `.env` file in the root based on `.env.example`:
```env
# Optional: Connect Gemini or OpenAI API Key for live AI Coach responses
VITE_AI_API_KEY=your_api_key_here
VITE_APP_NAME="SkillReel"
VITE_APP_TAGLINE="Scroll. Learn. Grow."
```
*(Note: If no API key is provided, the platform automatically utilizes its built-in realistic AI simulation engine so all features remain 100% interactive!)*

---

## 🗄️ Database Architecture
The complete PostgreSQL / Supabase schema is provided in [`supabase_schema.sql`](file:///c:/Users/dasar/OneDrive/Desktop/skillup/supabase_schema.sql). It includes:
- `profiles` with level, XP, and streak tracking.
- `reels` with vector embeddings for semantic search & recommendation.
- `challenges` and `challenge_attempts` for tracking user quiz accuracy.
- `learning_paths` & `learning_lessons`.
- `chat_threads` & `chat_messages`.
- `watch_history` for learning-first feed recommendations.
