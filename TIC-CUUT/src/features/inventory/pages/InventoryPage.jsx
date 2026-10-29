import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../../../api/services/inventoryService';

import InventoryHeader from '../components/InventoryHeader';
import InventoryFiltersBar from '../components/InventoryFiltersBar';
import ReportFiltersBar from '../components/ReportFiltersBar';
import InventoryTable from '../components/InventoryTable';
import InventoryFormModal from '../components/InventoryFormModal';

export default function InventoryPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('global');

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [repStartDate, setRepStartDate] = useState('');
  const [repEndDate, setRepEndDate] = useState('');
  const [filterArticulo, setFilterArticulo] = useState('');

  const [selectedEquipos, setSelectedEquipos] = useState([]);
  const [bulkState, setBulkState] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Helpers de limpieza
  const clearMainSearch = () => { setSearchTerm(''); setSearchType('global'); };
  const clearTableDates = () => { setFilterStartDate(''); setFilterEndDate(''); };
  const clearReportFilters = () => { setRepStartDate(''); setRepEndDate(''); setFilterArticulo(''); };
  const clearAllFilters = () => {
    clearMainSearch(); clearTableDates(); clearReportFilters();
    setSelectedEquipos([]); setBulkState('');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    filterStartDate !== '' || filterEndDate !== '' ||
    repStartDate !== '' || repEndDate !== '' ||
    filterArticulo.trim() !== '';

  // ==== Fetch ====
  const fetchEquipos = async () => {
    if (!searchTerm.trim()) return await inventoryService.listarEquipos();
    switch (searchType) {
      case 'serie':    return inventoryService.buscarPorSerie(searchTerm);
      case 'marca':    return inventoryService.buscarPorMarca(searchTerm);
      case 'modelo':   return inventoryService.buscarPorModelo(searchTerm);
      case 'articulo': return inventoryService.buscarPorArticulo(searchTerm);
      default:         return inventoryService.buscarGlobal(searchTerm);
    }
  };

  const { data: inventory = [], isLoading, isError, error } = useQuery({
    queryKey: ['equipos', searchTerm, searchType],
    queryFn: fetchEquipos,
    keepPreviousData: true,
  });

  const displayedInventory = inventory.filter((item) => {
    if (!filterStartDate && !filterEndDate) return true;
    if (!item.fechaRegistro) return false;
    const itemDate = new Date(item.fechaRegistro).setHours(0, 0, 0, 0);
    const start = filterStartDate ? new Date(filterStartDate).setHours(0, 0, 0, 0) : -Infinity;
    const end = filterEndDate ? new Date(filterEndDate).setHours(23, 59, 59, 999) : Infinity;
    return itemDate >= start && itemDate <= end;
  });

  // ==== Mutaciones ====
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingItem) return inventoryService.actualizarEquipo(data.inventario, data);
      return inventoryService.crearEquipoCompleto
        ? inventoryService.crearEquipoCompleto(data)
        : inventoryService.crearEquipoMovil(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      setIsModalOpen(false);
      alert(editingItem ? 'Equipo actualizado exitosamente' : 'Equipo registrado exitosamente');
    },
    onError: (err) => alert(`Error al guardar: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (inventario) => inventoryService.eliminarEquipo(inventario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      alert('Equipo eliminado permanentemente');
    },
    onError: (err) => alert(`Error al eliminar: ${err.message}`),
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ inventarios, nuevoEstado }) =>
      inventoryService.actualizarEstadoMasivo(inventarios, nuevoEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      setSelectedEquipos([]); setBulkState('');
      alert('Estados actualizados correctamente');
      clearMainSearch(); clearTableDates();
    },
    onError: (err) => alert(`Error: ${err.message}`),
  });

  // ==== Handlers ====
  const openAddModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = (inv) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo del inventario?')) {
      deleteMutation.mutate(inv);
    }
  };
  const handleSelectAll = (e) => {
    setSelectedEquipos(e.target.checked ? displayedInventory.map((i) => i.inventario) : []);
  };
  const handleSelectItem = (inv) => {
    setSelectedEquipos((prev) =>
      prev.includes(inv) ? prev.filter((id) => id !== inv) : [...prev, inv]
    );
  };
  const handleUpdateStatus = () => {
    if (selectedEquipos.length === 0) return alert('Selecciona al menos un equipo');
    if (!bulkState) return alert('Selecciona un estado a aplicar');
    updateEstadoMutation.mutate({ inventarios: selectedEquipos, nuevoEstado: bulkState });
  };
  const handleDownloadReport = async (type) => {
    try {
      const blob = type === 'pdf'
        ? await inventoryService.descargarReportePdf(repStartDate, repEndDate, filterArticulo)
        : await inventoryService.descargarReporteCsv(repStartDate, repEndDate, filterArticulo);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_equipos_${Date.now()}.${type}`);
      document.body.appendChild(link); link.click(); link.parentNode.removeChild(link);
    } catch {
      alert('Error al descargar el reporte');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <InventoryHeader onAdd={openAddModal} />

      <InventoryFiltersBar
        searchType={searchType} setSearchType={setSearchType}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        clearMainSearch={clearMainSearch}
        filterStartDate={filterStartDate} setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate} setFilterEndDate={setFilterEndDate}
        clearTableDates={clearTableDates}
        hasActiveFilters={hasActiveFilters} onClearAll={clearAllFilters}
        selectedEquipos={selectedEquipos}
        bulkState={bulkState} setBulkState={setBulkState}
        onApplyBulk={handleUpdateStatus}
        isApplying={updateEstadoMutation.isLoading}
      />

      <ReportFiltersBar
        repStartDate={repStartDate} setRepStartDate={setRepStartDate}
        repEndDate={repEndDate} setRepEndDate={setRepEndDate}
        filterArticulo={filterArticulo} setFilterArticulo={setFilterArticulo}
        onClear={clearReportFilters}
        onDownload={handleDownloadReport}
      />

      <InventoryTable
        inventory={displayedInventory}
        isLoading={isLoading} isError={isError} error={error}
        selectedEquipos={selectedEquipos}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => saveMutation.mutate(data)}
        initialData={editingItem}
        isSaving={saveMutation.isLoading}
      />
    </div>
  );
}