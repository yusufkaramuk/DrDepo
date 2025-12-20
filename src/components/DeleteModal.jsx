import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button, Input } from './ui/BaseComponents';

export const DeleteModal = ({ isOpen, onClose, medicine, onConfirm }) => {
    const count = medicine?.count || 1;
    const [deleteCount, setDeleteCount] = useState(1);

    if (!isOpen) return null;

    const handleDeleteSpecific = () => {
        if (deleteCount < 1 || deleteCount > count) {
            alert('Geçersiz sayı!');
            return;
        }
        onConfirm(deleteCount);
        onClose();
    };

    const handleDeleteAll = () => {
        onConfirm(count);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Trash2 size={20} className="text-red-500" />
                        İlaç Sil
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">{medicine?.name}</p>
                        {count > 1 && (
                            <p className="text-sm text-gray-500">Toplam {count} adet kayıt bulundu</p>
                        )}
                    </div>

                    {count > 1 ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kaç tane silmek istiyorsunuz?
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={count}
                                    value={deleteCount}
                                    onChange={(e) => setDeleteCount(parseInt(e.target.value) || 1)}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    1 ile {count} arasında bir sayı girin
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="danger"
                                    onClick={handleDeleteSpecific}
                                    className="w-full"
                                >
                                    {deleteCount} Adet Sil
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleDeleteAll}
                                    className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                    Tümünü Sil ({count} adet)
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="w-full"
                                >
                                    İptal
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="danger"
                                onClick={handleDeleteAll}
                                className="w-full"
                            >
                                <Trash2 size={18} />
                                Silmek için Onayla
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="w-full"
                            >
                                İptal
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
