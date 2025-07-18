import React from 'react';

import Banner from "../../components/user/Banner";
import ListCategory from "../../components/user/ListCategory";
import ListProduct  from '../../components/user/ListProduct';
const HomePage = () => {
  return (
    <div>
      <Banner />
      <ListCategory />
      <ListProduct/>
    </div>
  );
};

export default HomePage;
