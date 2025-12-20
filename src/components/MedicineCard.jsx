import React, { useState } from 'react';
import { Card, Button, Badge } from './ui/BaseComponents';
import { Edit2, Trash2, AlertCircle, Clock } from 'lucide-react';

export const MedicineCard = ({ medicine, onEdit, onDelete }) => {
    // Calculate days/months until expiry
    const calculateTimeLeft = (dateStr) => {
        if (!dateStr) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // dateStr format: "2025-12" (YYYY-MM)
        const [year, month] = dateStr.split('-').map(Number);

        // Son kullanma tarihi = ayın son günü
        const expiryDate = new Date(year, month, 0); // month index + 0 gives last day of previous month, so month gives last day of that month
        expiryDate.setHours(23, 59, 59, 999);

        const diffTime = expiryDate - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { daysLeft, expiryDate };
    };

    const timeInfo = calculateTimeLeft(medicine.expiryDate);
    const daysLeft = timeInfo?.daysLeft;

    let status = 'good';
    let badgeText = 'İyi Durumda';

    if (daysLeft !== null && daysLeft !== undefined) {
        if (daysLeft < 0) {
            status = 'expired';
            badgeText = 'Süresi Dolmuş';
        } else if (daysLeft <= 30) {
            status = 'warning';
            badgeText = 'Yakında Bitiyor';
        }
    }

    const getStatusColor = (s) => {
        switch (s) {
            case 'expired': return 'danger';
            case 'warning': return 'warning';
            default: return 'success';
        }
    };

    // Format date as "Aralık 2025" (Turkish month + year)
    const formatExpiryDate = (dateStr) => {
        if (!dateStr) return 'Tarih Yok';

        const [year, month] = dateStr.split('-');
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
            {status === 'expired' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            )}

            <div className="flex justify-between items-start mb-2">
                <Badge variant={getStatusColor(status)}>{badgeText}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(medicine)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(medicine.id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">{medicine.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{medicine.quantity}</p>

            {medicine.notes && (
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 italic">
                    "{medicine.notes}"
                </p>
            )}

            <div className="mt-auto flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} className={status === 'expired' ? 'text-red-500' : 'text-gray-400'} />
                <span className={status === 'expired' ? 'font-bold text-red-600' : ''}>
                    {formatExpiryDate(medicine.expiryDate)}
                </span>
            </div>

            {status === 'warning' && daysLeft !== null && (
                <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 font-medium bg-orange-50 p-1 rounded">
                    <AlertCircle size={12} /> {daysLeft} gün kaldı
                </div>
            )}
        </Card>
    );
};
