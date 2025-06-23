# Algo-Forge

Algo-Forge is a web application designed to help developers practice and master algorithmic problem-solving skills. It provides a collection of coding problems across various categories and difficulty levels, complete with detailed descriptions, solutions, and a user-friendly interface for exploring problems.

## Features

- **Problem Catalog**: A curated list of 40 coding problems covering topics like arrays, linked lists, trees, dynamic programming, graphs, and more.
- **Interactive Dialog**: A React-based dialog component (`ProblemDialog`) to display problem details, including:
  - Problem title, difficulty, and category.
  - Estimated time and points for solving.
  - Detailed problem description.
  - Toggleable solution code in Python with example usage.
  - Tips and hints for solving the problem.
  - Able to download completed problems
- **DSA Community**: Users can create posts , chat with other developers at realtime
- **Responsive UI**: Built with modern UI components (e.g., Dialog, ScrollArea, Badge) for a seamless user experience.
- **Extensible**: Easily add new problems by updating the `dataStructure.json` file and corresponding solutions in the `ProblemDialog` component.

## Tech Stack

- **Frontend**: React, TypeScript
- **UI Components**: Custom UI library (`@/components/ui/*`) with components like Dialog, Button, ScrollArea, and Badge
- **Icons**: Lucide React (`lucide-react`)
- **Data**: JSON-based problem definitions
- **Solutions**: Python code snippets for each problem

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anandtech09/Algo_Forge.git
   cd Algo-Forge
Install dependencies:
bash
npm install
Start the development server:
bash
npm start
Open the application in your browser at http://localhost:3000.
Project Structure
algo-forge/
├── src/
│   ├── components/
│   │   └── ProblemDialog.tsx  # React component for displaying problem details
│   ├── data/
│   │   └── problems.json      # JSON file containing problem definitions
├── README.md                  # Project documentation
├── LICENSE                    # MIT License
├── package.json               # Project dependencies and scripts

### Contributing
Contributions are welcome! Please follow these steps:
Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments
Inspired by platforms like LeetCode and HackerRank.
Built with love for the coding community by Your Name.
Happy coding with Algo-Forge! 🚀