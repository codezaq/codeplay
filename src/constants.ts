import { Project } from './types';

export const CATEGORIES = ['All', 'Automation', 'Production', 'ML'];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Chatbot RAG System',
    category: 'Automation',
    image: 'https://stupid-coffee-cow.myfilebase.com/ipfs/QmWtDoENAY39RweVUw8QEtR4mFPWyMeWwWsYMobu4eR67x',
    tags: ['N8n', 'VLLM', 'OpenAI'],
    description: 'Building a Retrieval-Augmented Generation system to enhance chatbot responses with real-time data and contextual understanding.',
    docsLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Chatbot_RAG_System.ipynb',
    sourceLink: 'https://stupid-coffee-cow.myfilebase.com/ipfs/Qmb71r4kAgcfA7jEYJFi5uC5jF3fMvtcA15pBbaV6nZ95R',
    color: 'from-green-400 to-lime-500',
  },
  {
    id: '2',
    title: 'Diarizing Interview',
    category: 'Production',
    image: 'https://stupid-coffee-cow.myfilebase.com/ipfs/QmU9qe3HXqnTmWNLKd1zh46mgZnxZaz4hvazXk8itUvf7M',
    tags: ['Python', 'FastAPI', 'Production'],
    description: 'Documenting the process of diarizing interview recordings, including data preprocessing, model training, and evaluation metrics for speaker separation.',
    docsLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Diarizing%20Interview%20Documentation.ipynb%20-%20Colab.pdf',
    sourceLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Diarizing%20Interview%20Documentation.ipynb%20-%20Colab.pdf',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: '3',
    title: 'Mouse Hand Detector',
    category: 'ML',
    image: 'https://stupid-coffee-cow.myfilebase.com/ipfs/QmWQWvKbTGQAyde58wwF2hUoyqxcsHXmokf68Fod1WLdmX',
    tags: ['Python', 'Computer Vision', 'ML', 'OpenCV'],
    description: 'A real-time hand detection system for mouse control using computer vision techniques. The project includes a web interface for visualizing hand movements and controlling the cursor.',
    docsLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/mouse.py',
    sourceLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Mouse%20Detector.pdf',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: '4',
    title: 'Virtual Board Hand Recognition',
    category: 'ML',
    image: 'https://stupid-coffee-cow.myfilebase.com/ipfs/QmUP9pzwguvnNX7gr1fjkipibW3PGmJQeXgTt3VT14gzjh',
    tags: ['Python', 'Computer VVision', 'ML', 'Deep Learning'],
    description: 'A virtual whiteboard application that uses hand gesture recognition for an interactive drawing experience. Users can draw, erase, and manipulate objects using hand movements.',
    docsLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Papan%20Tulis%20Virtual.py',
    sourceLink: 'https://github.com/LukmanZak/MLDeveloper/blob/main/Papan%20Tulis%20Virtual.pdf',
  },
];

