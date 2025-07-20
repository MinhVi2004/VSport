import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      useEffect(() => {
           window.scrollTo({ top: 0, behavior: 'smooth' });

            const fetchProduct = async () => {
                  try {
                        const res = await axiosInstance.get(
                              `/api/product/${id}`
                        );
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

      if (!product) return <div className="p-6">Đang tải sản phẩm...</div>;

      const hasVariants = product.variants && product.variants.length > 0;
      const selectedVariant = hasVariants
            ? product.variants[selectedColorIndex]
            : null;

      const handleAddToCart = async () => {
            const user = JSON.parse(sessionStorage.getItem('user'));

            const cartItem = hasVariants
                  ? {
                          product: product._id,
                          variant: selectedVariant._id,
                          size: selectedSize?.size,
                          quantity,
                    }
                  : {
                          product: product._id,
                          size: 'default',
                          quantity,
                    };

            if (hasVariants && !selectedSize) {
                  return toast.error('Vui lòng chọn kích thước!');
            }

            try {
                  if (user && user._id) {
                        const token = sessionStorage.getItem("token");
                        await axiosInstance.post('/api/cart', cartItem, {
                              headers: { Authorization: `Bearer ${token}` },
                        });
                        toast.success('Đã thêm vào giỏ hàng');
                  } else {
                        const localCart = JSON.parse(localStorage.getItem('cart')) || [];

                        const existingIndex = localCart.findIndex(
                              item =>
                                    item.product === cartItem.product &&
                                    item.size === cartItem.size &&
                                    (hasVariants
                                          ? item.variant === cartItem.variant
                                          : true)
                        );

                        if (existingIndex !== -1) {
                              // Nếu đã tồn tại, cộng dồn số lượng
                              localCart[existingIndex].quantity +=
                                    cartItem.quantity;
                        } else {
                              // Nếu chưa có, thêm mới
                              localCart.push(cartItem);
                        }

                        localStorage.setItem('cart', JSON.stringify(localCart));
                        toast.success('Đã thêm vào giỏ hàng');
                  }
            } catch (err) {
                  console.error('Lỗi thêm vào giỏ hàng:', err);
                  toast.error('Thêm vào giỏ hàng thất bại');
            }
      };

      return (
            <div>
                  <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6 gap-6">
                        <div className="w-full md:w-1/2">
                              <Carousel
                                    showThumbs
                                    infiniteLoop
                                    autoPlay
                                    showStatus={false}
                                    className=" shadow"
                              >
                                    {product.images?.map((img, index) => (
                                          <div key={index}>
                                                <img
                                                      src={img.url}
                                                      alt={`Hình ${index + 1}`}
                                                      className=""
                                                />
                                          </div>
                                    ))}
                              </Carousel>
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                              <p className="text-gray-700 text-sm">
                                    Mã: {product._id}
                              </p>
                              <h2 className="text-3xl font-bold">
                                    {product.name}
                              </h2>
                              <p className="text-gray-700">
                                    {product.category?.name || 'Không xác định'}
                              </p>
                              <p className="text-red-600 text-xl font-semibold">
                                    Giá: {product.price.toLocaleString()}đ
                              </p>
                              <p className="text-gray-600">
                                    {product.description}
                              </p>

                              {hasVariants ? (
                                    <>
                                          <div>
                                                <h4 className="font-semibold mb-1">
                                                      Phân loại:
                                                </h4>
                                                <div className="flex gap-3">
                                                      {product.variants.map(
                                                            (variant, idx) => (
                                                                  <div
                                                                        key={
                                                                              idx
                                                                        }
                                                                        className="flex flex-col items-center"
                                                                  >
                                                                        <p className="text-sm mb-1">
                                                                              {
                                                                                    variant.color
                                                                              }
                                                                        </p>
                                                                        <button
                                                                              onClick={() => {
                                                                                    setSelectedColorIndex(
                                                                                          idx
                                                                                    );
                                                                                    setSelectedSize(
                                                                                          null
                                                                                    );
                                                                              }}
                                                                              className={`w-16 h-16 border-4  p-1 ${
                                                                                    selectedColorIndex ===
                                                                                    idx
                                                                                          ? 'border-blue-600'
                                                                                          : 'border-gray-300'
                                                                              }`}
                                                                        >
                                                                              <img
                                                                                    src={
                                                                                          variant.image
                                                                                    }
                                                                                    alt={
                                                                                          variant.color
                                                                                    }
                                                                                    className="w-full h-full object-cover "
                                                                              />
                                                                        </button>
                                                                  </div>
                                                            )
                                                      )}
                                                </div>
                                          </div>

                                          {selectedVariant &&
                                                selectedVariant.sizes.length >
                                                      0 && (
                                                      <div>
                                                            <h4 className="font-semibold mt-4 mb-1">
                                                                  Chọn kích
                                                                  thước:
                                                            </h4>
                                                            <div className="flex gap-3 flex-wrap">
                                                                  {selectedVariant.sizes.map(
                                                                        (
                                                                              s,
                                                                              i
                                                                        ) => (
                                                                              <button
                                                                                    key={
                                                                                          i
                                                                                    }
                                                                                    onClick={() =>
                                                                                          setSelectedSize(
                                                                                                s
                                                                                          )
                                                                                    }
                                                                                    className={`px-4 py-2 border ${
                                                                                          selectedSize?.size ===
                                                                                          s.size
                                                                                                ? 'bg-blue-600 text-white'
                                                                                                : 'bg-white'
                                                                                    }`}
                                                                              >
                                                                                    {
                                                                                          s.size
                                                                                    }{' '}
                                                                                    -{' '}
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
                                    <div>
                                          <h4 className="font-semibold mb-1">
                                                Màu:
                                          </h4>
                                          <img
                                                src={product.images[0]?.url}
                                                alt="Ảnh đại diện"
                                                className="w-20 h-20 object-cover  border"
                                          />
                                    </div>
                              )}

                              <div className="flex items-center gap-4 mt-4">
                                    <label className="font-semibold">
                                          Số lượng:
                                    </label>
                                    <div className="flex items-center gap-2">
                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setQuantity(prev =>
                                                            Math.max(
                                                                  1,
                                                                  prev - 1
                                                            )
                                                      )
                                                }
                                                className="w-8 h-8 bg-gray-200  text-xl"
                                          >
                                                −
                                          </button>
                                          <span className="w-8 text-center">
                                                {quantity}
                                          </span>
                                          <button
                                                type="button"
                                                onClick={() =>
                                                      setQuantity(
                                                            prev => prev + 1
                                                      )
                                                }
                                                className="w-8 h-8 bg-gray-200  text-xl"
                                          >
                                                +
                                          </button>
                                    </div>
                              </div>

                              <button
                                    onClick={handleAddToCart}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 "
                              >
                                    Thêm vào giỏ hàng
                              </button>
                        </div>
                  </div>

                  <RelatedCategoryProduct
                        products={relatedProducts}
                        currentProductId={product._id}
                  />
            </div>
      );
};

export default ProductDetailPage;
