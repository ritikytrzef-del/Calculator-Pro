import { ButtonConfig } from './types';
import { Divide, Equal, Minus, Plus, X, Keyboard, Sparkles } from 'lucide-react';
import React from 'react';

// Modern Mobile UI Button Styles
const BASE_BTN = "relative overflow-hidden transition-all duration-200 active:scale-90 flex items-center justify-center rounded-[24px] shadow-sm active:shadow-inner";

// Neumorphic / Glass styles for light/dark modes
const NUM_BTN = `${BASE_BTN} bg-white dark:bg-white/5 text-gray-700 dark:text-gray-100 text-3xl font-light hover:bg-gray-50 dark:hover:bg-white/10`;

// Soft gradient for operators
const OP_BTN = `${BASE_BTN} bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-3xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20`;

// Utility buttons (Grayish)
const FN_BTN = `${BASE_BTN} bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xl font-medium hover:bg-gray-200 dark:hover:bg-white/10`;

// Accent Actions
const AC_BTN = `${BASE_BTN} bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20`;

// Primary Gradients
const EQUAL_BTN = `${BASE_BTN} bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40 text-4xl`;
const AI_BTN = `${BASE_BTN} bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-pink-500/40 font-bold tracking-wide`;

export const BASIC_BUTTONS: ButtonConfig[] = [
  { label: 'C', value: 'clear', type: 'action', className: AC_BTN },
  { label: '( )', value: '()', type: 'function', className: FN_BTN },
  { label: '%', value: '%', type: 'function', className: FN_BTN },
  { label: '÷', value: '/', type: 'operator', className: OP_BTN, icon: <Divide size={24} /> },
  
  { label: '7', value: '7', type: 'number', className: NUM_BTN },
  { label: '8', value: '8', type: 'number', className: NUM_BTN },
  { label: '9', value: '9', type: 'number', className: NUM_BTN },
  { label: '×', value: '*', type: 'operator', className: OP_BTN, icon: <X size={24} /> },
  
  { label: '4', value: '4', type: 'number', className: NUM_BTN },
  { label: '5', value: '5', type: 'number', className: NUM_BTN },
  { label: '6', value: '6', type: 'number', className: NUM_BTN },
  { label: '-', value: '-', type: 'operator', className: OP_BTN, icon: <Minus size={24} /> },
  
  { label: '1', value: '1', type: 'number', className: NUM_BTN },
  { label: '2', value: '2', type: 'number', className: NUM_BTN },
  { label: '3', value: '3', type: 'number', className: NUM_BTN },
  { label: '+', value: '+', type: 'operator', className: OP_BTN, icon: <Plus size={24} /> },
  
  { label: 'KEY', value: 'keyboard_mode', type: 'action', className: FN_BTN, icon: <Keyboard size={24} /> },
  { label: '0', value: '0', type: 'number', className: NUM_BTN },
  { label: '.', value: '.', type: 'number', className: NUM_BTN },
  { label: '=', value: '=', type: 'action', className: EQUAL_BTN, icon: <Equal size={32} /> },
];

export const SCIENTIFIC_BUTTONS: ButtonConfig[] = [
  { label: 'AI', value: 'ai_solve', type: 'action', className: AI_BTN, icon: <Sparkles size={18} /> },
  { label: 'sin', value: 'sin(', type: 'scientific' },
  { label: 'cos', value: 'cos(', type: 'scientific' },
  { label: 'tan', value: 'tan(', type: 'scientific' },
  { label: 'deg', value: 'deg_toggle', type: 'scientific' },
  
  { label: '$', value: '$', type: 'scientific' },
  { label: '€', value: '€', type: 'scientific' },
  { label: '₹', value: '₹', type: 'scientific' },
  { label: '£', value: '£', type: 'scientific' },
  { label: '!', value: '!', type: 'scientific' },

  { label: 'ln', value: 'ln(', type: 'scientific' },
  { label: 'log', value: 'log(', type: 'scientific' },
  { label: 'π', value: 'π', type: 'scientific' },
  { label: 'e', value: 'e', type: 'scientific' },
  { label: '^', value: '^', type: 'scientific' },
  
  { label: '√', value: 'sqrt(', type: 'scientific' },
  { label: 'inv', value: '1/', type: 'scientific' },
  { label: 'abs', value: 'abs(', type: 'scientific' },
  { label: 'rad', value: 'rad', type: 'scientific' },
  { label: 'mod', value: '%', type: 'scientific' },
];