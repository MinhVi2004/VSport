import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from './../../utils/axios';
import { toast } from 'react-toastify';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import RelatedCategoryProduct from './RelatedCategoryProduct';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/api/product/${id}`);
                setProduct(res.data);
                const catId = res.data.category?._id;
                if (catId) {
                    const relatedRes = await axiosInstance.get(
                        `/api/product/category/${catId}`
                    );
                    setRelatedProducts(relatedRes.data || []);
                }
            } catch (error) {
                console.error('Lỗi lấy sản phẩm:', error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product)
        return (
            <div className="p-6 text-center text-gray-600">
                đang tải sản phẩm...
            </div>
        );

    const hasVariants = product.variants && product.variants.length > 0;
    const selectedVariant = hasVariants
        ? product.variants[selectedColorIndex]
        : null;

    const handleAddToCart = async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        let cartQuantity =
            JSON.parse(localStorage.getItem('cartQuantity')) || 0;

        if (hasVariants && !selectedSize) {
            return toast.error('Vui lòng chọn kích thước!');
        }

        const cartItem = {
            product: {
                _id: product._id,
                name: product.name,
                images: product.images,
            },
            variant: selectedVariant
                ? {
                      _id: selectedVariant._id,
                      color: selectedVariant.color,
                      image: selectedVariant.image,
                  }
                : null,
            size: selectedSize ? selectedSize.size : 'default',
            quantity,
            price: selectedSize ? selectedSize.price : product.price,
        };

        try {
            if (user && user._id) {
                await axiosInstance.post('/api/cart', cartItem);
                toast.success('Đã thêm vào giỏ hàng');
            } else {
                const localCart =
                    JSON.parse(localStorage.getItem('cart')) || [];
                const existingIndex = localCart.findIndex(
                    item =>
                        item.product._id === cartItem.product._id &&
                        item.size === cartItem.size &&
                        (cartItem.variant
                            ? item.variant?._id === cartItem.variant._id
                            : !item.variant)
                );

                if (existingIndex !== -1) {
                    localCart[existingIndex].quantity += cartItem.quantity;
                } else {
                    localCart.push(cartItem);
                }

                localStorage.setItem('cart', JSON.stringify(localCart));
                toast.success('Đã thêm vào giỏ hàng');
            }

            // Cập nhật cartQuantity và dispatch event để Header nhận
            cartQuantity += quantity;
            localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));

            // Tạo custom event để Header lắng nghe
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error('Lỗi thêm vào giỏ hàng:', err);
            toast.error('Thêm vào giỏ hàng thất bại');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6 gap-8">
                {/* Carousel */}
                <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg bg-white">
                    <Carousel
                        showThumbs
                        infiniteLoop
                        autoPlay
                        showStatus={false}
                        thumbWidth={80} // <--- chiều rộng thumbnail
                        className="rounded-xl"
                    >
                        {product.images?.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.url}
                                    alt={`Hình ${index + 1}`}
                                    className="object-cover w-full aspect-square rounded-xl"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 space-y-4">
                    {/* <p className="text-gray-500 text-sm">
                        Mã sản phẩm:{' '}
                        <span className="font-medium">{product._id}</span>
                    </p> */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {product.name}
                    </h1>
                    <p className="text-gray-600 text-md">
                        {product.category?.name || 'Không xác định'}
                    </p>

                    {/* Giá */}
                    <div className="flex items-center gap-3 mt-2">
                        {product.oldPrice && (
                            <span className="text-gray-400 line-through text-lg">
                                {product.oldPrice.toLocaleString()} đ
                            </span>
                        )}
                        <span className="text-blue-600 font-bold text-2xl">
                            {product.price.toLocaleString()} đ
                        </span>
                    </div>

                    {/* Biến thể */}
                    {hasVariants ? (
                        <>
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2 text-gray-700">
                                    Màu sắc:
                                </h4>
                                <div className="flex gap-3">
                                    {product.variants.map((variant, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col items-center"
                                        >
                                            <p className="text-sm mb-1">
                                                {variant.color}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSelectedColorIndex(idx);
                                                    setSelectedSize(null);
                                                }}
                                                className={`w-16 h-16 border-4 p-1 rounded-lg overflow-hidden ${
                                                    selectedColorIndex === idx
                                                        ? 'border-blue-600'
                                                        : 'border-gray-300'
                                                } transition-all duration-300`}
                                            >
                                                <img
                                                    src={variant.image}
                                                    alt={variant.color}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedVariant &&
                                selectedVariant.sizes.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2 text-gray-700">
                                            Chọn kích thước:
                                        </h4>
                                        <div className="flex gap-3 flex-wrap">
                                            {selectedVariant.sizes.map(
                                                (s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() =>
                                                            setSelectedSize(s)
                                                        }
                                                        className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                                                            selectedSize?.size ===
                                                            s.size
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        {s.size} -{' '}
                                                        {s.price.toLocaleString()}
                                                        đ
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-gray-700">
                                Màu:
                            </h4>
                            <img
                                src={product.images[0]?.url}
                                alt="Ảnh đại diện"
                                className="w-24 h-24 object-cover border rounded-lg"
                            />
                        </div>
                    )}

                    {/* Số lượng */}
                    <div className="flex items-center gap-4 mt-6">
                        <span className="font-semibold text-gray-700">
                            Số lượng:
                        </span>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity(prev => Math.max(1, prev - 1))
                                }
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-xl transition"
                            >
                                −
                            </button>
                            <span className="w-10 text-center">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-xl transition"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex flex-col gap-3 mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 hover:text-gray-800 py-3 rounded-xl font-medium transition"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>

                    {/* Mô tả */}
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </div>

            {/* Sản phẩm liên quan */}
            <div className="mt-12 max-w-6xl mx-auto px-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    Sản phẩm liên quan
                </h3>
                <RelatedCategoryProduct
                    products={relatedProducts}
                    currentProductId={product._id}
                />
            </div>
        </div>
    );
};

export default ProductDetailPage;
