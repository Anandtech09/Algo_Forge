
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Code, Eye, EyeOff, X, Clock, Trophy } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  timeEstimate: string;
  points: number;
}

interface ProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
}

const ProblemDialog: React.FC<ProblemDialogProps> = ({ isOpen, onClose, problem }) => {
  const [showSolution, setShowSolution] = useState(false);

  if (!problem) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSolutionCode = (problemId: string) => {
  const solutions: { [key: string]: string } = {
    'two-sum': `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

# Example usage
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(result)  # Output: [0, 1]`,

    'reverse-linked-list': `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

# Recursive solution
def reverse_list_recursive(head):
    if not head or not head.next:
        return head
    
    reversed_head = reverse_list_recursive(head.next)
    head.next.next = head
    head.next = None
    
    return reversed_head`,

    'valid-parentheses': `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    
    return not stack

# Example usage
print(is_valid("()"))     # True
print(is_valid("()[]{}")) # True
print(is_valid("(]"))     # False`,

    'maximum-subarray': `def max_subarray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Example usage
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
result = max_subarray(nums)
print(result)  # Output: 6 (subarray [4, -1, 2, 1])`,

    'binary-tree-inorder': `class TreeNode:
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

# Iterative solution
def inorder_traversal_iterative(root):
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
    
    return result`,

    'merge-intervals': `def merge(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged

# Example usage
intervals = [[1,3],[2,6],[8,10],[15,18]]
result = merge(intervals)
print(result)  # Output: [[1,6],[8,10],[15,18]]`,

    'longest-palindrome': `def longest_palindrome(s):
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1
    
    start = 0
    max_len = 0
    
    for i in range(len(s)):
        len1 = expand_around_center(i, i)
        len2 = expand_around_center(i, i + 1)
        current_max = max(len1, len2)
        
        if current_max > max_len:
            max_len = current_max
            start = i - (current_max - 1) // 2
    
    return s[start:start + max_len]

# Example usage
s = "babad"
result = longest_palindrome(s)
print(result)  # Output: "bab" or "aba"`,

    'word-ladder': `from collections import deque

def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    
    wordSet = set(wordList)
    queue = deque([(beginWord, 1)])
    visited = set([beginWord])
    
    while queue:
        word, length = queue.popleft()
        
        if word == endWord:
            return length
        
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in wordSet and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    
    return 0

# Example usage
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]
result = ladder_length(beginWord, endWord, wordList)
print(result)  # Output: 5`,

    'climbing-stairs': `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Example usage
n = 3
print(climb_stairs(n))  # Output: 3`,

    'best-time-to-buy-sell-stock': `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit

# Example usage
prices = [7,1,5,3,6,4]
print(max_profit(prices))  # Output: 5`,

    'container-with-most-water': `def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        max_water = max(max_water, min(height[left], height[right]) * width)
        if height[left] < height[right]:
            left +=- 1
        else:
            right -= 1
    return max_water

# Example usage
height = [1,8,6,2,5,4,8,3,7]
print(max_area(height))  # Output: 49`,

    '3sum': `def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result

# Example usage
nums = [-1,0,1,2,-1,-4]
print(three_sum(nums))  # Output: [[-1,-1,2],[-1,0,1]]`,

    'remove-nth-node': `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    dummy = ListNode(0)
    dummy.next = head
    first = second = dummy
    for _ in range(n + 1):
        first = first.next
    while first:
        first = first.next
        second = second.next
    second.next = second.next.next
    return dummy.next`,

    'valid-sudoku': `def is_valid_sudoku(board):
    rows = [setಸ] * 9
    cols = [{}] * 9
    boxes = [{}] * 9
    for i in range(9):
        for j in range(9):
            if board[i][j] != '.':
                num = board[i][j]
                if num in rows[i] or num in cols[j] or num in boxes[i//3*3 + j//3]:
                    return False
                rows[i].add(num)
                cols[j].add(num)
                boxes[i//3*3 + j//3].add(num)
    return True

# Example usage
board = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
]
print(is_valid_sudoku(board))  # Output: True`,

    'search-rotated-array': `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

# Example usage
nums = [4,5,6,7,0,1,2]
target = 0
print(search(nums, target))  # Output: 4`,

    'combination-sum': `def combination_sum(candidates, target):
    result = []
    def backtrack(remain, curr, start):
        if remain == 0:
            result.append(curr[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remain:
                continue
            curr.append(candidates[i])
            backtrack(remain - candidates[i], curr, i)
            curr.pop()
    candidates.sort()
    backtrack(target, [], 0)
    return result

# Example usage
candidates = [2,3,6,7]
target = 7
print(combination_sum(candidates, target))  # Output: [[2,2,3],[7]]`,

    'permutations': `def permute(nums):
    result = []
    def backtrack(nums, curr):
        if len(curr) == len(nums):
            result.append(curr[:])
            return
        for num in nums:
            if num not in curr:
                curr.append(num)
                backtrack(nums, curr)
                curr.pop()
    backtrack(nums, [])
    return result

# Example usage
nums = [1,2,3]
print(permute(nums))  # Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`,

    'rotate-image': `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for i in range(n):
        matrix[i].reverse()

# Example usage
matrix = [[1,2,3],[4,5,6],[7,8,9]]
rotate(matrix)
print(matrix)  # Output: [[7,4,1],[8,5,2],[9,6,3]]`,

    'group-anagrams': `from collections import defaultdict

def group_anagrams(strs):
    anagrams = defaultdict(list)
    for s in strs:
        sorted_str = ''.join(sorted(s))
        anagrams[sorted_str].append(s)
    return list(anagrams.values())

# Example usage
strs = ["eat","tea","tan","ate","nat","bat"]
print(group_anagrams(strs))  # Output: [["eat","tea","ate"],["tan","nat"],["bat"]]`,

    'maximum-depth-binary-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root):
    if not root:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1`,

    'same-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,

    'symmetric-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_symmetric(root):
    def is_mirror(left, right):
        if not left and not right:
            return True
        if not left or not right:
            return False
        return (left.val == right.val and 
                is_mirror(left.left, right.right) and 
                is_mirror(left.right, right.left))
    return not root or is_mirror(root.left, root.right)`,

    'path-sum': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def has_path_sum(root, target_sum):
    if not root:
        return False
    if not root.left and not root.right:
        return target_sum == root.val
    return (has_path_sum(root.left, target_sum - root.val) or 
            has_path_sum(root.right, target_sum - root.val))`,

    'minimum-depth-binary-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def min_depth(root):
    if not root:
        return 0
    if not root.left and not root.right:
        return 1
    if not root.left:
        return min_depth(root.right) + 1
    if not root.right:
        return min_depth(root.left) + 1
    return min(min_depth(root.left), min_depth(root.right)) + 1`,

    'balanced-binary-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root):
    def check_height(node):
        if not node:
            return 0
        left_height = check_height(node.left)
        if left_height == -1:
            return -1
        right_height = check_height(node.right)
        if right_height == -1:
            return -1
        if abs(left_height - right_height) > 1:
            return -1
        return max(left_height, right_height) + 1
    return check_height(root) != -1`,

    'convert-sorted-array-to-bst': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sorted_array_to_bst(nums):
    if not nums:
        return None
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sorted_array_to_bst(nums[:mid])
    root.right = sorted_array_to_bst(nums[mid + 1:])
    return root`,

    'pascal-triangle': `def generate(num_rows):
    if num_rows == 0:
        return []
    triangle = [[1]]
    for i in range(1, num_rows):
        prev_row = triangle[-1]
        new_row = [1]
        for j in range(len(prev_row) - 1):
            new_row.append(prev_row[j] + prev_row[j + 1])
        new_row.append(1)
        triangle.append(new_row)
    return triangle

# Example usage
num_rows = 5
print(generate(num_rows))  # Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]`,

    'single-number': `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# Example usage
nums = [4,1,2,1,2]
print(single_number(nums))  # Output: 4`,

    'linked-list-cycle': `class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def has_cycle(head):
    if not head or not head.next:
        return False
    slow = head
    fast = head.next
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    return True`,

    'min-stack': `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def get_min(self):
        return self.min_stack[-1]`,

    'intersection-linked-lists': `class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def get_intersection_node(headA, headB):
    if not headA or not headB:
        return None
    a, b = headA, headB
    while a != b:
        a = a.next if a else headB
        b = b.next if b else headA
    return a`,

    'majority-element': `def majority_element(nums):
    count = 0
    candidate = None
    for num in nums:
        if count == 0:
            candidate = num
        count += (1 if num == candidate else -1)
    return candidate

# Example usage
nums = [2,2,1,1,1,2,2]
print(majority_element(nums))  # Output: 2`,

    'rotate-array': `def rotate(nums, k):
    k = k % len(nums)
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    reverse(0, len(nums) - 1)
    reverse(0, k - 1)
    reverse(k, len(nums) - 1)

# Example usage
nums = [1,2,3,4,5,6,7]
k = 3
rotate(nums, k)
print(nums)  # Output: [5,6,7,1,2,3,4]`,

    'reverse-bits': `def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

# Example usage
n = 0b00000010100101000001111010011100
print(bin(reverse_bits(n)))  # Output: 0b00111001011110000010100101000000`,

    'number-of-1-bits': `def hamming_weight(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

# Example usage
n = 0b00000000000000000000000000001011
print(hamming_weight(n))  # Output: 3`,

    'house-robber': `def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    dp = [nums[0], max(nums[0], nums[1])]
    for i in range(2, len(nums)):
        dp.append(max(dp[i-1], dp[i-2] + nums[i]))
    return dp[-1]

# Example usage
nums = [2,7,9,3,1]
print(rob(nums))  # Output: 12`,

    'binary-tree-level-order': `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)
    return result`,

    'validate-binary-search-tree': `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return validate(node.left, min_val, node.val) and validate(node.right, node.val, max_val)
    return validate(root, float('-inf'), float('inf'))`,

    'kth-largest-element': `import heapq

def find_kth_largest(nums, k):
    return heapq.nlargest(k, nums)[-1]

# Example usage
nums = [3,2,1,5,6,4]
k = 2
print(find_kth_largest(nums, k))  # Output: 5`,

    'course-schedule': `from collections import defaultdict, deque

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for dest, src in prerequisites:
        graph[src].append(dest)
        in_degree[dest] += 1
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    count = 0
    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return count == num_courses

# Example usage
num_courses = 2
prerequisites = [[1,0]]
print(can_finish(num_courses, prerequisites))  # Output: True`,

    'implement-trie': `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
    
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`
  };

  return solutions[problemId] || `# Solution for ${problem.title} will be provided here
# This is a placeholder for the actual solution code
def solve_problem():
    # Implementation goes here
    pass`;
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DialogTitle className="text-2xl font-bold">{problem.title}</DialogTitle>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Badge variant="outline">{problem.category}</Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Problem Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Estimated Time:</span>
                  <span className="text-sm font-medium">{problem.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Points:</span>
                  <span className="text-sm font-medium">{problem.points}</span>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Problem Description</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>

            {/* Solution Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Solution</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-sm"
                >
                  {showSolution ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Solution
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Solution
                    </>
                  )}
                </Button>
              </div>

              {showSolution ? (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                    <span className="text-gray-300 text-sm font-mono">Python</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <pre className="p-4 text-sm">
                      <code className="text-green-400 font-mono leading-relaxed">
                        {getSolutionCode(problem.id)}
                      </code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Solution Hidden</h4>
                  <p className="text-gray-500">Click "Show Solution" to reveal the answer</p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Tips & Hints</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Try to understand the problem thoroughly before coding</li>
                  <li>Think about edge cases and test your solution</li>
                  <li>Consider time and space complexity</li>
                  <li>Start with a brute force approach if needed, then optimize</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDialog;
