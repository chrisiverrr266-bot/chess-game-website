# ♟️ Chess Game Website

A beautiful, modern chess game website featuring both AI bot gameplay and real-time online multiplayer. Built with a stunning UI design and smooth user experience.

![Chess Game](https://img.shields.io/badge/Chess-Game-6366f1?style=for-the-badge&logo=chess&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

- 🤖 **Play vs Bot** - Challenge the powerful Stockfish chess engine with adjustable difficulty levels
- 🌐 **Play Online** - Real-time multiplayer with friends using room codes
- 🎨 **Beautiful UI** - Modern, gradient-based design with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- ♟️ **Complete Chess Rules** - Full move validation, castling, en passant, and promotion
- 📊 **Move History** - Track all moves with algebraic notation
- 🎯 **Game Status** - Real-time updates for check, checkmate, stalemate, and draws
- ⚡ **Fast & Smooth** - Optimized performance with beautiful transitions

## 🎮 Game Modes

### Bot Mode
- Four difficulty levels (Easy, Medium, Hard, Expert)
- Powered by Stockfish chess engine
- Instant move calculation
- Perfect for practice and learning

### Online Multiplayer
- Create private rooms with unique codes
- Share room codes with friends
- Real-time move synchronization
- Opponent disconnect detection

## 🛠️ Built With

This project uses several excellent open-source libraries:

### Core Libraries

- **[chess.js](https://github.com/jhlywa/chess.js)** by Jeff Hlywa
  - Chess move generation and validation
  - Game state management
  - PGN and FEN support
  
- **[chessboard.js](https://github.com/oakmac/chessboardjs)** by Chris Oakman
  - Interactive chess board UI
  - Drag and drop pieces
  - Smooth animations

- **[Stockfish.js](https://github.com/lichess-org/stockfish.js)** by Lichess
  - Powerful chess engine (WebAssembly)
  - AI opponent with adjustable strength
  - Based on the world's strongest chess engine

- **[Socket.IO](https://socket.io/)** by Guillermo Rauch
  - Real-time bidirectional communication
  - WebSocket with fallbacks
  - Room-based multiplayer support

### Frontend
- Modern vanilla JavaScript (ES6+)
- CSS3 with custom properties and gradients
- Google Fonts (Inter & Playfair Display)
- Responsive grid and flexbox layouts

### Backend
- Node.js with Express
- Socket.IO server for real-time communication
- Efficient room management system

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/chrisiverrr266-bot/chess-game-website.git
   cd chess-game-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** and your site will be live!

### Method 2: GitHub Integration

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Click "Deploy"

### Important Notes for Vercel Deployment

⚠️ **WebSocket Limitation**: Vercel's serverless functions don't support persistent WebSocket connections. For full online multiplayer functionality, consider these alternatives:

- **Deploy to Railway.app**: Full WebSocket support
- **Deploy to Render.com**: Free tier with WebSocket support
- **Use Vercel + separate WebSocket server**: Deploy frontend on Vercel, backend on Railway/Render

For **bot-only mode**, Vercel deployment works perfectly! The AI chess engine runs entirely in the browser.

## 🎨 Design Features

- **Modern Color Scheme**: Deep blue gradients with purple accents
- **Smooth Animations**: Fade-ins, hover effects, and transitions
- **Custom Typography**: Beautiful font pairing (Inter + Playfair Display)
- **Glass Morphism**: Subtle transparency effects on cards
- **Responsive Layout**: Mobile-first design approach
- **Dark Theme**: Easy on the eyes for long gaming sessions

## 📖 How to Play

### Starting a Game

1. **Choose Bot Mode**: Select difficulty and start playing immediately
2. **Choose Online Mode**: Create a room or join with a code

### Playing

- Click and drag pieces to move
- Valid moves are highlighted
- Invalid moves snap back
- Pawns automatically promote to queens

### Game End Conditions

- **Checkmate**: One king is captured
- **Stalemate**: No legal moves available
- **Draw**: Insufficient material or threefold repetition

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits & Acknowledgments

### Open Source Libraries

Huge thanks to the creators and maintainers of:

- **Jeff Hlywa** - [chess.js](https://github.com/jhlywa/chess.js)
- **Chris Oakman** - [chessboard.js](https://github.com/oakmac/chessboardjs)
- **Lichess Team** - [Stockfish.js](https://github.com/lichess-org/stockfish.js)
- **Socket.IO Team** - [Socket.IO](https://socket.io/)
- **Stockfish Developers** - Original Stockfish engine

### Inspiration

- Chess.com for UX inspiration
- Lichess for open-source philosophy
- Modern web design trends

## 👨‍💻 Author

**Made by Chris Iver**

- GitHub: [@chrisiverrr266-bot](https://github.com/chrisiverrr266-bot)

## 🌟 Show Your Support

If you like this project, please give it a ⭐ on GitHub!

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation

---

**Made with ♟️ and 💙 by Chris Iver**
