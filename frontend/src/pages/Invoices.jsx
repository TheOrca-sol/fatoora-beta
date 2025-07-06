import { useEffect, useState } from 'react';
import { api } from '../api';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Download, Trash2, DollarSign, Calendar, User, MoreVertical, Eye, Edit, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

function StatusBadge({ status }) {
  const { t } = useTranslation();
  
  const statusConfig = {
    paid: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓',
      label: t('paid')
    },
    unpaid: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '○',
      label: t('unpaid')
    },
    overdue: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '!',
      label: t('overdue')
    }
  };

  const config = statusConfig[status] || statusConfig.unpaid;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span className="text-sm">{config.icon}</span>
      {config.label}
    </span>
  );
}

function InvoiceCard({ invoice, client, onDelete, onStatusChange, onDownload }) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              #{invoice.number}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Invoice #{invoice.number}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User className="h-4 w-4" />
                {client ? client.name : 'Unknown Client'}
              </div>
              {invoice.items_count && (
                <div className="text-xs text-blue-600 font-medium mt-1">
                  {invoice.items_count} item{invoice.items_count !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">{invoice.amount} {invoice.currency}</span>
          </div>
          {invoice.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Due:</span>
              <span className="font-semibold text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={invoice.status === 'paid' ? 'outline' : 'default'}
              onClick={() => onStatusChange(invoice.id, invoice.status === 'paid' ? 'unpaid' : 'paid')}
              className="text-xs"
            >
              {t('mark_as')} {t(invoice.status === 'paid' ? 'unpaid' : 'paid')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(invoice.id)}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              PDF
            </Button>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(invoice.id)}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LineItemRow({ item, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    const updatedItem = { ...item, [field]: value };
    // Recalculate total when quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      updatedItem.total = (parseFloat(updatedItem.quantity) || 0) * (parseFloat(updatedItem.unit_price) || 0);
    }
    onUpdate(updatedItem);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
      <div className="col-span-5">
        <input
          type="text"
          placeholder="Description of service/product"
          value={item.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Qty"
          value={item.quantity || ''}
          onChange={(e) => handleChange('quantity', e.target.value)}
          min="0"
          step="0.01"
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Unit Price"
          value={item.unit_price || ''}
          onChange={(e) => handleChange('unit_price', e.target.value)}
          min="0"
          step="0.01"
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.total?.toFixed(2) || '0.00'}
          readOnly
          className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-sm font-semibold"
        />
      </div>
      <div className="col-span-1">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="p-2"
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function Invoices() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ 
    client_id: '', 
    due_date: '',
    items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }]
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inv, cli] = await Promise.all([
        api.get('/invoices/'),
        api.get('/clients/'),
      ]);
      setInvoices(inv);
      setClients(cli);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLineItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, unit_price: 0, total: 0 }]
    });
  };

  const updateLineItem = (index, updatedItem) => {
    const newItems = [...form.items];
    newItems[index] = updatedItem;
    setForm({ ...form, items: newItems });
  };

  const removeLineItem = (index) => {
    if (form.items.length > 1) {
      const newItems = form.items.filter((_, i) => i !== index);
      setForm({ ...form, items: newItems });
    }
  };

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Validate that at least one item has a description
    const validItems = form.items.filter(item => item.description.trim() !== '');
    if (validItems.length === 0) {
      setError('Please add at least one line item with a description');
      setSubmitting(false);
      return;
    }
    
    try {
      const invoiceData = {
        client_id: parseInt(form.client_id),
        due_date: form.due_date || null,
        currency: 'MAD',
        items: validItems.map(item => ({
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          unit_price: parseFloat(item.unit_price) || 0
        }))
      };
      
      await api.post('/invoices/', invoiceData);
      setForm({ 
        client_id: '', 
        due_date: '',
        items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }]
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('delete') + '?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/invoices/${id}/status`, { status });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/invoices/${id}/pdf`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
      });
      if (!res.ok) {
        alert('Failed to download PDF');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);

  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    unpaid: invoices.filter(inv => inv.status === 'unpaid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
  };

  return (
    <div className="space-y-8 py-6 px-4 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
            <FileText className="h-10 w-10 text-blue-600" />
            {t('invoices')}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Create, manage, and track your invoices with detailed line items
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('add')} {t('invoice')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unpaid</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.unpaid}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Invoice Form */}
      {showForm && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3">
              <Plus className="h-6 w-6" />
              Create New Invoice with Line Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('client')} *
                  </label>
                  <select
                    name="client_id"
                    value={form.client_id}
                    onChange={handleFormChange}
                    required
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  >
                    <option value="">Select a client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('due_date')}
                  </label>
                  <input
                    name="due_date"
                    value={form.due_date}
                    onChange={handleFormChange}
                    type="date"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Invoice Line Items *
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLineItem}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-100 rounded-lg mb-2 text-sm font-semibold text-gray-700">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1">Action</div>
                </div>
                
                {/* Line Items */}
                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <LineItemRow
                      key={index}
                      item={item}
                      onUpdate={(updatedItem) => updateLineItem(index, updatedItem)}
                      onRemove={() => removeLineItem(index)}
                    />
                  ))}
                </div>
                
                {/* Total */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Invoice Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateTotal().toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 shadow-lg"
                >
                  {submitting ? 'Creating...' : `Create Invoice`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-full">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Invoices' : t(status)}
            {status !== 'all' && (
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                {stats[status]}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'Start by creating your first invoice with detailed line items to track your business revenue.'
                  : `No ${filterStatus} invoices at the moment.`
                }
              </p>
              {filterStatus === 'all' && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInvoices.map((invoice) => {
                const client = clients.find((c) => c.id === invoice.client_id);
                return (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    client={client}
                    onDelete={handleDelete}
                    onStatusChange={handleStatus}
                    onDownload={handleDownload}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Invoices; 