import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Mapping of algorithms to their visualization GIFs
const algorithmGifs: Record<string, string> = {
  'bfs': 'https://skilled.dev/images/bfs.gif',
  'dfs': 'https://skilled.dev/images/dfs.gif',
  'dijkstra': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif',
  'bellman-ford': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bellman%E2%80%93Ford_algorithm_example.gif/640px-Bellman%E2%80%93Ford_algorithm_example.gif',
  'floyd-warshall': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Floyd_warshall_gif.gif',
  'kruskals': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/MST_kruskal_en.gif/600px-MST_kruskal_en.gif',
  'prims': 'https://upload.wikimedia.org/wikipedia/en/9/96/Prim-animation.gif',
  'topological-sort': 'https://i.makeagif.com/media/11-14-2018/ApEYz2.gif',
  'inorder': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Inorder-traversal.gif',
  'preorder': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Preorder-traversal.gif',
  'postorder': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Postorder-traversal.gif',
  'level-order': 'https://miro.medium.com/v2/resize:fit:1112/1*aU13AOqRn831jJL38JWIzg.gif',
  'bst-insert': 'https://www.gormanalysis.com/blog/making-a-binary-search-tree-in-cpp_files/InsertNaive.gif',
  'bst-delete': 'https://cdn.devdojo.com/images/july2021/leafnodedeleted.gif',
  'avl-rotation': 'https://wkdtjsgur100.github.io/images/posts/rotation.gif',
  'red-black-fix': 'https://miro.medium.com/v2/resize:fit:1400/1*9KNOwToK6dtFkf5w69eaQA.gif',
  'fibonacci': 'https://miro.medium.com/v2/resize:fit:1046/1*9J2Wf2sapv9XeYtjQzPwVA.gif',
  'knapsack': 'https://astikanand.github.io/techblogs/dynamic-programming-patterns/assets/knapsack_tabulation.gif',
  'lcs': 'https://gabrielghe.github.io/assets/themes/images/2016-01-04-longest-common-subsequence3.gif',
  'edit-distance': 'https://www.ideserve.co.in/learn/img/editDistance_0.gif',
};

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

  const isBarGraphAlgorithm = !Object.keys(algorithmGifs).includes(algorithm);

  useEffect(() => {
    if (isBarGraphAlgorithm) {
      const generatedSteps = generateAlgorithmSteps(algorithm, data);
      setSteps(generatedSteps);
      setCurrentStep(0);
      setArray(data);
      setHighlightedIndices([]);
    }
  }, [algorithm, data, isBarGraphAlgorithm]);

  const generateAlgorithmSteps = (algo: string, inputData: number[]) => {
    switch (algo) {
      case 'array-insert':
        return generateArrayInsertSteps(inputData);
      case 'array-delete':
        return generateArrayDeleteSteps(inputData);
      case 'array-search':
        return generateArraySearchSteps(inputData);
      case 'linked-list-insert':
        return generateLinkedListSteps(inputData, 'insert');
      case 'linked-list-delete':
        return generateLinkedListSteps(inputData, 'delete');
      case 'linked-list-traverse':
        return generateLinkedListSteps(inputData, 'traverse');
      case 'stack-push':
        return generateStackSteps(inputData, 'push');
      case 'stack-pop':
        return generateStackSteps(inputData, 'pop');
      case 'queue-enqueue':
        return generateQueueSteps(inputData, 'enqueue');
      case 'queue-dequeue':
        return generateQueueSteps(inputData, 'dequeue');
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
      case 'linear-search':
        return generateLinearSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
      case 'binary-search':
        return generateBinarySearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
      case 'jump-search':
        return generateJumpSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
      case 'exponential-search':
        return generateExponentialSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
      case 'interpolation-search':
        return generateInterpolationSearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
      case 'ternary-search':
        return generateTernarySearchSteps(inputData, inputData[Math.floor(inputData.length / 2)] || 0);
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
    const target = arr[3] || arr[0] || 0;
    
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

  // Linked List operations
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

  // Counting Sort
  const generateCountingSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const max = Math.max(...workingArray, 0);
    const count = new Array(max + 1).fill(0);
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: `Starting counting sort. Max value: ${max}`
    });
    
    for (let i = 0; i < workingArray.length; i++) {
      count[workingArray[i]]++;
      steps.push({
        array: [...workingArray],
        comparing: [i],
        description: `Counting occurrences of ${workingArray[i]}`
      });
    }
    
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

  // Radix Sort
  const generateRadixSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const max = Math.max(...workingArray, 0);
    
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
      
      for (let i = 0; i < workingArray.length; i++) {
        count[Math.floor(workingArray[i] / exp) % 10]++;
      }
      
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
      
      for (let i = workingArray.length - 1; i >= 0; i--) {
        const digit = Math.floor(workingArray[i] / exp) % 10;
        output[count[digit] - 1] = workingArray[i];
        count[digit]--;
      }
      
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

  // Bubble Sort
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

  // Insertion Sort
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

  // Selection Sort
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

  // Heap Sort
  const generateHeapSortSteps = (arr: number[]) => {
    const steps = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      description: "Building max heap..."
    });
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(workingArray, n, i, steps);
    }
    
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

  // Merge Sort
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

  // Quick Sort
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

  // Binary Search
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

  // Linear Search
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

  // Jump Search
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

  // Exponential Search
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

  // Interpolation Search
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

  // Ternary Search
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

  //coin change
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

  // Animation controls for bar graph algorithms
  useEffect(() => {
    if (!isBarGraphAlgorithm) return;

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
  }, [isPlaying, currentStep, speed, steps, onStepChange, isBarGraphAlgorithm]);

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
          {/* Controls for bar graph algorithms */}
          {isBarGraphAlgorithm && (
            <>
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
            </>
          )}

          {/* Visualization Area */}
          <div className="bg-white p-8 rounded-lg border">
            {isBarGraphAlgorithm ? (
              <div className="flex items-end justify-center space-x-2 h-64">
                {array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">{value}</div>
                    <div
                      className={`w-12 transition-all duration-300 ${getBarColor(index)}`}
                      style={{ height: `${Math.max((value / Math.max(...array, 1)) * 200, 20)}px` }}
                    />
                    <div className="text-xs mt-1 text-gray-500">{index}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <img
                  src={algorithmGifs[algorithm]}
                  alt={`${algorithm} visualization`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Step Description for bar graph algorithms */}
          {isBarGraphAlgorithm && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {steps[currentStep]?.description || "Algorithm ready to start"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmVisualizer;