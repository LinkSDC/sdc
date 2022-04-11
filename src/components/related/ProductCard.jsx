import React, {useMemo, useEffect, useState} from 'react';
import {CompareButton, RemoveButton} from './ActionButtons.jsx';
import {getAverageRating} from './RelatedHelpers.js';
import StarRating from './StarRating.jsx';
import {getProduct, getStyles, getReviewMetadata} from '../../helpers.js';


const ProductCard = React.memo(function ProductCard({product_id, related}) {
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    getProduct(product_id)
      .then((productData) => getStyles(product_id)
        .then((styleData) => getReviewMetadata(product_id)
          .then((reviewData) => {
            setCardData({productData, styleData, reviewData: reviewData.ratings});
          })))
      .catch((err) => console.error(err));


  }, [product_id]);

  const averageRating = useMemo(() => getAverageRating(cardData.reviewData), [cardData]);

  return (
    <div className="product-card">
      {cardData.productData ?
      <React.Fragment>
        <div className="card-top">
        {related ? <CompareButton cardData={cardData.productData} /> :
        <RemoveButton />}
        {cardData.styleData[0].photos[0].thumbnail_url ?
        <img className="related-image" src={cardData.styleData[0].photos[0].thumbnail_url} /> :
        <div className="related-image no-image">NO IMAGE</div>
        }
      </div>
      <div className="card-bot">
        <section className="body-text">{cardData.productData.category}</section>
        <section className="related-name"><h2>{cardData.productData.name}</h2></section>
        {cardData.styleData[0].sale_price ?
          <div className="sale-price-container">
            <section className="body-text sale-price">{cardData.styleData[0].sale_price} USD</section>
            <section className="body-text original-price">{cardData.styleData[0].original_price} USD</section>
          </div> :
          <section className="body-text price">{cardData.styleData[0].original_price} USD</section>
        }
        <div className="average-star-container product-stars">
          {averageRating > 0 ? <StarRating averageRating={averageRating} /> : null}
        </div>
      </div>
      </React.Fragment>
      : null}
    </div>
  );
});

export default ProductCard;