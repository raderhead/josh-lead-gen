
import { QuizQuestion } from './types';

export const initialQuestions: QuizQuestion[] = [
  {
    id: 0,
    question: "Are you looking to buy or sell commercial property?",
    type: 'radio',
    options: ['Buy', 'Sell'],
    forUserType: 'both'
  },
  {
    id: 1,
    question: "What type of commercial property are you looking for?",
    description: "Select the property type that best fits your needs",
    type: 'radio',
    options: ['Office Space', 'Retail/Storefront', 'Industrial/Warehouse', 'Multi-family', 'Restaurant', 'Mixed-use', 'Land/Development', 'Other'],
    forUserType: 'buyer'
  },
  {
    id: 2,
    question: "What other areas are you considering besides Abilene?",
    description: "Select all that apply",
    type: 'checkbox',
    options: ['Buffalo Gap', 'Eastland', 'Tuscola', 'Not considering other areas', 'Other'],
    forUserType: 'buyer'
  },
  {
    id: 3,
    question: "What is your approximate budget?",
    type: 'select',
    options: ['Under $200,000', '$200,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000 - $2,000,000', '$2,000,000 - $5,000,000', 'Over $5,000,000'],
    forUserType: 'buyer'
  },
  {
    id: 4,
    question: "What is your preferred square footage?",
    type: 'select',
    options: ['Under 1,000 sq ft', '1,000 - 2,500 sq ft', '2,500 - 5,000 sq ft', '5,000 - 10,000 sq ft', '10,000 - 25,000 sq ft', 'Over 25,000 sq ft'],
    forUserType: 'buyer'
  },
  {
    id: 5,
    question: "What features are most important to you?",
    description: "Select all that apply",
    type: 'checkbox',
    options: ['High visibility location', 'Ample parking', 'Loading dock', 'Open floor plan', 'Multiple offices', 'Reception area', 'Kitchen/break room', 'Conference rooms', 'Storage space', 'Energy efficient'],
    forUserType: 'buyer'
  },
  {
    id: 6,
    question: "When are you looking to make your investment?",
    type: 'radio',
    options: ['Immediately (0-3 months)', 'Soon (3-6 months)', 'This year (6-12 months)', 'Just exploring (>12 months)'],
    forUserType: 'buyer'
  },
  {
    id: 7,
    question: "Are you a first-time investor, experienced buyer, or business owner?",
    type: 'radio',
    options: ['First-time investor', 'Experienced buyer', 'Business owner', 'Other'],
    forUserType: 'buyer'
  },
  {
    id: 8,
    question: "What is the address of the commercial property you are selling?",
    description: "Please provide the full address of your property",
    type: 'text',
    placeholder: "Enter property address",
    forUserType: 'seller'
  },
  {
    id: 9,
    question: "What type of commercial property are you selling?",
    type: 'radio',
    options: ['Office Space', 'Retail/Storefront', 'Industrial/Warehouse', 'Multi-family', 'Restaurant', 'Mixed-use', 'Land/Development', 'Other'],
    forUserType: 'seller'
  },
  {
    id: 10,
    question: "What is the approximate square footage of your property?",
    type: 'select',
    options: ['Under 1,000 sq ft', '1,000 - 2,500 sq ft', '2,500 - 5,000 sq ft', '5,000 - 10,000 sq ft', '10,000 - 25,000 sq ft', 'Over 25,000 sq ft'],
    forUserType: 'seller'
  },
  {
    id: 11,
    question: "How long have you owned the property?",
    type: 'radio',
    options: ['Less than 1 year', '1-5 years', '5-10 years', '10+ years'],
    forUserType: 'seller'
  },
  {
    id: 12,
    question: "What is your reason for selling?",
    type: 'radio',
    options: ['Upgrading to larger space', 'Downsizing', 'Relocating', 'Investment strategy', 'Retirement', 'Financial reasons', 'Other'],
    forUserType: 'seller'
  },
  {
    id: 13,
    question: "Is the property currently occupied?",
    type: 'radio',
    options: ['Yes, owner-occupied', 'Yes, tenant-occupied', 'No, vacant', 'Partially occupied'],
    forUserType: 'seller'
  },
  {
    id: 14,
    question: "How soon are you looking to sell?",
    type: 'radio',
    options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Within a year', 'Just exploring options'],
    forUserType: 'seller'
  },
];
