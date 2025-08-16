import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFDownloadOptions {
  filename?: string;
  title?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TransactionData {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  method: string;
  timestamp: string;
  fee: number;
  netAmount: number;
  gateway: string;
  reference: string;
}

export interface MerchantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  joinDate: string;
  lastTransaction: string;
}

export interface ReportData {
  title: string;
  dateRange: {
    from: string;
    to: string;
  };
  summary: {
    totalTransactions: number;
    totalVolume: number;
    successRate: number;
    totalFees: number;
  };
  transactions?: TransactionData[];
  merchants?: MerchantData[];
  charts?: {
    type: string;
    data: any[];
  }[];
}

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };

  constructor(options: PDFDownloadOptions = {}) {
    const format = options.format || 'a4';
    const orientation = options.orientation || 'portrait';
    
    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });
    
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margins = { ...this.margins, ...options.margins };
    this.currentY = this.margins.top;
  }

  private checkPageBreak(requiredHeight: number = 10) {
    if (this.currentY + requiredHeight > this.pageHeight - this.margins.bottom) {
      this.doc.addPage();
      this.currentY = this.margins.top;
      return true;
    }
    return false;
  }

  private addHeader(title: string) {
    // AIRpay Logo (text-based)
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(59, 130, 246); // Blue color
    this.doc.text('AIRpay', this.margins.left, this.currentY);
    
    // Add current date
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const pageWidth = this.doc.internal.pageSize.width;
    this.doc.text(date, pageWidth - this.margins.right, this.currentY, { align: 'right' });
    
    this.currentY += 15;
    
    // Report title
    this.doc.setFontSize(16);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, this.margins.left, this.currentY);
    this.currentY += 10;
    
    // Horizontal line
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margins.left, this.currentY, pageWidth - this.margins.right, this.currentY);
    this.currentY += 10;
  }

  private addSection(title: string, content: string[] | { [key: string]: string }) {
    this.checkPageBreak(20);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, this.margins.left, this.currentY);
    this.currentY += 8;
    
    // Section content
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(60, 60, 60);
    
    if (Array.isArray(content)) {
      content.forEach(line => {
        this.checkPageBreak();
        this.doc.text(line, this.margins.left + 5, this.currentY);
        this.currentY += 5;
      });
    } else {
      Object.entries(content).forEach(([key, value]) => {
        this.checkPageBreak();
        this.doc.text(`${key}: ${value}`, this.margins.left + 5, this.currentY);
        this.currentY += 5;
      });
    }
    
    this.currentY += 5;
  }

  private addTable(headers: string[], rows: string[][]) {
    const startY = this.currentY;
    const pageWidth = this.doc.internal.pageSize.width;
    const tableWidth = pageWidth - this.margins.left - this.margins.right;
    const colWidth = tableWidth / headers.length;
    
    this.checkPageBreak(15 + rows.length * 6);
    
    // Table headers
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.margins.left, this.currentY - 3, tableWidth, 8, 'F');
    
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);
    
    headers.forEach((header, index) => {
      const x = this.margins.left + (index * colWidth) + 2;
      this.doc.text(header, x, this.currentY + 2);
    });
    
    this.currentY += 8;
    
    // Table rows
    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(8);
    
    rows.forEach((row, rowIndex) => {
      this.checkPageBreak(6);
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(250, 250, 250);
        this.doc.rect(this.margins.left, this.currentY - 2, tableWidth, 6, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        const x = this.margins.left + (colIndex * colWidth) + 2;
        const cellText = cell.length > 20 ? cell.substring(0, 17) + '...' : cell;
        this.doc.text(cellText, x, this.currentY + 2);
      });
      
      this.currentY += 6;
    });
    
    // Table border
    this.doc.setDrawColor(200, 200, 200);
    this.doc.rect(this.margins.left, startY - 3, tableWidth, this.currentY - startY + 3);
    
    // Column separators
    for (let i = 1; i < headers.length; i++) {
      const x = this.margins.left + (i * colWidth);
      this.doc.line(x, startY - 3, x, this.currentY);
    }
    
    this.currentY += 10;
  }

  public generateTransactionReport(data: ReportData): void {
    this.addHeader(data.title);
    
    // Date range
    this.addSection('Report Period', {
      'From': new Date(data.dateRange.from).toLocaleDateString(),
      'To': new Date(data.dateRange.to).toLocaleDateString(),
      'Generated': new Date().toLocaleString()
    });
    
    // Summary
    this.addSection('Summary', {
      'Total Transactions': data.summary.totalTransactions.toLocaleString(),
      'Total Volume': `$${data.summary.totalVolume.toLocaleString()}`,
      'Success Rate': `${data.summary.successRate.toFixed(2)}%`,
      'Total Fees': `$${data.summary.totalFees.toLocaleString()}`
    });
    
    // Transactions table
    if (data.transactions && data.transactions.length > 0) {
      this.checkPageBreak(50);
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Transaction Details', this.margins.left, this.currentY);
      this.currentY += 10;
      
      const headers = ['ID', 'Merchant', 'Amount', 'Status', 'Method', 'Date'];
      const rows = data.transactions.slice(0, 50).map(t => [
        t.id.substring(0, 8),
        t.merchantName.substring(0, 15),
        `$${t.amount.toFixed(2)}`,
        t.status,
        t.method,
        new Date(t.timestamp).toLocaleDateString()
      ]);
      
      this.addTable(headers, rows);
    }
  }

  public generateMerchantReport(merchants: MerchantData[]): void {
    this.addHeader('Merchant Report');
    
    // Summary
    const totalMerchants = merchants.length;
    const activeMerchants = merchants.filter(m => m.status === 'active').length;
    const totalVolume = merchants.reduce((sum, m) => sum + m.totalVolume, 0);
    const avgSuccessRate = merchants.reduce((sum, m) => sum + m.successRate, 0) / totalMerchants;
    
    this.addSection('Merchant Summary', {
      'Total Merchants': totalMerchants.toString(),
      'Active Merchants': activeMerchants.toString(),
      'Total Volume': `$${totalVolume.toLocaleString()}`,
      'Average Success Rate': `${avgSuccessRate.toFixed(2)}%`
    });
    
    // Merchants table
    const headers = ['ID', 'Name', 'Email', 'Status', 'Transactions', 'Volume', 'Success Rate'];
    const rows = merchants.map(m => [
      m.id.substring(0, 8),
      m.name.substring(0, 15),
      m.email.substring(0, 20),
      m.status,
      m.totalTransactions.toString(),
      `$${m.totalVolume.toFixed(0)}`,
      `${m.successRate.toFixed(1)}%`
    ]);
    
    this.addTable(headers, rows);
  }

  public download(filename: string = 'airpay-report.pdf'): void {
    this.doc.save(filename);
  }
}

// Utility functions for specific report types
export const downloadTransactionReport = async (data: ReportData, filename?: string) => {
  const pdf = new PDFGenerator();
  pdf.generateTransactionReport(data);
  pdf.download(filename || `airpay-transaction-report-${new Date().getTime()}.pdf`);
};

export const downloadMerchantReport = async (merchants: MerchantData[], filename?: string) => {
  const pdf = new PDFGenerator();
  pdf.generateMerchantReport(merchants);
  pdf.download(filename || `airpay-merchant-report-${new Date().getTime()}.pdf`);
};

export const downloadElementAsPDF = async (element: HTMLElement, filename: string = 'airpay-export.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
