# WhirlWin - Raffle Spin the Wheel System

A modern, interactive raffle system featuring dual spinning wheels for selecting participants and prizes. Built with React, Vite, and Tailwind CSS.

## Features

- **Dual Spinning Wheels** - Separate wheels for participants and prizes
- **CSV Upload** - Upload participant and prize lists via CSV files
- **Manual Entry** - Add participants and prizes manually through a modal interface
- **Visual Feedback** - Animated spinning wheels with confetti celebration on win
- **Elimination Mode** - Automatically removes winners from the pool after each spin
- **Responsive Design** - Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## CSV Format

### Participants CSV
```csv
ID,Name
1,John Doe
2,Jane Smith
3,Bob Wilson
```

### Prizes CSV
```csv
ID,PrizeName
1,Grand Prize
2,Second Prize
3,Third Prize
```

## Usage

1. Upload a participants CSV file or add them manually via the settings button
2. Upload a prizes CSV file or add them manually
3. Click the "SPIN" button to select a winner
4. The winner and prize will be displayed in a celebration modal
5. After closing the modal, the winner is automatically removed from the pool

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Papa Parse (CSV parsing)
- Canvas Confetti
- Lucide React (icons)
