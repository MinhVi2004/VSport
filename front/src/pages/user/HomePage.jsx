// src/pages/HomePage.jsx
import { useSearchParams } from "react-router-dom";
import Banner from "../../components/user/Banner";
import ListCategory from "../../components/user/ListCategory";
import ListProduct from "../../components/user/ListProduct";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cate");

  return (
    <div>
      <Banner />
      <ListCategory />
      <ListProduct selectedCategory={categoryId} />
    </div>
  );
};

export default HomePage;
