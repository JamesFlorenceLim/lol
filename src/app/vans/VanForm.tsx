"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Modal from '../vans/Modal'; // Import the Modal component
import { Van } from '@/types';

const VanForm = () => {
  const [van, setVan] = useState<string[]>(Array(19).fill(''));
  const [vanList, setVanList] = useState<Van[]>([]);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await axios.get('/api/vans');
        setVanList(response.data);
      } catch (error) {
        console.error('Failed to fetch vans:', error);
      }
    };

    fetchVans();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const index = parseInt(name);
    setVan(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/vans', {
        mv_file_no: van[0],
        plate_number: van[1],
        engine_no: van[2],
        chassis_no: van[3],
        denomination: van[4],
        piston_displacement: van[5],
        number_of_cylinders: parseInt(van[6], 10),
        fuel: van[7],
        make: van[8],
        series: van[9],
        body_type: van[10],
        body_no: van[11],
        year_model: parseInt(van[12], 10),
        gross_weight: parseFloat(van[13]),
        net_weight: parseFloat(van[14]),
        shipping_weight: parseFloat(van[15]),
        net_capacity: parseFloat(van[16]),
        year_last_registered: parseInt(van[17], 10),
        expiration_date: van[18],
      });
      alert('Van registered successfully');
      setVan(Array(19).fill(''));
      const response = await axios.get('/api/vans');
      setVanList(response.data);
      setIsRegisterModalOpen(false); // Close the modal after successful submission
    } catch (error) {
      alert('Failed to register van');
    }
  };

  const handleView = (van: Van) => {
    setSelectedVan(van);
    setIsViewModalOpen(true);
  };

  const handleEdit = async (updatedVan: Van) => {
    try {
      await axios.put(`/api/vans/${updatedVan.id}`, updatedVan);
      const response = await axios.get('/api/vans');
      setVanList(response.data);
      setIsViewModalOpen(false); // Close the view modal after successful update
    } catch (error) {
      alert('Failed to update van');
    }
  };

  const handleArchive = async (vanId: number) => {
    try {
      await axios.delete(`/api/vans/${vanId}`);
      const response = await axios.get('/api/vans');
      setVanList(response.data);
    } catch (error) {
      alert('Failed to archive van');
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsRegisterModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Register New Van
      </button>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Van Registration</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'MV File No.', name: 'mv_file_no', index: 0 },
                  { label: 'Plate Number', name: 'plate_number', index: 1 },
                  { label: 'Engine No', name: 'engine_no', index: 2 },
                  { label: 'Chassis No', name: 'chassis_no', index: 3 },
                  { label: 'Denomination', name: 'denomination', index: 4 },
                  { label: 'Piston Displacement', name: 'piston_displacement', index: 5 },
                  { label: 'Number of Cylinders', name: 'number_of_cylinders', index: 6 },
                  { label: 'Fuel', name: 'fuel', index: 7 },
                  { label: 'Make', name: 'make', index: 8 },
                  { label: 'Series', name: 'series', index: 9 },
                  { label: 'Body Type', name: 'body_type', index: 10 },
                  { label: 'Body No.', name: 'body_no', index: 11 },
                  { label: 'Year Model', name: 'year_model', index: 12 },
                  { label: 'Gross Weight', name: 'gross_weight', index: 13 },
                  { label: 'Net Weight', name: 'net_weight', index: 14 },
                  { label: 'Shipping Weight', name: 'shipping_weight', index: 15 },
                  { label: 'Net Capacity', name: 'net_capacity', index: 16 },
                  { label: 'Year Last Registered', name: 'year_last_registered', index: 17 },
                  { label: 'Expiration Date', name: 'expiration_date', index: 18 }
                ].map(({ label, name, index }) => (
                  <div key={index} className="relative">
                    <label htmlFor={name} className="absolute text-gray-500 top-2 left-3 text-sm uppercase">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={name}
                      name={index.toString()}
                      value={van[index]}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 pt-7 pb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Register Van
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <h2 className="text-2xl font-semibold mt-6">Registered Vans</h2>
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MV File No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engine No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassis No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denomination</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piston Displacement</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vanList.map(v => (
            <tr key={v.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.mv_file_no}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{v.plate_number}</td>
              
              <td className="px-6 py-4 text-sm text-gray-500">{v.engine_no}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{v.chassis_no}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{v.denomination}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{v.piston_displacement}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleView(v)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleArchive(v.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">View Van Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {selectedVan && (
              <div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(selectedVan).map(([key, value]) => (
                    <div key={key} className="relative">
                      <label className="absolute text-gray-500 top-2 left-3 text-sm uppercase">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        value={value as string}
                        readOnly
                        className="block w-full px-3 pt-7 pb-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleEdit(selectedVan)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VanForm;
