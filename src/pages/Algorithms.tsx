import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Play, BookOpen, Youtube, Info, TreePine, Network, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LearnMoreDialog } from '@/components/LearnMoreDialog';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: string;
  category: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  applications: string[];
  explanation: string;
}

const Algorithms: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const algorithms: Algorithm[] = [
    // Sorting Algorithms
    {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      description: 'Simple comparison-based sorting algorithm',
      complexity: 'Time: O(n²), Space: O(1)',
      category: 'sorting',
      difficulty: 'Easy',
      applications: ['Educational purposes', 'Small datasets', 'When simplicity is preferred'],
      explanation: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name from the way smaller elements "bubble" to the top of the list.',
      code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = bubble_sort(numbers.copy())
print("Sorted:", sorted_nums)`
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      description: 'Divide and conquer sorting algorithm',
      complexity: 'Time: O(n log n), Space: O(n)',
      category: 'sorting',
      difficulty: 'Medium',
      applications: ['Large datasets', 'External sorting', 'Stable sorting required'],
      explanation: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge function is used for merging two halves.',
      code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = merge_sort(numbers)
print("Sorted:", sorted_nums)`
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      description: 'Efficient divide and conquer sorting',
      complexity: 'Time: O(n log n) avg, Space: O(log n)',
      category: 'sorting',
      difficulty: 'Medium',
      applications: ['General purpose sorting', 'In-place sorting', 'Cache-efficient sorting'],
      explanation: 'Quick Sort is a divide-and-conquer algorithm. It works by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
      code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = quick_sort(numbers)
print("Sorted:", sorted_nums)`
    },
    {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      description: 'Builds sorted array one element at a time',
      complexity: 'Time: O(n²), Space: O(1)',
      category: 'sorting',
      difficulty: 'Easy',
      applications: ['Small datasets', 'Nearly sorted arrays', 'As subroutine in hybrid algorithms'],
      explanation: 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
      code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = insertion_sort(numbers.copy())
print("Sorted:", sorted_nums)`
    },
    {
      id: 'selection-sort',
      name: 'Selection Sort',
      description: 'Finds minimum and places at beginning',
      complexity: 'Time: O(n²), Space: O(1)',
      category: 'sorting',
      difficulty: 'Easy',
      applications: ['Small datasets', 'Memory-constrained environments', 'Educational purposes'],
      explanation: 'Selection Sort works by repeatedly finding the minimum element from the unsorted portion and putting it at the beginning. The algorithm maintains two subarrays in a given array.',
      code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = selection_sort(numbers.copy())
print("Sorted:", sorted_nums)`
    },
    {
      id: 'heap-sort',
      name: 'Heap Sort',
      description: 'Uses binary heap data structure',
      complexity: 'Time: O(n log n), Space: O(1)',
      category: 'sorting',
      difficulty: 'Hard',
      applications: ['When consistent O(n log n) is needed', 'Priority queue implementation', 'Memory-constrained sorting'],
      explanation: 'Heap Sort is a comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the minimum element and place the minimum element at the beginning.',
      code: `def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = heap_sort(numbers.copy())
print("Sorted:", sorted_nums)`
    },
    {
      id: 'radix-sort',
      name: 'Radix Sort',
      description: 'Non-comparison integer sorting',
      complexity: 'Time: O(d(n+k)), Space: O(n+k)',
      category: 'sorting',
      difficulty: 'Medium',
      applications: ['Integer sorting', 'Fixed-length string sorting', 'When comparison is expensive'],
      explanation: 'Radix Sort is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix.',
      code: `def counting_sort_for_radix(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
    
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    
    for i in range(n):
        arr[i] = output[i]

def radix_sort(arr):
    max_num = max(arr)
    exp = 1
    while max_num // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = radix_sort(numbers.copy())
print("Sorted:", sorted_nums)`
    },
    {
      id: 'counting-sort',
      name: 'Counting Sort',
      description: 'Integer sorting by counting occurrences',
      complexity: 'Time: O(n+k), Space: O(k)',
      category: 'sorting',
      difficulty: 'Medium',
      applications: ['Small range of integers', 'Stable sorting needed', 'As subroutine in radix sort'],
      explanation: 'Counting Sort is a sorting technique based on keys between a specific range. It works by counting the number of objects having distinct key values.',
      code: `def counting_sort(arr):
    if not arr:
        return arr
    
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    count = [0] * range_val
    output = [0] * len(arr)
    
    for num in arr:
        count[num - min_val] += 1
    
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i] - min_val] - 1] = arr[i]
        count[arr[i] - min_val] -= 1
    
    return output

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original:", numbers)
sorted_nums = counting_sort(numbers)
print("Sorted:", sorted_nums)`
    },
    // Searching Algorithms
    {
      id: 'linear-search',
      name: 'Linear Search',
      description: 'Sequential search through elements',
      complexity: 'Time: O(n), Space: O(1)',
      category: 'searching',
      difficulty: 'Easy',
      applications: ['Unsorted arrays', 'Small datasets', 'One-time searches'],
      explanation: 'Linear Search is a sequential searching algorithm where we start from one end and check every element of the list until the desired element is found.',
      code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example usage
numbers = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = linear_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      description: 'Efficient search in sorted arrays',
      complexity: 'Time: O(log n), Space: O(1)',
      category: 'searching',
      difficulty: 'Medium',
      applications: ['Sorted arrays', 'Database indexing', 'Finding insertion points'],
      explanation: 'Binary Search is a searching algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array.',
      code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
numbers = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = binary_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    {
      id: 'jump-search',
      name: 'Jump Search',
      description: 'Jumps by fixed steps then linear search',
      complexity: 'Time: O(√n), Space: O(1)',
      category: 'searching',
      difficulty: 'Medium',
      applications: ['Sorted arrays', 'When binary search overhead is concern', 'Block-based searching'],
      explanation: 'Jump Search is a searching algorithm for sorted arrays. The basic idea is to check fewer elements by jumping ahead by fixed steps or skipping some elements in place of searching all elements.',
      code: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    
    if arr[prev] == target:
        return prev
    
    return -1

# Example usage
numbers = [2, 3, 4, 12, 22, 11, 90]
target = 10
result = jump_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    {
      id: 'exponential-search',
      name: 'Exponential Search',
      description: 'Finds range then binary search',
      complexity: 'Time: O(log n), Space: O(1)',
      category: 'searching',
      difficulty: 'Medium',
      applications: ['Unbounded/infinite arrays', 'When size is unknown', 'Large sorted arrays'],
      explanation: 'Exponential Search involves two steps: Find range where element is present and Do Binary Search in above found range. This algorithm is particularly useful for unbounded searches.',
      code: `def exponential_search(arr, target):
    if arr[0] == target:
        return 0
    
    n = len(arr)
    i = 1
    while i < n and arr[i] <= target:
        i *= 2
    
    return binary_search_range(arr, target, i // 2, min(i, n - 1))

def binary_search_range(arr, target, left, right):
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Example usage
numbers = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = exponential_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    {
      id: 'interpolation-search',
      name: 'Interpolation Search',
      description: 'Estimates position in uniformly distributed data',
      complexity: 'Time: O(log log n), Space: O(1)',
      category: 'searching',
      difficulty: 'Hard',
      applications: ['Uniformly distributed data', 'Telephone directories', 'Dictionary lookups'],
      explanation: 'Interpolation Search is an improvement over Binary Search for instances where the values in a sorted array are uniformly distributed. It tries to estimate the position of the target value.',
      code: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target:
                return low
            return -1
        
        pos = low + ((target - arr[low]) // (arr[high] - arr[low])) * (high - low)
        
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    
    return -1

# Example usage
numbers = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = interpolation_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    {
      id: 'ternary-search',
      name: 'Ternary Search',
      description: 'Divides array into three parts',
      complexity: 'Time: O(log n), Space: O(1)',
      category: 'searching',
      difficulty: 'Medium',
      applications: ['Unimodal functions', 'Finding maximum/minimum', 'Optimization problems'],
      explanation: 'Ternary Search is a decrease and conquer algorithm that can be used to find an element in an array. It is similar to binary search where we divide the array into two parts but in this algorithm, we divide the given array into three parts.',
      code: `def ternary_search(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid1 = left + (right - left) // 3
    mid2 = right - (right - left) // 3
    
    if arr[mid1] == target:
        return mid1
    if arr[mid2] == target:
        return mid2
    
    if target < arr[mid1]:
        return ternary_search(arr, target, left, mid1 - 1)
    elif target > arr[mid2]:
        return ternary_search(arr, target, mid2 + 1, right)
    else:
        return ternary_search(arr, target, mid1 + 1, mid2 - 1)

# Example usage
numbers = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = ternary_search(numbers, target)
if result != -1:
    print(f"Element found at index {result}")
else:
    print("Element not found")`
    },
    // Graph Algorithms
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      description: 'Level-order graph traversal',
      complexity: 'Time: O(V + E), Space: O(V)',
      category: 'graph',
      difficulty: 'Medium',
      applications: ['Shortest path in unweighted graphs', 'Level-order traversal', 'Social networking'],
      explanation: 'BFS is a traversing algorithm where you should start traversing from a selected node and traverse the graph layerwise thus exploring the neighbour nodes.',
      code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    while queue:
        vertex = queue.popleft()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            for neighbor in graph[vertex]:
                if neighbor not in visited:
                    queue.append(neighbor)
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

result = bfs(graph, 'A')
print("BFS traversal:", result)`
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      description: 'Deep graph traversal using stack',
      complexity: 'Time: O(V + E), Space: O(V)',
      category: 'graph',
      difficulty: 'Medium',
      applications: ['Topological sorting', 'Cycle detection', 'Path finding'],
      explanation: 'DFS is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.',
      code: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    result = []
    visited.add(start)
    result.append(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

result = dfs(graph, 'A')
print("DFS traversal:", result)`
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      description: 'Shortest path in weighted graph',
      complexity: 'Time: O((V + E) log V), Space: O(V)',
      category: 'graph',
      difficulty: 'Hard',
      applications: ['GPS navigation', 'Network routing', 'Social networks'],
      explanation: "Dijkstra's algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted graph.",
      code: `import heapq

def dijkstra(graph, start):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    priority_queue = [(0, start)]
    
    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)
        
        if current_distance > distances[current_vertex]:
            continue
        
        for neighbor, weight in graph[current_vertex]:
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
    
    return distances

# Example usage
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('C', 1), ('D', 5)],
    'C': [('D', 8), ('E', 10)],
    'D': [('E', 2)],
    'E': []
}

result = dijkstra(graph, 'A')
print("Shortest paths:", result)`
    },
    {
      id: 'bellman-ford',
      name: 'Bellman-Ford',
      description: 'Shortest path with negative weights',
      complexity: 'Time: O(VE), Space: O(V)',
      category: 'graph',
      difficulty: 'Hard',
      applications: ['Graphs with negative weights', 'Currency arbitrage', 'Network routing'],
      explanation: 'The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph.',
      code: `def bellman_ford(vertices, edges, start):
    distance = {v: float('infinity') for v in vertices}
    distance[start] = 0
    
    # Relax edges V-1 times
    for _ in range(len(vertices) - 1):
        for u, v, weight in edges:
            if distance[u] != float('infinity') and distance[u] + weight < distance[v]:
                distance[v] = distance[u] + weight
    
    # Check for negative cycles
    for u, v, weight in edges:
        if distance[u] != float('infinity') and distance[u] + weight < distance[v]:
            return None, "Negative cycle detected"
    
    return distance, None

# Example usage
vertices = ['A', 'B', 'C', 'D', 'E']
edges = [
    ('A', 'B', 4), ('A', 'C', 2),
    ('B', 'C', 1), ('B', 'D', 5),
    ('C', 'D', 8), ('C', 'E', 10),
    ('D', 'E', 2)
]

result, error = bellman_ford(vertices, edges, 'A')
if error:
    print(error)
else:
    print("Shortest paths:", result)`
    },
    {
      id: 'floyd-warshall',
      name: 'Floyd-Warshall',
      description: 'All-pairs shortest path',
      complexity: 'Time: O(V³), Space: O(V²)',
      category: 'graph',
      difficulty: 'Hard',
      applications: ['All-pairs shortest paths', 'Transitive closure', 'Graph analysis'],
      explanation: 'The Floyd-Warshall algorithm is a graph analysis algorithm for finding shortest paths in a weighted graph with positive or negative edge weights.',
      code: `def floyd_warshall(vertices, edges):
    # Initialize distance matrix
    dist = {}
    for i in vertices:
        dist[i] = {}
        for j in vertices:
            if i == j:
                dist[i][j] = 0
            else:
                dist[i][j] = float('infinity')
    
    # Set edge weights
    for u, v, weight in edges:
        dist[u][v] = weight
    
    # Main algorithm
    for k in vertices:
        for i in vertices:
            for j in vertices:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist

# Example usage
vertices = ['A', 'B', 'C', 'D']
edges = [
    ('A', 'B', 3), ('A', 'C', 8), ('A', 'D', 7),
    ('B', 'A', 3), ('B', 'C', 2),
    ('C', 'A', 8), ('C', 'B', 2), ('C', 'D', 1),
    ('D', 'A', 7), ('D', 'C', 1)
]

result = floyd_warshall(vertices, edges)
print("All-pairs shortest paths:", result)`
    },
    {
      id: 'kruskals',
      name: "Kruskal's MST",
      description: 'Minimum spanning tree using edges',
      complexity: 'Time: O(E log E), Space: O(V)',
      category: 'graph',
      difficulty: 'Hard',
      applications: ['Network design', 'Clustering', 'Approximation algorithms'],
      explanation: "Kruskal's algorithm is a minimum-spanning-tree algorithm which finds an edge of the least possible weight that connects any two trees in the forest.",
      code: `class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskals_mst(vertices, edges):
    uf = UnionFind(vertices)
    edges.sort(key=lambda x: x[2])  # Sort by weight
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
    
    return mst, total_weight

# Example usage
vertices = ['A', 'B', 'C', 'D', 'E']
edges = [
    ('A', 'B', 2), ('A', 'C', 3), ('B', 'C', 1),
    ('B', 'D', 1), ('C', 'D', 1), ('D', 'E', 2)
]

mst, weight = kruskals_mst(vertices, edges)
print("MST edges:", mst)
print("Total weight:", weight)`
    },
    {
      id: 'prims',
      name: "Prim's MST",
      description: 'Minimum spanning tree using vertices',
      complexity: 'Time: O(V² or E log V), Space: O(V)',
      category: 'graph',
      difficulty: 'Hard',
      applications: ['Network design', 'Cluster analysis', 'Handwriting recognition'],
      explanation: "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.",
      code: `import heapq

def prims_mst(graph, start):
    mst = []
    visited = set([start])
    edges = [(weight, start, neighbor) for neighbor, weight in graph[start]]
    heapq.heapify(edges)
    total_weight = 0
    
    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        
        if v not in visited:
            visited.add(v)
            mst.append((u, v, weight))
            total_weight += weight
            
            for neighbor, edge_weight in graph[v]:
                if neighbor not in visited:
                    heapq.heappush(edges, (edge_weight, v, neighbor))
    
    return mst, total_weight

# Example usage
graph = {
    'A': [('B', 2), ('C', 3)],
    'B': [('A', 2), ('C', 1), ('D', 1)],
    'C': [('A', 3), ('B', 1), ('D', 1)],
    'D': [('B', 1), ('C', 1), ('E', 2)],
    'E': []
}

mst, weight = prims_mst(graph, 'A')
print("MST edges:", mst)
print("Total weight:", weight)`
    },
    {
      id: 'topological-sort',
      name: 'Topological Sort',
      description: 'Linear ordering of directed acyclic graph',
      complexity: 'Time: O(V + E), Space: O(V)',
      category: 'graph',
      difficulty: 'Medium',
      applications: ['Task scheduling', 'Build systems', 'Course prerequisites'],
      explanation: 'A topological sort of a directed graph is a linear ordering of its vertices such that for every directed edge uv from vertex u to vertex v, u comes before v in the ordering.',
      code: `from collections import defaultdict, deque

def topological_sort(vertices, edges):
    graph = defaultdict(list)
    in_degree = {v: 0 for v in vertices}
    
    # Build graph and calculate in-degrees
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Find vertices with no incoming edges
    queue = deque([v for v in vertices if in_degree[v] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    if len(result) != len(vertices):
        return None  # Cycle detected
    
    return result

# Example usage
vertices = ['A', 'B', 'C', 'D', 'E']
edges = [
    ('A', 'C'), ('B', 'C'), ('B', 'D'),
    ('C', 'E'), ('D', 'E')
]

result = topological_sort(vertices, edges)
if result:
    print("Topological order:", result)
else:
    print("Cycle detected - no topological ordering possible")`
    },
    // Tree Algorithms
    {
      id: 'inorder',
      name: 'In-order Traversal',
      description: 'Left-Root-Right traversal',
      complexity: 'Time: O(n), Space: O(h)',
      category: 'tree',
      difficulty: 'Easy',
      applications: ['Binary search trees', 'Expression tree evaluation', 'Sorting'],
      explanation: 'In-order traversal is a tree traversal method where the left subtree is visited first, then the root node, and finally the right subtree.',
      code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if node:
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
    
    inorder(root)
    return result

# Iterative version
def inorder_iterative(root):
    result = []
    stack = []
    current = root
    
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Inorder:", inorder_traversal(root))`
    },
    {
      id: 'preorder',
      name: 'Pre-order Traversal',
      description: 'Root-Left-Right traversal',
      complexity: 'Time: O(n), Space: O(h)',
      category: 'tree',
      difficulty: 'Easy',
      applications: ['Tree copying', 'Prefix expression', 'Tree serialization'],
      explanation: 'Pre-order traversal is a tree traversal method where the root node is visited first, then the left subtree, and finally the right subtree.',
      code: `def preorder_traversal(root):
    result = []
    
    def preorder(node):
        if node:
            result.append(node.val)
            preorder(node.left)
            preorder(node.right)
    
    preorder(root)
    return result

# Iterative version
def preorder_iterative(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Preorder:", preorder_traversal(root))`
    },
    {
      id: 'postorder',
      name: 'Post-order Traversal',
      description: 'Left-Right-Root traversal',
      complexity: 'Time: O(n), Space: O(h)',
      category: 'tree',
      difficulty: 'Easy',
      applications: ['Tree deletion', 'Postfix expression', 'Directory size calculation'],
      explanation: 'Post-order traversal is a tree traversal method where the left subtree is visited first, then the right subtree, and finally the root node.',
      code: `def postorder_traversal(root):
    result = []
    
    def postorder(node):
        if node:
            postorder(node.left)
            postorder(node.right)
            result.append(node.val)
    
    postorder(root)
    return result

# Iterative version
def postorder_iterative(root):
    if not root:
        return []
    
    result = []
    stack = []
    last_visited = None
    current = root
    
    while stack or current:
        if current:
            stack.append(current)
            current = current.left
        else:
            peek_node = stack[-1]
            if peek_node.right and last_visited != peek_node.right:
                current = peek_node.right
            else:
                result.append(peek_node.val)
                last_visited = stack.pop()
    
    return result

# Example usage
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

print("Postorder:", postorder_traversal(root))`
    },
    {
      id: 'level-order',
      name: 'Level-order Traversal',
      description: 'Breadth-first tree traversal',
      complexity: 'Time: O(n), Space: O(w)',
      category: 'tree',
      difficulty: 'Medium',
      applications: ['Level-wise processing', 'Tree width calculation', 'Print tree levels'],
      explanation: 'Level-order traversal is a tree traversal method where nodes are visited level by level from left to right.',
      code: `from collections import deque

def level_order_traversal(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result

# Example usage
root = TreeNode(3)
root.left = TreeNode(9)
root.right = TreeNode(20)
root.right.left = TreeNode(15)
root.right.right = TreeNode(7)

print("Level order:", level_order_traversal(root))`
    },
    {
      id: 'bst-insert',
      name: 'BST Insertion',
      description: 'Insert node in binary search tree',
      complexity: 'Time: O(log n), Space: O(log n)',
      category: 'tree',
      difficulty: 'Medium',
      applications: ['Database indexing', 'Symbol tables', 'Expression parsing'],
      explanation: 'BST insertion involves finding the correct position for a new node while maintaining the binary search tree property.',
      code: `def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    
    if val < root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)
    
    return root

# Iterative version
def insert_bst_iterative(root, val):
    if not root:
        return TreeNode(val)
    
    current = root
    while True:
        if val < current.val:
            if not current.left:
                current.left = TreeNode(val)
                break
            current = current.left
        else:
            if not current.right:
                current.right = TreeNode(val)
                break
            current = current.right
    
    return root

# Example usage
root = TreeNode(50)
root = insert_bst(root, 30)
root = insert_bst(root, 70)
root = insert_bst(root, 20)
root = insert_bst(root, 40)

print("BST created with insertion")`
    },
    {
      id: 'bst-delete',
      name: 'BST Deletion',
      description: 'Delete node from binary search tree',
      complexity: 'Time: O(log n), Space: O(log n)',
      category: 'tree',
      difficulty: 'Hard',
      applications: ['Database operations', 'Dynamic sets', 'Priority queues'],
      explanation: 'BST deletion involves removing a node while maintaining the binary search tree property, with three cases to handle.',
      code: `def delete_bst(root, val):
    if not root:
        return root
    
    if val < root.val:
        root.left = delete_bst(root.left, val)
    elif val > root.val:
        root.right = delete_bst(root.right, val)
    else:
        # Node to be deleted found
        if not root.left:
            return root.right
        elif not root.right:
            return root.left
        
        # Node with two children
        min_larger_node = find_min(root.right)
        root.val = min_larger_node.val
        root.right = delete_bst(root.right, min_larger_node.val)
    
    return root

def find_min(node):
    while node.left:
        node = node.left
    return node

# Example usage
root = TreeNode(50)
root.left = TreeNode(30)
root.right = TreeNode(70)
root.left.left = TreeNode(20)
root.left.right = TreeNode(40)

root = delete_bst(root, 30)
print("Node deleted from BST")`
    },
    {
      id: 'avl-rotation',
      name: 'AVL Rotation',
      description: 'Balance AVL tree using rotations',
      complexity: 'Time: O(1), Space: O(1)',
      category: 'tree',
      difficulty: 'Hard',
      applications: ['Self-balancing trees', 'Database indexing', 'File systems'],
      explanation: 'AVL rotations are used to maintain the balance property of AVL trees after insertions and deletions.',
      code: `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def get_height(node):
    if not node:
        return 0
    return node.height

def get_balance(node):
    if not node:
        return 0
    return get_height(node.left) - get_height(node.right)

def rotate_right(y):
    x = y.left
    T2 = x.right
    
    # Perform rotation
    x.right = y
    y.left = T2
    
    # Update heights
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    
    return x

def rotate_left(x):
    y = x.right
    T2 = y.left
    
    # Perform rotation
    y.left = x
    x.right = T2
    
    # Update heights
    x.height = 1 + max(get_height(x.left), get_height(x.right))
    y.height = 1 + max(get_height(y.left), get_height(y.right))
    
    return y

def insert_avl(root, val):
    # Step 1: Perform normal BST insertion
    if not root:
        return AVLNode(val)
    
    if val < root.val:
        root.left = insert_avl(root.left, val)
    else:
        root.right = insert_avl(root.right, val)
    
    # Step 2: Update height
    root.height = 1 + max(get_height(root.left), get_height(root.right))
    
    # Step 3: Get balance factor
    balance = get_balance(root)
    
    # Step 4: Perform rotations if needed
    # Left-Left case
    if balance > 1 and val < root.left.val:
        return rotate_right(root)
    
    # Right-Right case
    if balance < -1 and val > root.right.val:
        return rotate_left(root)
    
    # Left-Right case
    if balance > 1 and val > root.left.val:
        root.left = rotate_left(root.left)
        return rotate_right(root)
    
    # Right-Left case
    if balance < -1 and val < root.right.val:
        root.right = rotate_right(root.right)
        return rotate_left(root)
    
    return root

# Example usage
root = None
vals = [10, 20, 30, 40, 50, 25]
for val in vals:
    root = insert_avl(root, val)

print("AVL tree created with rotations")`
    },
    {
      id: 'red-black-fix',
      name: 'Red-Black Fix',
      description: 'Fix red-black tree violations',
      complexity: 'Time: O(log n), Space: O(1)',
      category: 'tree',
      difficulty: 'Hard',
      applications: ['C++ STL map/set', 'Java TreeMap', 'Linux kernel'],
      explanation: 'Red-black tree fixing maintains the red-black properties after insertions and deletions through recoloring and rotations.',
      code: `class RBNode:
    def __init__(self, val, color="RED"):
        self.val = val
        self.color = color
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.NIL = RBNode(0, "BLACK")
        self.root = self.NIL
    
    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        
        if y.left != self.NIL:
            y.left.parent = x
        
        y.parent = x.parent
        
        if x.parent == None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        
        y.left = x
        x.parent = y
    
    def right_rotate(self, x):
        y = x.left
        x.left = y.right
        
        if y.right != self.NIL:
            y.right.parent = x
        
        y.parent = x.parent
        
        if x.parent == None:
            self.root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        
        y.right = x
        x.parent = y
    
    def fix_insert(self, k):
        while k.parent.color == "RED":
            if k.parent == k.parent.parent.right:
                u = k.parent.parent.left  # uncle
                if u.color == "RED":
                    u.color = "BLACK"
                    k.parent.color = "BLACK"
                    k.parent.parent.color = "RED"
                    k = k.parent.parent
                else:
                    if k == k.parent.left:
                        k = k.parent
                        self.right_rotate(k)
                    k.parent.color = "BLACK"
                    k.parent.parent.color = "RED"
                    self.left_rotate(k.parent.parent)
            else:
                u = k.parent.parent.right  # uncle
                if u.color == "RED":
                    u.color = "BLACK"
                    k.parent.color = "BLACK"
                    k.parent.parent.color = "RED"
                    k = k.parent.parent
                else:
                    if k == k.parent.right:
                        k = k.parent
                        self.left_rotate(k)
                    k.parent.color = "BLACK"
                    k.parent.parent.color = "RED"
                    self.right_rotate(k.parent.parent)
            
            if k == self.root:
                break
        
        self.root.color = "BLACK"

# Example usage
rb_tree = RedBlackTree()
print("Red-Black tree operations implemented")`
    },
    // Dynamic Programming
    {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      description: 'Dynamic programming fibonacci',
      complexity: 'Time: O(n), Space: O(n)',
      category: 'dynamic-programming',
      difficulty: 'Medium',
      applications: ['Mathematical sequences', 'Algorithm optimization', 'Teaching DP concepts'],
      explanation: 'The Fibonacci sequence using dynamic programming demonstrates how to optimize recursive solutions by storing previously computed results.',
      code: `def fibonacci_dp(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

# Space optimized version
def fibonacci_optimized(n):
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    for i in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr

# Example usage
n = 10
print(f"Fibonacci({n}) = {fibonacci_dp(n)}")
print(f"Fibonacci({n}) optimized = {fibonacci_optimized(n)}")`
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack',
      description: 'Maximum value with weight constraint',
      complexity: 'Time: O(nW), Space: O(nW)',
      category: 'dynamic-programming',
      difficulty: 'Hard',
      applications: ['Resource allocation', 'Budget optimization', 'Portfolio selection'],
      explanation: 'The 0/1 Knapsack problem is a classic dynamic programming problem where you select items to maximize value while staying within weight limits.',
      code: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]

# Space optimized version
def knapsack_optimized(weights, values, capacity):
    dp = [0] * (capacity + 1)
    
    for i in range(len(weights)):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]

# Example usage
weights = [1, 3, 4, 5]
values = [1, 4, 5, 7]
capacity = 7

result = knapsack_01(weights, values, capacity)
print(f"Maximum value: {result}")`
    },
    {
      id: 'lcs',
      name: 'Longest Common Subsequence',
      description: 'Find longest common subsequence',
      complexity: 'Time: O(mn), Space: O(mn)',
      category: 'dynamic-programming',
      difficulty: 'Medium',
      applications: ['DNA sequencing', 'Version control', 'Text comparison'],
      explanation: 'LCS finds the longest subsequence common to two sequences, useful in bioinformatics and text processing.',
      code: `def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

def lcs_string(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Reconstruct LCS
    lcs_str = ""
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i-1] == text2[j-1]:
            lcs_str = text1[i-1] + lcs_str
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return lcs_str

# Example usage
text1 = "ABCDGH"
text2 = "AEDFHR"
print(f"LCS length: {lcs(text1, text2)}")
print(f"LCS string: {lcs_string(text1, text2)}")`
    },
    {
      id: 'edit-distance',
      name: 'Edit Distance',
      description: 'Minimum operations to transform string',
      complexity: 'Time: O(mn), Space: O(mn)',
      category: 'dynamic-programming',
      difficulty: 'Hard',
      applications: ['Spell checkers', 'DNA analysis', 'Plagiarism detection'],
      explanation: 'Edit Distance (Levenshtein distance) calculates the minimum number of operations required to transform one string into another.',
      code: `def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Initialize base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # deletion
                    dp[i][j-1],    # insertion
                    dp[i-1][j-1]   # substitution
                )
    
    return dp[m][n]

