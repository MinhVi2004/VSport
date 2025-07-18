const Address = require('../models/Address');

// Thêm địa chỉ
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phoneNumber, province, district, ward, detail, isDefault } = req.body;

    const fullAddress = `${detail}, ${ward}, ${district}, ${province}`;

    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = new Address({
      user: userId,
      fullName,
      phoneNumber,
      province,
      district,
      ward,
      detail,
      isDefault,
      fullAddress, // Thêm vào đây
    });

    await address.save();
    res.status(201).json({ message: 'Thêm địa chỉ thành công', address });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm địa chỉ', error: error.message });
  }
};

// Lấy danh sách địa chỉ của user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách địa chỉ', error: error.message });
  }
};

// Cập nhật địa chỉ
exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;
    const { fullName, phoneNumber, province, district, ward, detail, isDefault } = req.body;

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) return res.status(404).json({ message: 'Địa chỉ không tồn tại' });

    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const fullAddress = `${detail}, ${ward}, ${district}, ${province}`;

    Object.assign(address, {
      fullName,
      phoneNumber,
      province,
      district,
      ward,
      detail,
      isDefault,
      fullAddress, // Thêm vào đây
    });

    await address.save();

    res.json({ message: 'Cập nhật địa chỉ thành công', address });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật địa chỉ', error: error.message });
  }
};

// Xoá địa chỉ
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;

    const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
    if (!address) return res.status(404).json({ message: 'Địa chỉ không tồn tại' });

    res.json({ message: 'Xoá địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá địa chỉ', error: error.message });
  }
};
