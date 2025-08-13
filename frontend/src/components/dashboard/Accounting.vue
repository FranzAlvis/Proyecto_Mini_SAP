<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <!-- Header -->
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 4h.01M4 16h16M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-800">Registro Contable</h3>
          <p class="text-sm text-slate-500">Historial de todas las transacciones de venta</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-6">
        <button 
          @click="exportToPDF"
          class="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Exportar PDF</span>
        </button>
        <button 
          @click="printReport"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          <span>Imprimir</span>
        </button>
      </div>

      <!-- Transactions Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lote</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Precio Venta</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-if="transactions.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                    No hay transacciones registradas.
                </td>
            </tr>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ formatDate(tx.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ tx.productName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ tx.lot }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">{{ tx.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">{{ formatCurrency(tx.sellingPrice) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-emerald-600">{{ formatCurrency(tx.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => []
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const totalRevenue = computed(() => {
  return props.transactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
});

const exportToPDF = () => {
  // Create a new window for the PDF content
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte Contable - Mini SAP</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .company-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2563eb;
          margin-bottom: 5px;
        }
        .report-title { 
          font-size: 18px; 
          color: #666;
        }
        .report-date { 
          font-size: 12px; 
          color: #888;
          margin-top: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left;
        }
        th { 
          background-color: #f8f9fa; 
          font-weight: bold;
          color: #333;
        }
        .text-right { text-align: right; }
        .total-row { 
          background-color: #f0f9ff; 
          font-weight: bold;
        }
        .summary { 
          margin-top: 30px; 
          padding: 20px; 
          background-color: #f8f9fa; 
          border-radius: 8px;
        }
        .no-transactions {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">Mini SAP</div>
        <div class="report-title">Reporte Contable de Transacciones</div>
        <div class="report-date">Generado el: ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>
      
      ${props.transactions.length === 0 ? 
        '<div class="no-transactions">No hay transacciones registradas para mostrar.</div>' :
        `<table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Lote</th>
              <th class="text-right">Cantidad</th>
              <th class="text-right">Precio Unitario</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${props.transactions.map(tx => `
              <tr>
                <td>${formatDate(tx.createdAt || tx.date)}</td>
                <td>${tx.productName}</td>
                <td>${tx.lot}</td>
                <td class="text-right">${tx.quantity}</td>
                <td class="text-right">${formatCurrency(tx.price || tx.sellingPrice)}</td>
                <td class="text-right">${formatCurrency(tx.total)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5"><strong>Total General</strong></td>
              <td class="text-right"><strong>${formatCurrency(totalRevenue.value)}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="summary">
          <h3>Resumen del Reporte</h3>
          <p><strong>Total de Transacciones:</strong> ${props.transactions.length}</p>
          <p><strong>Ingresos Totales:</strong> ${formatCurrency(totalRevenue.value)}</p>
          <p><strong>Período:</strong> ${props.transactions.length > 0 ? 
            `${formatDate(props.transactions[props.transactions.length - 1].createdAt || props.transactions[props.transactions.length - 1].date)} - ${formatDate(props.transactions[0].createdAt || props.transactions[0].date)}` : 
            'N/A'}</p>
        </div>`
      }
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print dialog for PDF
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

const printReport = () => {
  // Use the same PDF export function but with immediate print
  exportToPDF();
};
</script>
