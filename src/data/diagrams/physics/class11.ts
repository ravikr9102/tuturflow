import { DiagramMetadata } from '../../../types/diagram';

export const class11PhysicsDiagrams: DiagramMetadata[] = [
  {
    id: 'physics_11_ch1_d1',
    title: 'Rutherford Alpha Scattering Experiment',
    description: 'The famous alpha-particle scattering experiment of Rutherford which led to the discovery of the atomic nucleus.',
    subject: 'Physics',
    classLevel: '11th',
    chapter: 'Physical World',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    labels: [
      'Alpha Source',
      'Gold Foil',
      'Scattered Alpha Particles',
      'Zinc Sulfide Screen',
      'Nuclear Model'
    ],
    keywords: [
      'rutherford',
      'alpha scattering',
      'nuclear model',
      'atom',
      'experiment',
      'gold foil',
      'atomic structure'
    ]
  },
  {
    id: 'physics_11_ch1_d2',
    title: 'Vector Addition Using Parallelogram Method',
    description: 'Illustration of vector addition using the parallelogram method.',
    subject: 'Physics',
    classLevel: '11th',
    chapter: 'Physical World and Measurement',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    labels: [
      'Vector A',
      'Vector B',
      'Resultant Vector R',
      'Parallelogram',
      'Angle θ'
    ],
    keywords: [
      'vector',
      'addition',
      'parallelogram',
      'resultant',
      'magnitude',
      'direction'
    ]
  }
];

export const diagramContexts = {
  'physics_11_ch1_d1': {
    theoreticalContext: `Theory and experiment go hand in hand in physics and help each other's progress. The alpha scattering experiments of Rutherford gave the nuclear model of the atom.`,
    historicalSignificance: 'This experiment was conducted in 1909 and fundamentally changed our understanding of atomic structure.',
    experimentalSetup: 'A beam of alpha particles was directed at a very thin gold foil. The scattering pattern of these particles revealed the nuclear structure of atoms.'
  },
  'physics_11_ch1_d2': {
    theoreticalContext: 'Vector addition is fundamental to understanding physical quantities that have both magnitude and direction.',
    applications: 'This method is used in analyzing forces, velocities, accelerations, and other vector quantities in physics.',
    mathematicalBasis: 'The resultant vector R is given by R² = A² + B² + 2AB cos θ, where θ is the angle between vectors A and B.'
  }
};