# Space optimized version
def edit_distance_optimized(word1, word2):
    m, n = len(word1), len(word2)
    if m < n:
        word1, word2, m, n = word2, word1, n, m
    
    dp = list(range(n + 1))
    
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if word1[i-1] == word2[j-1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(dp[j], dp[j-1], prev)
            prev = temp
    
    return dp[n]

# Example usage
word1 = "horse"
word2 = "ros"
print(f"Edit distance: {edit_distance(word1, word2)}")`
    },
    {
      id: 'coin-change',
      name: 'Coin Change',
      description: 'Minimum coins for target amount',
      complexity: 'Time: O(amount × coins), Space: O(amount)',
      category: 'dynamic-programming',
      difficulty: 'Medium',
      applications: ['Currency systems', 'Change making', 'Optimization problems'],
      explanation: 'Coin Change problem finds the minimum number of coins needed to make a specific amount, demonstrating optimal substructure.',
      code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

def coin_change_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]

# Example usage
coins = [1, 3, 4]
amount = 6
print(f"Minimum coins needed: {coin_change(coins, amount)}")
print(f"Number of ways: {coin_change_ways(coins, amount)}")`
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = {
    sorting: algorithms.filter(algo => algo.category === 'sorting'),
    searching: algorithms.filter(algo => algo.category === 'searching'),
    graph: algorithms.filter(algo => algo.category === 'graph'),
    tree: algorithms.filter(algo => algo.category === 'tree'),
    'dynamic-programming': algorithms.filter(algo => algo.category === 'dynamic-programming')
  };

  const handleLearnMore = (algorithm: Algorithm) => {
    const complexityParts = algorithm.complexity.split(', ');
    const timeComplexity = complexityParts[0]?.replace('Time: ', '') || 'O(n)';
    const spaceComplexity = complexityParts[1]?.replace('Space: ', '') || 'O(1)';
    
    const dialogItem = {
      name: algorithm.name,
      description: algorithm.description,
      complexity: {
        time: timeComplexity,
        space: spaceComplexity
      },
      applications: algorithm.applications,
      difficulty: algorithm.difficulty,
      explanation: algorithm.explanation,
      pythonCode: algorithm.code
    };
    
    setSelectedAlgorithm(algorithm);
    setIsLearnMoreOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Fixed Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Algorithms</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`,
            height: '120%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70" />
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Algorithms
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Master algorithmic problem-solving with comprehensive implementations and detailed explanations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Algorithm List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="sorting" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sorting">Sorting</TabsTrigger>
                <TabsTrigger value="searching">Search</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 mt-2">
                <TabsTrigger value="tree">Tree</TabsTrigger>
                <TabsTrigger value="dynamic-programming">DP</TabsTrigger>
              </TabsList>
              
              {Object.entries(categories).map(([categoryKey, categoryAlgorithms]) => (
                <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
                  {categoryAlgorithms.map((algorithm) => (
                    <Card 
                      key={algorithm.id}
                      className={`cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 ${
                        selectedAlgorithm?.name === algorithm.name ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedAlgorithm(algorithm)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                          <Badge className={getDifficultyColor(algorithm.difficulty)}>
                            {algorithm.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{algorithm.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600">{algorithm.complexity}</div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right Panel - Detailed View */}
          <div className="lg:col-span-3">
            {selectedAlgorithm ? (
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedAlgorithm.name}</CardTitle>
                    <Badge className={getDifficultyColor(selectedAlgorithm.difficulty)}>
                      {selectedAlgorithm.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">{selectedAlgorithm.description}</CardDescription>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Link to={`/visualizations?algorithm=${selectedAlgorithm.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="h-4 w-4 mr-2" />
                        Visualize
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleLearnMore(selectedAlgorithm)}
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedAlgorithm.name + ' algorithm tutorial')}`, '_blank')}
                      className="border-red-200 hover:bg-red-50"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube Tutorial
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Complexity */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Complexity Analysis</h3>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <code className="text-sm">{selectedAlgorithm.complexity}</code>
                      </div>
                    </div>

                    {/* Code Implementation */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Python Implementation</h3>
                      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{selectedAlgorithm.code}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Link to="/playground">
                        <Button>
                          <Code className="h-4 w-4 mr-2" />
                          Try in Playground
                        </Button>
                      </Link>
                      <Link to={`/visualizations?algorithm=${selectedAlgorithm.id}`}>
                        <Button variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          View Visualization
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Select an Algorithm
                  </h3>
                  <p className="text-gray-500">
                    Choose an algorithm from the left panel to view details, 
                    implementation, and examples.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Learn More Dialog */}
      {selectedAlgorithm && (
        <LearnMoreDialog
          isOpen={isLearnMoreOpen}
          onClose={() => setIsLearnMoreOpen(false)}
          item={{
            name: selectedAlgorithm.name,
            description: selectedAlgorithm.description,
            complexity: {
              time: selectedAlgorithm.complexity.split(', ')[0]?.replace('Time: ', '') || 'O(n)',
              space: selectedAlgorithm.complexity.split(', ')[1]?.replace('Space: ', '') || 'O(1)'
            },
            applications: selectedAlgorithm.applications,
            difficulty: selectedAlgorithm.difficulty,
            explanation: selectedAlgorithm.explanation,
            pythonCode: selectedAlgorithm.code
          }}
        />
      )}
    </div>
  );
};

export default Algorithms;
