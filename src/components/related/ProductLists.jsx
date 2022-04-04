import React, {useState, useEffect} from 'react';
import ProductList from './ProductList.jsx';
import ProductCard from './ProductCard.jsx';
import CompareModal from './CompareModal.jsx';
import {fetchRelated, fetchProduct, fetchStyles} from '../../helpers.js';

//Placeholder data for the compare-modal
const ModalContext = React.createContext({});

const ProductLists = () => {



  //Comparison Modal Context
  const modalView = {visibility: 'hidden'};

  //Product Cards
  // TODO: Create an outfit list state
  const [relatedCards, setRelatedCards] = useState([]);
  const createRelatedCards = (product_id) => { //Returns an array of Product Cards
    return fetchRelated(product_id)
      .then((data) => Promise.all(data.map((id) => fetchProduct(id) //Returns an array of objects with product and style info
            .then((product) => fetchStyles(id)
              .then((styles) => {
                return {product: product, styles: styles};
              }))
            .catch((err) => console.error(err)))))
      .then((items) => setRelatedCards(items.map((item, key) => <ProductCard key={key} product={item.product} styles={item.styles} />)))
      .catch((err) => console.error(err));
  }

  // TODO: Make sure it rerenders when the currently viewed product changes
  useEffect(() => {
    createRelatedCards(40344);
  }, []);



  return (
    <React.Fragment>
      <ModalContext.Provider value={modalView}>
        <CompareModal />
      </ModalContext.Provider>
      <div className="product-list" id="related-products">

        <span>Related Products</span>
          <ProductList cards={relatedCards} />
      </div>
      <div className="product-list">
        <span>Outfit List</span>
          <ProductList cards={relatedCards} />
      </div>
    </React.Fragment>
  );
};

export default ProductLists;
export {ModalContext};