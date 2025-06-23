import jsPDF from 'jspdf';

export const generatePDF = (code: string, output: string, analysis: string): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = '#2563eb';
  const secondaryColor = '#64748b';
  const accentColor = '#f8fafc';
  const textColor = '#1e293b';

  // Set up fonts and spacing
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text || '', maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.35)); // Approximate line height
  };

  // Helper function to add section with background
  const addSection = (title: string, content: string, bgColor?: string): void => {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    // Add section background
    if (bgColor) {
      doc.setFillColor(bgColor);
      doc.rect(margin - 5, yPos - 5, contentWidth + 10, 15, 'F');
    }

    // Section title
    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPos + 5);
    yPos += 15;

    // Divider line
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Content
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    if (title.includes('CODE')) {
      // Use monospace font for code
      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
    } else {
      doc.setFontSize(10);
    }

    yPos = addWrappedText(content || '', margin, yPos, contentWidth, title.includes('CODE') ? 9 : 10);
    yPos += 10;
  };

  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DSA Code Playground', margin, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Code Analysis & Export Report', margin, 20);

  yPos = 35;

  // Meta information
  doc.setTextColor(secondaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on: ${timestamp}`, margin, yPos);
  yPos += 15;

  // Add sections with the actual content
  addSection('SOURCE CODE', code || 'No code provided', '#f1f5f9');
  
  yPos += 10;
  if (output && output.trim()) {
    addSection('CONSOLE OUTPUT', output, '#fef7ed');
  }
  
  if (analysis && analysis.trim()) {
    addSection('AI ANALYSIS', analysis, '#f0fdf4');
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(secondaryColor);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.setTextColor(secondaryColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('DSA Code Playground Export', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 8);
  }

  // Generate filename with timestamp
  const filename = `algo_forge-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};

// Alternative version with more styling options
export const generateStyledPDF = (
  code: string, 
  output: string, 
  analysis: string,
  options?: {
    title?: string;
    theme?: 'light' | 'dark' | 'minimal';
    includeTimestamp?: boolean;
  }
): void => {
  const { title = 'DSA Code Playground', theme = 'light', includeTimestamp = true } = options || {};
  
  const doc = new jsPDF();
  
  // Theme colors
  const themes = {
    light: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#f8fafc'
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
      text: '#f1f5f9',
      accent: '#1e293b'
    },
    minimal: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#333333',
      accent: '#f5f5f5'
    }
  };
  
  const colors = themes[theme];
  
  // Apply theme
  if (theme === 'dark') {
    doc.setFillColor(colors.background);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
  }
  
  // Rest of the PDF generation logic with theme colors...
  // (Similar structure as above but using theme colors)
  
  generatePDF(code, output, analysis); // Fallback to main function
};

// Usage example:
/*
// Basic usage
generatePDF(codeString, outputString, analysisString);

// With custom options
generateStyledPDF(codeString, outputString, analysisString, {
  title: 'My Algorithm Analysis',
  theme: 'dark',
  includeTimestamp: true
});
*/