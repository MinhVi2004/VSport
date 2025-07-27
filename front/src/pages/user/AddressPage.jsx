import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';

const AddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        detail: '',
        isDefault: false,
    });

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchAddresses = async () => {
        const res = await axios.get('/api/address');
        setAddresses(res.data);
    };

    useEffect(() => {
        fetchAddresses();
        fetchProvinces();
    }, []);

    // Load tỉnh/thành
    const fetchProvinces = async () => {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=1');
        const data = await res.json();
        setProvinces(data);
    };

    // Load quận/huyện theo tỉnh
    useEffect(() => {
        if (form.province) {
            const selected = provinces.find(p => p.name === form.province);
            if (selected) {
                fetch(
                    `https://provinces.open-api.vn/api/p/${selected.code}?depth=2`
                )
                    .then(res => res.json())
                    .then(data => {
                        setDistricts(data.districts);
                        if (
                            !data.districts.find(d => d.name === form.district)
                        ) {
                            setForm(prev => ({
                                ...prev,
                                district: '',
                                ward: '',
                            }));
                        }
                    });
            }
        } else {
            setDistricts([]);
            setWards([]);
            setForm(prev => ({ ...prev, district: '', ward: '' }));
        }
    }, [form.province]);

    // Load phường/xã theo quận
    useEffect(() => {
        const fetchWards = async () => {
            if (form.district) {
                const selected = districts.find(d => d.name === form.district);
                if (selected) {
                    const res = await fetch(
                        `https://provinces.open-api.vn/api/d/${selected.code}?depth=2`
                    );
                    const data = await res.json();
                    setWards(data.wards);

                    // Nếu form.ward hiện tại không có trong danh sách mới -> reset
                    const validWard = data.wards.find(
                        w => w.name === form.ward
                    );
                    if (!validWard) {
                        setForm(prev => ({ ...prev, ward: '' }));
                    }
                }
            } else {
                setWards([]);
                setForm(prev => ({ ...prev, ward: '' }));
            }
        };

        fetchWards();
    }, [form.district]);

    const handleSubmit = async e => {
        e.preventDefault();
        const nameRegex = /^[^\d]{6,}$/; // fullName: ít nhất 6 ký tự, không chứa số
        const phoneRegex = /^(0|\+84)(\d{9})$/; // phone: bắt đầu bằng 0 hoặc +84, có 10 số

        if (!form.fullName.trim()) {
            toast.warning('Họ tên không được để trống.');
            return;
        }

        if (!nameRegex.test(form.fullName.trim())) {
            toast.warning('Họ tên phải ít nhất 6 ký tự và không chứa số.');
            return;
        }

        if (!form.phoneNumber.trim()) {
            toast.warning('Số điện thoại không được để trống.');
            return;
        }

        if (!phoneRegex.test(form.phoneNumber.trim())) {
            toast.warning('Số điện thoại không đúng định dạng.');
            return;
        }

        if (!form.province || !form.district || !form.ward) {
            toast.warning(
                'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.'
            );
            return;
        }

        if (!form.detail.trim() || form.detail.trim().length < 6) {
            toast.warning('Địa chỉ chi tiết phải có ít nhất 6 ký tự.');
            return;
        }
        try {
            if (isEdit) {
                await axios.put(`/api/address/${editId}`, form);
                toast.success('Sửa địa chỉ thành công!');
            } else {
                await axios.post('/api/address', form);
                toast.success('Thêm địa chỉ thành công!');
            }
            resetForm();
            fetchAddresses();
        } catch (err) {
            toast.error('Đã xảy ra lỗi!');
        }
    };

    const handleDelete = async id => {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            await axios.delete(`/api/address/${id}`);
            toast.success('Xóa địa chỉ thành công!');
            fetchAddresses();
        }
    };

    const handleEdit = async address => {
        setForm(address); // Gán trước để hiển thị dữ liệu cơ bản
        setEditId(address._id);
        setIsEdit(true);

        // Fetch lại districts theo province
        const selectedProvince = provinces.find(
            p => p.name === address.province
        );
        if (selectedProvince) {
            const res = await fetch(
                `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
            );
            const data = await res.json();
            setDistricts(data.districts);

            // Tiếp tục fetch wards theo district
            const selectedDistrict = data.districts.find(
                d => d.name === address.district
            );
            if (selectedDistrict) {
                const res2 = await fetch(
                    `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
                );
                const data2 = await res2.json();
                setWards(data2.wards);
            }
        }
    };

    const resetForm = () => {
        setForm({
            fullName: '',
            phoneNumber: '',
            province: '',
            district: '',
            ward: '',
            detail: '',
            isDefault: false,
        });
        setIsEdit(false);
        setEditId(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
                Quản lý địa chỉ giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Danh sách địa chỉ */}
                <div className="space-y-4">
                    {addresses.length === 0 && (
                        <p className="text-gray-500">Chưa có địa chỉ nào.</p>
                    )}
                    {addresses.map(address => (
                        <div
                            key={address._id}
                            className="p-4 bg-gray-100 rounded shadow flex justify-between items-start"
                        >
                            <div>
                                <p className="font-semibold">
                                    {address.fullName} - {address.phoneNumber}
                                </p>
                                <p className="text-sm text-gray-700">{`${address.detail}, ${address.ward}, ${address.district}, ${address.province}`}</p>
                                {address.isDefault && (
                                    <span className="inline-block mt-1 text-green-600 text-xs">
                                        [Mặc định]
                                    </span>
                                )}
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form địa chỉ */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow space-y-4"
                >
                    <h3 className="text-lg font-medium">
                        {isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                    </h3>
                    <input
                        placeholder="Họ tên người nhận"
                        className="w-full border p-2 rounded"
                        value={form.fullName}
                        onChange={e =>
                            setForm({ ...form, fullName: e.target.value })
                        }
                        required
                    />
                    <input
                        placeholder="Số điện thoại"
                        className="w-full border p-2 rounded"
                        value={form.phoneNumber}
                        onChange={e =>
                            setForm({ ...form, phoneNumber: e.target.value })
                        }
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            className="border p-2 rounded"
                            value={form.province}
                            onChange={e =>
                                setForm({ ...form, province: e.target.value })
                            }
                            required
                        >
                            <option value="">Chọn Tỉnh / Thành phố</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.name}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border p-2 rounded"
                            value={form.district}
                            onChange={e =>
                                setForm({ ...form, district: e.target.value })
                            }
                            disabled={!districts.length}
                            required
                        >
                            <option value="">Chọn Quận / Huyện</option>
                            {districts.map(d => (
                                <option key={d.code} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border p-2 rounded col-span-2"
                            value={form.ward}
                            onChange={e =>
                                setForm({ ...form, ward: e.target.value })
                            }
                            disabled={!wards.length}
                            required
                        >
                            <option value="">Chọn Phường / Xã</option>
                            {wards.map(w => (
                                <option key={w.code} value={w.name}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Số nhà, tên đường"
                            className="border p-2 rounded col-span-2"
                            value={form.detail}
                            onChange={e =>
                                setForm({ ...form, detail: e.target.value })
                            }
                            required
                        />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    isDefault: e.target.checked,
                                })
                            }
                            className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded border border-gray-400 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition">
                            <Check className="w-4 h-4 text-white peer-checked:block hidden" />
                        </div>
                        <span>Đặt làm địa chỉ mặc định</span>
                    </label>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            {isEdit ? 'Cập nhật' : 'Thêm địa chỉ'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressPage;
