# 🧠 QuizWhiz - Interactive Quiz Application

**QuizWhiz** is a modern, responsive quiz application built with React and Tailwind CSS. This project demonstrates front-end development skills through an engaging, user-friendly quiz interface with real-time scoring, difficulty levels, and comprehensive score tracking.

![QuizWhiz Preview](![alt text](image.png))

## 🎯 Project Purpose

This application was developed as a **assignment** to showcase:
- **React fundamentals** (components, hooks, state management)
- **Modern CSS styling** with Tailwind CSS
- **Responsive design** principles
- **User experience** optimization
- **Code organization** and best practices

## ✨ Key Features

### 🎮 Quiz Functionality
- **Multiple Choice Questions** - Interactive 4-option quiz format
- **Difficulty Levels** - Easy, Medium, and Hard modes with different question sets
- **Timer System** - Time limits per question (45s/30s/20s based on difficulty)
- **Real-time Feedback** - Instant correct/incorrect answer indication
- **Progress Tracking** - Visual progress bar and question counter

### 🏆 Scoring & Leaderboards
- **High Scores** - Top 10 leaderboard per difficulty level
- **Complete History** - View all quiz attempts with pagination
- **Player Names** - Personalized experience with name input
- **Score Statistics** - Detailed performance metrics and analytics
- **Data Persistence** - Scores saved locally with export/import functionality

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Smooth Animations** - Engaging transitions and micro-interactions
- **Keyboard Navigation** - Full keyboard support (1-4 for options, Enter to proceed)
- **Error Handling** - Graceful error boundaries and user-friendly messages

### 🛠️ Advanced Features
- **Welcome Screen** - Interactive difficulty selection and instructions
- **Results Page** - Comprehensive score breakdown and review
- **Export/Import** - Backup and restore quiz data
- **Duplicate Prevention** - Smart deduplication of scores
- **Performance Optimization** - Efficient rendering and state management

## 🚀 Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | ^19.1.1 |
| **Tailwind CSS** | Utility-first CSS framework | ^4.1.13 |
| **Vite** | Build tool and development server | ^7.1.2 |
| **JavaScript (ES6+)** | Programming language | Latest |
| **Vercel** | Hosting and deployment |  |

### Additional Libraries
- **ESLint** - Code linting and quality
- **React Hooks** - useState, useEffect for state management
- **LocalStorage API** - Client-side data persistence

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/quizwhiz.git
   cd quizwhiz
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
npm run preview
```

## 🎯 Usage Instructions

### Getting Started
1. **Enter Your Name** - Optional personalization for the leaderboard
2. **Select Difficulty** - Choose from Easy, Medium, or Hard
3. **Start Quiz** - Begin your quiz journey!

### Taking a Quiz
- **Read Questions** carefully
- **Select Answers** using mouse clicks or keyboard (1-4 keys)
- **Watch the Timer** - Answer before time runs out
- **Progress Through** all questions
- **View Results** with detailed breakdown

### Navigation Controls
- **Mouse**: Click on options and buttons
- **Keyboard**: 
  - `1-4` keys to select options A-D
  - `Enter` to proceed to next question
  - `Tab` for keyboard navigation

### Viewing Scores
- **High Scores**: Top 10 performers per difficulty
- **All Attempts**: Complete history with search and pagination
- **Export Data**: Download your scores as JSON backup

## 🌐 Live Demo

**🔗 [View Live Demo on Vercel](https://your-app-name.vercel.app)**

Experience QuizWhiz in action! The app is deployed and ready to use.

## 📁 Project Structure

```
QuizWhiz/
├── public/
│   ├── vite.svg
│   └── image.png
├── src/
│   ├── components/
│   │   ├── Quiz.jsx           # Main quiz interface
│   │   ├── Results.jsx        # Score results page
│   │   ├── WelcomeScreen.jsx  # Landing page
│   │   ├── HighScores.jsx     # Leaderboard display
│   │   ├── AllScores.jsx      # Complete score history
│   │   ├── Timer.jsx          # Countdown timer
│   │   ├── DifficultySelector.jsx # Difficulty selection
│   │   └── ErrorBoundary.jsx  # Error handling
│   ├── data/
│   │   ├── questions.json     # Quiz questions database
│   │   └── scores.json        # Initial scores data
│   ├── utils/
│   │   └── storage.js         # LocalStorage utilities
│   ├── App.jsx               # Main application component
│   ├── App.css              # Custom styles
│   ├── index.css            # Global styles with Tailwind
│   └── main.jsx             # React DOM entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design Highlights

- **Color Scheme**: Clean white background with magenta accent colors
- **Typography**: Inter font family for modern, readable text
- **Animations**: Subtle fade-ins, scale transforms, and hover effects
- **Responsive**: Mobile-first design with breakpoint optimizations
- **Icons**: Emoji-based icons for visual appeal and universal understanding

## 🔧 Configuration

### Adding Questions
Edit `src/data/questions.json`:
```json
{
  "easy": [
    {
      "id": 1,
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2
    }
  ]
}
```

### Customizing Timer
Modify timer durations in `Quiz.jsx`:
```javascript
const getTimerDuration = () => {
  switch (difficulty) {
    case 'easy': return 45;    // seconds
    case 'medium': return 30;
    case 'hard': return 20;
    default: return 30;
  }
};
```

## 🧪 Testing

### Manual Testing Checklist
- ✅ Responsive design on different screen sizes
- ✅ Keyboard navigation functionality
- ✅ Timer countdown and auto-progression
- ✅ Score calculation accuracy
- ✅ LocalStorage persistence
- ✅ Error boundary handling

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Vercel Deployment
1. **Connect GitHub** repository to Vercel
2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy** automatically on push to main branch

### Environment Variables
```bash
# No environment variables required for basic functionality
# Add API endpoints here for backend integration
```

## 🔮 Future Enhancements

- [ ] **Backend Integration** - Save scores to database for global leaderboards
- [ ] **User Authentication** - Login system for persistent profiles
- [ ] **Question Categories** - Subject-wise quiz organization
- [ ] **Multiplayer Mode** - Real-time competitive quizzes
- [ ] **Analytics Dashboard** - Detailed performance insights
- [ ] **Question Editor** - Admin interface for managing questions
- [ ] **Social Sharing** - Share results on social media
- [ ] **Progressive Web App** - Offline functionality

## 🐛 Known Issues

- LocalStorage limitations in private browsing mode
- Mobile keyboard may cover content on very small screens
- Scores are device-specific (resolved with backend implementation)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request


## 👨‍💻 Contact & Support

### Developer Information
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile]

### Project Links
- **GitHub Repository**: [https://github.com/yourusername/quizwhiz](https://github.com/yourusername/quizwhiz)
- **Live Demo**: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)


---

**⭐ If you found this project helpful, please consider giving it a star on GitHub!**

*Built with ❤️ using React and Tailwind CSS*
