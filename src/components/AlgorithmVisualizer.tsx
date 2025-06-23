import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VisualizerProps {
  algorithm: string;
  data: number[];
  onStepChange?: (step: number) => void;
}

const AlgorithmVisualizer: React.FC<VisualizerProps> = ({ algorithm, data, onStepChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState([500]);
  const [array, setArray] = useState(data);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [steps, setSteps] = useState<any[]>([]);

  // Generate steps based on algorithm
  useEffect(() => {
    const generatedSteps = generateAlgorithmSteps(algorithm, data);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setArray(data);
    setHighlightedIndices([]);
  }, [algorithm, data]);

  const generateAlgorithmSteps = (algo: string, inputData: number[]) => {
    switch (algo) {
      // Array operations
      case 'array-insert':
        return generateArrayInsertSteps(inputData);
      case 'array-delete':
        return generateArrayDeleteSteps(inputData);
      case 'array-search':
        return generateArraySearchSteps(inputData);
      
      // Linked list operations
      case 'linked-list-insert':
        return generateLinkedListSteps(inputData, 'insert');
      case 'linked-list-delete':
        return generateLinkedListSteps(inputData, 'delete');
      case 'linked-list-traverse':
        return generateLinkedListSteps(inputData, 'traverse');
      
      // Stack operations
      case 'stack-push':
        return generateStackSteps(inputData, 'push');
      case 'stack-pop':
        return generateStackSteps(inputData, 'pop');
      
      // Queue operations
      case 'queue-enqueue':
        return generateQueueSteps(inputData, 'enqueue');
      case 'queue-dequeue':
        return generateQueueSteps(inputData, 'dequeue');
      
      // Sorting algorithms
      case 'bubble-sort':
        return generateBubbleSortSteps(inputData);
      case 'quick-sort':
        return generateQuickSortSteps(inputData);
      case 'merge-sort':
        return generateMergeSortSteps(inputData);
      case 'insertion-sort':
        return generateInsertionSortSteps(inputData);
      case 'selection-sort':
        return generateSelectionSortSteps(inputData);
      case 'heap-sort':
        return generateHeapSortSteps(inputData);
      case 'radix-sort':
        return generateRadixSortSteps(inputData);
      case 'counting-sort':
        return generateCountingSortSteps(inputData);
      
      // Searching algorithms
      case 'linear-search':
        return generateLinearSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      case 'binary-search':
        return generateBinarySearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      case 'jump-search':
        return generateJumpSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      case 'exponential-search':
        return generateExponentialSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      case 'interpolation-search':
        return generateInterpolationSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      case 'ternary-search':
        return generateTernarySearchSteps(inputData, inputData[Math.floor(inputData.length / 2)]);
      
      // Graph algorithms
      case 'bfs':
        return generateBFSSteps(inputData);
      case 'dfs':
        return generateDFSSteps(inputData);
      case 'dijkstra':
        return generateDijkstraSteps(inputData);
      case 'bellman-ford':
        return generateBellmanFordSteps(inputData);
      case 'floyd-warshall':
        return generateFloydWarshallSteps(inputData);
      case 'kruskals':
        return generateKruskalsSteps(inputData);
      case 'prims':
        return generatePrimsSteps(inputData);
      case 'topological-sort':
        return generateTopologicalSortSteps(inputData);
      
      // Tree algorithms
      case 'inorder':
        return generateTreeTraversalSteps(inputData, 'inorder');
      case 'preorder':
        return generateTreeTraversalSteps(inputData, 'preorder');
      case 'postorder':
        return generateTreeTraversalSteps(inputData, 'postorder');
      case 'level-order':
        return generateTreeTraversalSteps(inputData, 'level-order');
      case 'bst-insert':
        return generateBSTSteps(inputData, 'insert');
      case 'bst-delete':
        return generateBSTSteps(inputData, 'delete');
      case 'avl-rotation':
        return generateAVLSteps(inputData);
      case 'red-black-fix':
        return generateRedBlackSteps(inputData);
      
      // Dynamic programming
      case 'fibonacci':
        return generateFibonacciSteps(inputData);
      case 'knapsack':
        return generateKnapsackSteps(inputData);
      case 'lcs':
        return generateLCSSteps(inputData);
      case 'edit-distance':
        return generateEditDistanceSteps(inputData);
      case 'coin-change':
        return generateCoinChangeSteps(inputData);
      
      default:
        return [];
    }
  };

  // Array operation implementations
  const generateArrayInsertSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const newElement = 99;
    const insertIndex = 2;
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Starting array: [${workingArray.join(', ')}]`
    });
    
    steps.push({
      array: [...workingArray],
      comparing: [insertIndex],
      description: `Inserting ${newElement} at index ${insertIndex}`
    });
    
    // Shift elements to the right
    for (let i = workingArray.length; i > insertIndex; i--) {
      if (i - 1 >= 0) {
        workingArray[i] = workingArray[i - 1];
        steps.push({
          array: [...workingArray],
          comparing: [i, i - 1],
          description: `Shifting element ${workingArray[i]} to position ${i}`
        });
      }
    }
    
    workingArray[insertIndex] = newElement;
    steps.push({
      array: [...workingArray],
      comparing: [insertIndex],
      description: `Inserted ${newElement} at index ${insertIndex}`
    });
    
    return steps;
  };

  const generateArrayDeleteSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const deleteIndex = 2;
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Starting array: [${workingArray.join(', ')}]`
    });
    
    steps.push({
      array: [...workingArray],
      comparing: [deleteIndex],
      description: `Deleting element at index ${deleteIndex}: ${workingArray[deleteIndex]}`
    });
    
    // Shift elements to the left
    for (let i = deleteIndex; i < workingArray.length - 1; i++) {
      workingArray[i] = workingArray[i + 1];
      steps.push({
        array: [...workingArray],
        comparing: [i, i + 1],
        description: `Shifting element ${workingArray[i]} to position ${i}`
      });
    }
    
    workingArray.pop();
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Element deleted. Final array: [${workingArray.join(', ')}]`
    });
    
    return steps;
  };

  const generateArraySearchSteps = (arr: number[]) => {
    const steps = [];
    const target = arr[3] || arr[0];
    
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        comparing: [i],
        description: `Checking element at index ${i}: ${arr[i]} (target: ${target})`
      });
      
      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          found: i,
          description: `Found target ${target} at index ${i}!`
        });
        break;
      }
    }
    
    return steps;
  };

  // Linked List operations (simplified visualization using array)
  const generateLinkedListSteps = (arr: number[], operation: string) => {
    const steps = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Linked List: ${workingArray.join(' -> ')}`
    });
    
    if (operation === 'insert') {
      const newNode = 99;
      workingArray.splice(2, 0, newNode);
      steps.push({
        array: [...workingArray],
        comparing: [2],
        description: `Inserted ${newNode} at position 2`
      });
    } else if (operation === 'delete') {
      const deletedValue = workingArray[2];
      workingArray.splice(2, 1);
      steps.push({
        array: [...workingArray],
        comparing: [],
        description: `Deleted ${deletedValue} from linked list`
      });
    } else if (operation === 'traverse') {
      for (let i = 0; i < workingArray.length; i++) {
        steps.push({
          array: [...workingArray],
          comparing: [i],
          description: `Visiting node ${i}: ${workingArray[i]}`
        });
      }
    }
    
    return steps;
  };

  // Stack operations
  const generateStackSteps = (arr: number[], operation: string) => {
    const steps = [];
    const stack = [...arr];
    
    steps.push({
      array: [...stack],
      comparing: [],
      description: `Stack: [${stack.join(', ')}] (top -> bottom)`
    });
    
    if (operation === 'push') {
      const newElement = 99;
      stack.push(newElement);
      steps.push({
        array: [...stack],
        comparing: [stack.length - 1],
        description: `Pushed ${newElement} onto stack`
      });
    } else if (operation === 'pop') {
      const poppedElement = stack.pop();
      steps.push({
        array: [...stack],
        comparing: [],
        description: `Popped ${poppedElement} from stack`
      });
    }
    
    return steps;
  };

  // Queue operations
  const generateQueueSteps = (arr: number[], operation: string) => {
    const steps = [];
    const queue = [...arr];
    
    steps.push({
      array: [...queue],
      comparing: [],
      description: `Queue: [${queue.join(', ')}] (front -> rear)`
    });
    
    if (operation === 'enqueue') {
      const newElement = 99;
      queue.push(newElement);
      steps.push({
        array: [...queue],
        comparing: [queue.length - 1],
        description: `Enqueued ${newElement} to rear of queue`
      });
    } else if (operation === 'dequeue') {
      const dequeuedElement = queue.shift();
      steps.push({
        array: [...queue],
        comparing: [],
        description: `Dequeued ${dequeuedElement} from front of queue`
      });
    }
    
    return steps;
  };

  // Counting Sort implementation
  const generateCountingSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const max = Math.max(...workingArray);
    const count = new Array(max + 1).fill(0);
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Starting counting sort. Max value: ${max}`
    });
    
    // Count occurrences
    for (let i = 0; i < workingArray.length; i++) {
      count[workingArray[i]]++;
      steps.push({
        array: [...workingArray],
        comparing: [i],
        description: `Counting occurrences of ${workingArray[i]}`
      });
    }
    
    // Reconstruct sorted array
    let index = 0;
    for (let i = 0; i <= max; i++) {
      while (count[i] > 0) {
        workingArray[index] = i;
        steps.push({
          array: [...workingArray],
          comparing: [index],
          description: `Placing ${i} at index ${index}`
        });
        index++;
        count[i]--;
      }
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Counting sort complete!"
    });
    
    return steps;
  };

  // Radix Sort implementation
  const generateRadixSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const max = Math.max(...workingArray);
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Starting radix sort. Max value: ${max}`
    });
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      steps.push({
        array: [...workingArray],
        comparing: [],
        description: `Sorting by digit at position ${exp}`
      });
      
      const output = new Array(workingArray.length);
      const count = new Array(10).fill(0);
      
      // Count occurrences of each digit
      for (let i = 0; i < workingArray.length; i++) {
        count[Math.floor(workingArray[i] / exp) % 10]++;
      }
      
      // Change count[i] to actual position
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
      
      // Build output array
      for (let i = workingArray.length - 1; i >= 0; i--) {
        const digit = Math.floor(workingArray[i] / exp) % 10;
        output[count[digit] - 1] = workingArray[i];
        count[digit]--;
      }
      
      // Copy output array to working array
      for (let i = 0; i < workingArray.length; i++) {
        workingArray[i] = output[i];
        steps.push({
          array: [...workingArray],
          comparing: [i],
          description: `Placed ${workingArray[i]} based on digit ${Math.floor(workingArray[i] / exp) % 10}`
        });
      }
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Radix sort complete!"
    });
    
    return steps;
  };

  // Bubble Sort implementation
  const generateBubbleSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    
    for (let i = 0; i < workingArray.length; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          description: `Comparing ${workingArray[j]} and ${workingArray[j + 1]}`
        });
        
        if (workingArray[j] > workingArray[j + 1]) {
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          steps.push({
            array: [...workingArray],
            comparing: [j, j + 1],
            description: `Swapped! Array is now [${workingArray.join(', ')}]`
          });
        }
      }
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Sorting complete!"
    });
    
    return steps;
  };

  // Insertion Sort implementation
  const generateInsertionSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    
    for (let i = 1; i < workingArray.length; i++) {
      const key = workingArray[i];
      let j = i - 1;
      
      steps.push({
        array: [...workingArray],
        comparing: [i],
        description: `Inserting ${key} into sorted portion`
      });
      
      while (j >= 0 && workingArray[j] > key) {
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          description: `Moving ${workingArray[j]} to the right`
        });
        
        workingArray[j + 1] = workingArray[j];
        j = j - 1;
        
        steps.push({
          array: [...workingArray],
          comparing: [j + 1],
          description: `Shifted array: [${workingArray.join(', ')}]`
        });
      }
      
      workingArray[j + 1] = key;
      steps.push({
        array: [...workingArray],
        comparing: [j + 1],
        description: `Placed ${key} at position ${j + 1}`
      });
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Insertion sort complete!"
    });
    
    return steps;
  };

  // Selection Sort implementation
  const generateSelectionSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    
    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIndex = i;
      
      steps.push({
        array: [...workingArray],
        comparing: [i],
        description: `Finding minimum from position ${i}`
      });
      
      for (let j = i + 1; j < workingArray.length; j++) {
        steps.push({
          array: [...workingArray],
          comparing: [minIndex, j],
          description: `Comparing ${workingArray[minIndex]} with ${workingArray[j]}`
        });
        
        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          steps.push({
            array: [...workingArray],
            comparing: [minIndex],
            description: `New minimum found: ${workingArray[minIndex]}`
          });
        }
      }
      
      if (minIndex !== i) {
        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
        steps.push({
          array: [...workingArray],
          comparing: [i, minIndex],
          description: `Swapped ${workingArray[minIndex]} with ${workingArray[i]}`
        });
      }
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Selection sort complete!"
    });
    
    return steps;
  };

  // Heap Sort implementation
  const generateHeapSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    // Build max heap
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Building max heap..."
    });
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(workingArray, n, i, steps);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      [workingArray[0], workingArray[i]] = [workingArray[i], workingArray[0]];
      steps.push({
        array: [...workingArray],
        comparing: [0, i],
        description: `Moved max element ${workingArray[i]} to position ${i}`
      });
      
      heapify(workingArray, i, 0, steps);
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Heap sort complete!"
    });
    
    return steps;
  };

  const heapify = (arr: number[], n: number, i: number, steps: any[]) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: [...arr],
        comparing: [i, largest],
        description: `Heapifying: swapped ${arr[largest]} with ${arr[i]}`
      });
      
      heapify(arr, n, largest, steps);
    }
  };

  // Merge Sort implementation
  const generateMergeSortSteps = (arr: number[]) => {
    const steps: any[] = [];
    const workingArray = [...arr];
    
    const mergeSort = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          description: `Dividing array from ${left} to ${right}, mid: ${mid}`
        });
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
      }
    };
    
    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
        
        steps.push({
          array: [...arr],
          comparing: [k - 1],
          description: `Merging: placed ${arr[k - 1]} at position ${k - 1}`
        });
      }
      
      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }
      
      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }
    };
    
    mergeSort(workingArray, 0, workingArray.length - 1);
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Merge sort complete!"
    });
    
    return steps;
  };

  // Quick Sort implementation
  const generateQuickSortSteps = (arr: number[]) => {
    const steps: any[] = [];
    const workingArray = [...arr];
    
    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };
    
    const partition = (low: number, high: number) => {
      const pivot = workingArray[high];
      let i = low - 1;
      
      steps.push({
        array: [...workingArray],
        pivot: high,
        comparing: [],
        description: `Pivot selected: ${pivot} at index ${high}`
      });
      
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...workingArray],
          pivot: high,
          comparing: [j],
          description: `Comparing ${workingArray[j]} with pivot ${pivot}`
        });
        
        if (workingArray[j] < pivot) {
          i++;
          [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
          steps.push({
            array: [...workingArray],
            pivot: high,
            comparing: [i, j],
            description: `Swapped ${workingArray[j]} and ${workingArray[i]}`
          });
        }
      }
      
      [workingArray[i + 1], workingArray[high]] = [workingArray[high], workingArray[i + 1]];
      steps.push({
        array: [...workingArray],
        pivot: i + 1,
        comparing: [],
        description: `Pivot ${pivot} placed in correct position`
      });
      
      return i + 1;
    };
    
    quickSort(0, workingArray.length - 1);
    return steps;
  };

  // Binary Search implementation
  const generateBinarySearchSteps = (arr: number[], target: number) => {
    const steps: any[] = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    let left = 0;
    let right = sortedArray.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        array: sortedArray,
        comparing: [mid],
        range: [left, right],
        description: `Checking middle element: ${sortedArray[mid]} (target: ${target})`
      });
      
      if (sortedArray[mid] === target) {
        steps.push({
          array: sortedArray,
          found: mid,
          description: `Found target ${target} at index ${mid}!`
        });
        break;
      } else if (sortedArray[mid] < target) {
        left = mid + 1;
        steps.push({
          array: sortedArray,
          comparing: [],
          range: [left, right],
          description: `${sortedArray[mid]} < ${target}, searching right half`
        });
      } else {
        right = mid - 1;
        steps.push({
          array: sortedArray,
          comparing: [],
          range: [left, right],
          description: `${sortedArray[mid]} > ${target}, searching left half`
        });
      }
    }
    
    return steps;
  };

  // Linear Search implementation
  const generateLinearSearchSteps = (arr: number[], target: number) => {
    const steps: any[] = [];
    
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        comparing: [i],
        description: `Checking element at index ${i}: ${arr[i]} (target: ${target})`
      });
      
      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          found: i,
          description: `Found target ${target} at index ${i}!`
        });
        break;
      }
    }
    
    return steps;
  };

  // Jump Search implementation
  const generateJumpSearchSteps = (arr: number[], target: number) => {
    const steps = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    const n = sortedArray.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    steps.push({
      array: sortedArray,
      comparing: [],
      description: `Jump Search: step size = √${n} = ${step}`
    });
    
    // Find the block where element is present
    while (prev < n && sortedArray[Math.min(step, n) - 1] < target) {
      steps.push({
        array: sortedArray,
        comparing: [Math.min(step, n) - 1],
        description: `Checking block ending at index ${Math.min(step, n) - 1}: ${sortedArray[Math.min(step, n) - 1]} < ${target}`
      });
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) break;
    }
    
    // Linear search in the identified block
    for (let i = prev; i < Math.min(step, n); i++) {
      steps.push({
        array: sortedArray,
        comparing: [i],
        description: `Linear search in block: checking ${sortedArray[i]}`
      });
      if (sortedArray[i] === target) {
        steps.push({
          array: sortedArray,
          found: i,
          description: `Found target ${target} at index ${i}!`
        });
        break;
      }
    }
    
    return steps;
  };

  // Exponential Search placeholder
  const generateExponentialSearchSteps = (arr: number[], target: number) => {
    const steps = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    let bound = 1;
    
    steps.push({
      array: sortedArray,
      comparing: [],
      description: `Exponential Search: starting with bound = 1`
    });
    
    while (bound < sortedArray.length && sortedArray[bound] < target) {
      steps.push({
        array: sortedArray,
        comparing: [bound],
        description: `Value at bound ${bound} is ${sortedArray[bound]} < target ${target}`
      });
      bound *= 2;
    }
    
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, sortedArray.length - 1);
    
    steps.push({
      array: sortedArray,
      comparing: [],
      description: `Binary search between indexes ${left} and ${right}`
    });
    
    // Use binary search steps within the range
    let l = left;
    let r = right;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      steps.push({
        array: sortedArray,
        comparing: [mid],
        description: `Checking middle element: ${sortedArray[mid]}`
      });
      if (sortedArray[mid] === target) {
        steps.push({
          array: sortedArray,
          found: mid,
          description: `Found target ${target} at index ${mid}!`
        });
        break;
      } else if (sortedArray[mid] < target) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    
    return steps;
  };

  // Interpolation Search placeholder
  const generateInterpolationSearchSteps = (arr: number[], target: number) => {
    const steps = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    let low = 0;
    let high = sortedArray.length - 1;
    
    steps.push({
      array: sortedArray,
      comparing: [],
      description: `Interpolation Search: starting search`
    });
    
    while (low <= high && target >= sortedArray[low] && target <= sortedArray[high]) {
      if (low === high) {
        if (sortedArray[low] === target) {
          steps.push({
            array: sortedArray,
            found: low,
            description: `Found target ${target} at index ${low}!`
          });
        }
        break;
      }
      const pos = low + Math.floor(((target - sortedArray[low]) * (high - low)) / (sortedArray[high] - sortedArray[low]));
      steps.push({
        array: sortedArray,
        comparing: [pos],
        description: `Checking position ${pos} with value ${sortedArray[pos]}`
      });
      if (sortedArray[pos] === target) {
        steps.push({
          array: sortedArray,
          found: pos,
          description: `Found target ${target} at index ${pos}!`
        });
        break;
      }
      if (sortedArray[pos] < target) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }
    
    return steps;
  };

  // Ternary Search placeholder
  const generateTernarySearchSteps = (arr: number[], target: number) => {
    const steps = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    
    const ternarySearch = (left: number, right: number) => {
      if (right >= left) {
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);
        
        steps.push({
          array: sortedArray,
          comparing: [mid1, mid2],
          description: `Checking mid1: ${sortedArray[mid1]}, mid2: ${sortedArray[mid2]}`
        });
        
        if (sortedArray[mid1] === target) {
          steps.push({
            array: sortedArray,
            found: mid1,
            description: `Found target ${target} at index ${mid1}!`
          });
          return;
        }
        if (sortedArray[mid2] === target) {
          steps.push({
            array: sortedArray,
            found: mid2,
            description: `Found target ${target} at index ${mid2}!`
          });
          return;
        }
        
        if (target < sortedArray[mid1]) {
          ternarySearch(left, mid1 - 1);
        } else if (target > sortedArray[mid2]) {
          ternarySearch(mid2 + 1, right);
        } else {
          ternarySearch(mid1 + 1, mid2 - 1);
        }
      }
    };
    
    ternarySearch(0, sortedArray.length - 1);
    return steps;
  };

  // Placeholder implementations for graph algorithms
  const generateBFSSteps = (arr: number[]) => {
    const steps = [];
    steps.push({
      array: [...arr],
      comparing: [],
      description: "BFS traversal simulation - visiting nodes level by level"
    });
    
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        comparing: [i],
        description: `Visiting node ${arr[i]} at level ${Math.floor(Math.log2(i + 1))}`
      });
    }
    
    return steps;
  };

  const generateDFSSteps = (arr: number[]) => {
    const steps = [];
    steps.push({
      array: [...arr],
      comparing: [],
      description: "DFS traversal simulation - exploring depths first"
    });
    
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        comparing: [i],
        description: `Visiting node ${arr[i]} - depth ${i % 3}`
      });
    }
    
    return steps;
  };

  const generateDijkstraSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const dist = new Array(n).fill(Infinity);
    const visited = new Array(n).fill(false);
    const startNode = 0;
    
    dist[startNode] = 0;
    
    steps.push({
      array: [...dist],
      comparing: [startNode],
      description: `Dijkstra's Algorithm: Starting from node ${startNode}, distance = 0`
    });
    
    for (let count = 0; count < n - 1; count++) {
      // Find minimum distance vertex
      let u = -1;
      for (let v = 0; v < n; v++) {
        if (!visited[v] && (u === -1 || dist[v] < dist[u])) {
          u = v;
        }
      }
      
      visited[u] = true;
      steps.push({
        array: [...dist],
        comparing: [u],
        description: `Selected node ${u} with minimum distance ${dist[u]}`
      });
      
      // Update distances of adjacent vertices
      for (let v = 0; v < n; v++) {
        if (!visited[v] && Math.abs(u - v) === 1) { // Simulate adjacent nodes
          const weight = Math.abs(arr[u] - arr[v]);
          if (dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
            steps.push({
              array: [...dist],
              comparing: [u, v],
              description: `Updated distance to node ${v}: ${dist[v]}`
            });
          }
        }
      }
    }
    
    steps.push({
      array: [...dist],
      comparing: [],
      description: "Dijkstra's algorithm complete! Shortest distances found."
    });
    
    return steps;
  };

  const generateBellmanFordSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const dist = new Array(n).fill(Infinity);
    const startNode = 0;
    
    dist[startNode] = 0;
    
    steps.push({
      array: [...dist],
      comparing: [startNode],
      description: `Bellman-Ford: Starting from node ${startNode}`
    });
    
    // Relax all edges |V| - 1 times
    for (let i = 0; i < n - 1; i++) {
      steps.push({
        array: [...dist],
        comparing: [],
        description: `Iteration ${i + 1}: Relaxing all edges`
      });
      
      for (let u = 0; u < n - 1; u++) {
        const v = u + 1;
        const weight = Math.abs(arr[u] - arr[v]);
        
        if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          steps.push({
            array: [...dist],
            comparing: [u, v],
            description: `Relaxed edge ${u}->${v}, new distance: ${dist[v]}`
          });
        }
      }
    }
    
    steps.push({
      array: [...dist],
      comparing: [],
      description: "Bellman-Ford complete! No negative cycles detected."
    });
    
    return steps;
  };

  const generateFloydWarshallSteps = (arr: number[]) => {
    const steps = [];
    const n = Math.min(arr.length, 4); // Limit for visualization
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    
    // Initialize distances
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0;
      if (i < n - 1) {
        dist[i][i + 1] = Math.abs(arr[i] - arr[i + 1]);
        dist[i + 1][i] = Math.abs(arr[i] - arr[i + 1]);
      }
    }
    
    steps.push({
      array: dist.flat(),
      comparing: [],
      description: "Floyd-Warshall: Initial distance matrix"
    });
    
    for (let k = 0; k < n; k++) {
      steps.push({
        array: dist.flat(),
        comparing: [k],
        description: `Using node ${k} as intermediate vertex`
      });
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push({
              array: dist.flat(),
              comparing: [i * n + j],
              description: `Updated dist[${i}][${j}] = ${dist[i][j]} via node ${k}`
            });
          }
        }
      }
    }
    
    steps.push({
      array: dist.flat(),
      comparing: [],
      description: "Floyd-Warshall complete! All-pairs shortest paths found."
    });
    
    return steps;
  };

  const generateKruskalsSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const edges = [];
    const parent = Array.from({ length: n }, (_, i) => i);
    
    // Create edges from array
    for (let i = 0; i < n - 1; i++) {
      edges.push({
        from: i,
        to: i + 1,
        weight: Math.abs(arr[i] - arr[i + 1])
      });
    }
    
    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);
    
    steps.push({
      array: [...arr],
      comparing: [],
      description: "Kruskal's MST: Sorted edges by weight"
    });
    
    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };
    
    const union = (x: number, y: number) => {
      const px = find(x);
      const py = find(y);
      if (px !== py) {
        parent[px] = py;
        return true;
      }
      return false;
    };
    
    let mstWeight = 0;
    let edgesAdded = 0;
    
    for (const edge of edges) {
      if (union(edge.from, edge.to)) {
        mstWeight += edge.weight;
        edgesAdded++;
        steps.push({
          array: [...arr],
          comparing: [edge.from, edge.to],
          description: `Added edge ${edge.from}-${edge.to} (weight: ${edge.weight}), MST weight: ${mstWeight}`
        });
        
        if (edgesAdded === n - 1) break;
      } else {
        steps.push({
          array: [...arr],
          comparing: [edge.from, edge.to],
          description: `Rejected edge ${edge.from}-${edge.to} (would create cycle)`
        });
      }
    }
    
    steps.push({
      array: [...arr],
      comparing: [],
      description: `Kruskal's MST complete! Total weight: ${mstWeight}`
    });
    
    return steps;
  };

  const generatePrimsSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const inMST = new Array(n).fill(false);
    const key = new Array(n).fill(Infinity);
    const startNode = 0;
    
    key[startNode] = 0;
    
    steps.push({
      array: [...key],
      comparing: [startNode],
      description: `Prim's MST: Starting from node ${startNode}`
    });
    
    for (let count = 0; count < n; count++) {
      // Find minimum key vertex not yet in MST
      let u = -1;
      for (let v = 0; v < n; v++) {
        if (!inMST[v] && (u === -1 || key[v] < key[u])) {
          u = v;
        }
      }
      
      inMST[u] = true;
      steps.push({
        array: [...key],
        comparing: [u],
        description: `Added node ${u} to MST (key: ${key[u]})`
      });
      
      // Update key values of adjacent vertices
      for (let v = 0; v < n; v++) {
        if (!inMST[v] && Math.abs(u - v) === 1) { // Simulate adjacency
          const weight = Math.abs(arr[u] - arr[v]);
          if (weight < key[v]) {
            key[v] = weight;
            steps.push({
              array: [...key],
              comparing: [u, v],
              description: `Updated key of node ${v} to ${weight}`
            });
          }
        }
      }
    }
    
    steps.push({
      array: [...key],
      comparing: [],
      description: "Prim's MST complete!"
    });
    
    return steps;
  };

  const generateTopologicalSortSteps = (arr: number[]) => {
    const steps = [];
    const n = arr.length;
    const visited = new Array(n).fill(false);
    const result = [];
    
    steps.push({
      array: [...arr],
      comparing: [],
      description: "Topological Sort: Starting DFS-based approach"
    });
    
    const dfs = (v: number) => {
      visited[v] = true;
      steps.push({
        array: [...arr],
        comparing: [v],
        description: `Visiting node ${v} (value: ${arr[v]})`
      });
      
      // Simulate edges (node i connects to i+1 if arr[i] < arr[i+1])
      for (let u = 0; u < n; u++) {
        if (!visited[u] && Math.abs(v - u) === 1 && arr[v] < arr[u]) {
          dfs(u);
        }
      }
      
      result.unshift(arr[v]);
      steps.push({
        array: [...result],
        comparing: [result.length - 1],
        description: `Added ${arr[v]} to topological order`
      });
    };
    
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        dfs(i);
      }
    }
    
    steps.push({
      array: [...result],
      comparing: [],
      description: "Topological sort complete!"
    });
    
    return steps;
  };

  // Placeholder implementations for tree algorithms
  const generateTreeTraversalSteps = (arr: number[], type: string) => {
    const steps = [];
    steps.push({
      array: [...arr],
      comparing: [],
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} traversal simulation`
    });
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        comparing: [i],
        description: `Visiting node ${arr[i]}`
      });
    }
    return steps;
  };

  const generateBSTSteps = (arr: number[], operation: string) => {
  const steps = [];
  
  // Handle edge cases
  if (!arr || arr.length === 0) {
    steps.push({
      array: [],
      comparing: [],
      description: "BST Insert: Empty array, inserting as root"
    });
    if (operation === 'insert') {
      steps.push({
        array: [99], // Default value for empty BST
        comparing: [0],
        description: "Inserted 99 as root"
      });
    }
    return steps;
  }

  // Use original array (no sorting needed for BST simulation)
  const workingArray = [...arr];
  
  if (operation === 'insert') {
    const newValue = Math.max(...workingArray, 0) + 10; // Avoid issues with empty arrays
    let currentPos = 0; // Start at root (index 0 for simplicity)
    let insertPos = null; // Track where to insert
    const maxSteps = Math.min(arr.length * 2, 50); // Cap steps to prevent memory issues
    let stepCount = 0;

    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `BST Insert: Inserting ${newValue} into BST`
    });

    // Simulate BST traversal to find insertion point
    while (currentPos < workingArray.length && stepCount < maxSteps) {
      steps.push({
        array: [...workingArray],
        comparing: [currentPos],
        description: `Checking node ${workingArray[currentPos]} at index ${currentPos}`
      });
      stepCount++;

      if (newValue === workingArray[currentPos]) {
        // Handle duplicate (insert to right for simplicity)
        insertPos = currentPos + 1;
        steps.push({
          array: [...workingArray],
          comparing: [currentPos],
          description: `Duplicate ${newValue}, will insert to right`
        });
        break;
      } else if (newValue < workingArray[currentPos]) {
        // Should go left
        if (currentPos * 2 + 1 < workingArray.length) {
          currentPos = currentPos * 2 + 1; // Left child
        } else {
          insertPos = currentPos * 2 + 1; // Insert as left child
          break;
        }
      } else {
        // Should go right
        if (currentPos * 2 + 2 < workingArray.length) {
          currentPos = currentPos * 2 + 2; // Right child
        } else {
          insertPos = currentPos * 2 + 2; // Insert as right child
          break;
        }
      }
    }

    // If no position found or max steps reached, insert at end
    if (insertPos === null || insertPos >= workingArray.length) {
      insertPos = workingArray.length;
    }

    // Insert the new value
    workingArray.splice(insertPos, 0, newValue);
    steps.push({
      array: [...workingArray],
      comparing: [insertPos],
      description: `Inserted ${newValue} at index ${insertPos}`
    });
  } else if (operation === 'delete') {
    // Keep original delete logic (since it works fine)
    const workingArray = [...arr].sort((a, b) => a - b);
    const deleteIndex = Math.floor(workingArray.length / 2);
    const deleteValue = workingArray[deleteIndex];
    
    steps.push({
      array: [...workingArray],
      comparing: [deleteIndex],
      description: `BST Delete: Removing ${deleteValue}`
    });
    
    workingArray.splice(deleteIndex, 1);
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Deleted ${deleteValue} from BST`
    });
  }
  
  steps.push({
    array: [...workingArray],
    comparing: [],
    description: `BST ${operation} operation complete!`
  });
  
  return steps;
};

  const generateAVLSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "AVL Rotation: Checking balance factors"
    });
    
    // Simulate left rotation
    if (workingArray.length >= 3) {
      const temp = workingArray[0];
      workingArray[0] = workingArray[1];
      workingArray[1] = workingArray[2];
      workingArray[2] = temp;
      
      steps.push({
        array: [...workingArray],
        comparing: [0, 1, 2],
        description: "Performing left rotation to maintain AVL property"
      });
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "AVL tree balanced!"
    });
    
    return steps;
  };

  const generateRedBlackSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Red-Black Tree: Checking color properties"
    });
    
    // Simulate color fixing
    for (let i = 0; i < workingArray.length; i++) {
      steps.push({
        array: [...workingArray],
        comparing: [i],
        description: `Node ${workingArray[i]}: ${i % 2 === 0 ? 'Black' : 'Red'}`
      });
    }
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Red-Black tree properties maintained!"
    });
    
    return steps;
  };

  // Placeholder implementations for dynamic programming algorithms
  const generateFibonacciSteps = (arr: number[]) => {
    const steps = [];
    const n = Math.min(arr.length, 8);
    const fib = [0, 1];
    
    steps.push({
      array: [0, 1],
      comparing: [],
      description: "Fibonacci sequence: F(0)=0, F(1)=1"
    });
    
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i-1] + fib[i-2];
      steps.push({
        array: [...fib],
        comparing: [i],
        description: `F(${i}) = F(${i-1}) + F(${i-2}) = ${fib[i-1]} + ${fib[i-2]} = ${fib[i]}`
      });
    }
    
    return steps;
  };

  const generateKnapsackSteps = (arr: number[]) => {
    const steps = [];
    const weights = arr.slice(0, Math.min(arr.length, 4));
    const values = weights.map(w => w * 2); // Values are twice the weights
    const capacity = Math.max(...weights) + 10;
    
    const dp = Array(weights.length + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    steps.push({
      array: [...weights],
      comparing: [],
      description: `0/1 Knapsack: weights=[${weights.join(',')}], values=[${values.join(',')}], capacity=${capacity}`
    });
    
    for (let i = 1; i <= weights.length; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i-1] <= w) {
          dp[i][w] = Math.max(
            values[i-1] + dp[i-1][w - weights[i-1]],
            dp[i-1][w]
          );
          
          steps.push({
            array: [dp[i][w]],
            comparing: [i-1],
            description: `Item ${i}: weight=${weights[i-1]}, value=${values[i-1]}, dp[${i}][${w}] = ${dp[i][w]}`
          });
        } else {
          dp[i][w] = dp[i-1][w];
        }
      }
    }
    
    steps.push({
      array: [dp[weights.length][capacity]],
      comparing: [],
      description: `Maximum value: ${dp[weights.length][capacity]}`
    });
    
    return steps;
  };

  const generateLCSSteps = (arr: number[]) => {
    const steps = [];
    const seq1 = arr.slice(0, Math.min(arr.length, 4));
    const seq2 = arr.slice(1, Math.min(arr.length + 1, 5));
    
    const dp = Array(seq1.length + 1).fill(null).map(() => Array(seq2.length + 1).fill(0));
    
    steps.push({
      array: [...seq1],
      comparing: [],
      description: `LCS: seq1=[${seq1.join(',')}], seq2=[${seq2.join(',')}]`
    });
    
    for (let i = 1; i <= seq1.length; i++) {
      for (let j = 1; j <= seq2.length; j++) {
        if (seq1[i-1] === seq2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
          steps.push({
            array: [dp[i][j]],
            comparing: [i-1, j-1],
            description: `Match found: ${seq1[i-1]}, LCS length = ${dp[i][j]}`
          });
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
          steps.push({
            array: [dp[i][j]],
            comparing: [i-1],
            description: `No match: taking max of previous values = ${dp[i][j]}`
          });
        }
      }
    }
    
    steps.push({
      array: [dp[seq1.length][seq2.length]],
      comparing: [],
      description: `Longest Common Subsequence length: ${dp[seq1.length][seq2.length]}`
    });
    
    return steps;
  };

  const generateEditDistanceSteps = (arr: number[]) => {
    const steps = [];
    const str1 = arr.slice(0, Math.min(arr.length, 3)).map(n => n.toString());
    const str2 = arr.slice(1, Math.min(arr.length + 1, 4)).map(n => n.toString());
    
    const dp = Array(str1.length + 1).fill(null).map(() => Array(str2.length + 1).fill(0));
    
    // Initialize base cases
    for (let i = 0; i <= str1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= str2.length; j++) dp[0][j] = j;
    
    steps.push({
      array: [...arr],
      comparing: [],
      description: `Edit Distance: str1=[${str1.join(',')}], str2=[${str2.join(',')}]`
    });
    
    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1];
          steps.push({
            array: [dp[i][j]],
            comparing: [i-1],
            description: `Characters match: ${str1[i-1]}, no operation needed`
          });
        } else {
          dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
          steps.push({
            array: [dp[i][j]],
            comparing: [i-1],
            description: `Characters differ: ${str1[i-1]} vs ${str2[j-1]}, operations = ${dp[i][j]}`
          });
        }
      }
    }
    
    steps.push({
      array: [dp[str1.length][str2.length]],
      comparing: [],
      description: `Minimum edit distance: ${dp[str1.length][str2.length]}`
    });
    
    return steps;
  };

  const generateCoinChangeSteps = (arr: number[]) => {
    const steps = [];
    const coins = arr.slice(0, Math.min(arr.length, 4)).sort((a, b) => a - b);
    const amount = Math.max(...coins) + 5;
    
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    steps.push({
      array: [...coins],
      comparing: [],
      description: `Coin Change: coins=[${coins.join(',')}], target amount=${amount}`
    });
    
    for (let i = 1; i <= amount; i++) {
      for (let j = 0; j < coins.length; j++) {
        if (coins[j] <= i) {
          const prevValue = dp[i];
          dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
          
          if (dp[i] !== prevValue) {
            steps.push({
              array: [dp[i]],
              comparing: [j],
              description: `Amount ${i}: using coin ${coins[j]}, min coins = ${dp[i]}`
            });
          }
        }
      }
    }
    
    const result = dp[amount] === Infinity ? -1 : dp[amount];
    steps.push({
      array: [result],
      comparing: [],
      description: `Minimum coins needed for amount ${amount}: ${result}`
    });
    
    return steps;
  };

  // Animation controls
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep < steps.length) {
            const step = steps[nextStep];
            setArray(step.array);
            setHighlightedIndices(step.comparing || []);
            onStepChange?.(nextStep);
            return nextStep;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed[0]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, speed, steps, onStepChange]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      if (steps[0]) {
        setArray(steps[0].array);
        setHighlightedIndices(steps[0].comparing || []);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (steps[0]) {
      setArray(steps[0].array);
      setHighlightedIndices(steps[0].comparing || []);
    }
  };

  const handleStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = steps[nextStep];
      setArray(step.array);
      setHighlightedIndices(step.comparing || []);
      onStepChange?.(nextStep);
    }
  };

  const getBarColor = (index: number) => {
    const step = steps[currentStep];
    if (!step) return 'bg-blue-500';
    
    if (step.found === index) return 'bg-green-500';
    if (step.comparing?.includes(index)) return 'bg-red-500';
    if (step.pivot === index) return 'bg-purple-500';
    if (step.range && (index < step.range[0] || index > step.range[1])) return 'bg-gray-300';
    
    return 'bg-blue-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={handlePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={handleStep} variant="outline">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Speed: {1100 - speed[0]}ms
            </label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={1000}
              min={100}
              step={100}
              className="w-full"
            />
          </div>

          {/* Array Visualization */}
          <div className="bg-white p-8 rounded-lg border">
            <div className="flex items-end justify-center space-x-2 h-64">
              {array.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-sm font-medium mb-2">{value}</div>
                  <div
                    className={`w-12 transition-all duration-300 ${getBarColor(index)}`}
                    style={{ height: `${Math.max((value / Math.max(...array)) * 200, 20)}px` }}
                  />
                  <div className="text-xs mt-1 text-gray-500">{index}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Description */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-700">
              {steps[currentStep]?.description || "Algorithm ready to start"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmVisualizer;
