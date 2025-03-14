import React, { useState } from 'react';
import './GeneratedListPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/back-arrow.svg';
import BottomNavigation from './BottomNavigation';
// Import store logos
import woolworthsLogo from '../assets/images/woolworths-logo.svg';
import colesLogo from '../assets/images/coles-logo.svg';

const GeneratedListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shoppingList, maxStores, preferredStore, listName } = location.state || { 
    shoppingList: [], 
    maxStores: 2, 
    preferredStore: null,
    listName: 'My Shopping List'
  };

  // Initialize checked state using array indices instead of item IDs
  const [checkedItems, setCheckedItems] = useState(
    Array(shoppingList.length).fill(false)
  );

  // Store logo mapping
  const storeLogo = {
    'Woolworths': woolworthsLogo,
    'Coles': colesLogo
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // In a real app, this would save the shopping list to history
    alert(`Shopping list "${listName}" saved to history!`);
  };

  const handleAddToFavorite = () => {
    // In a real app, this would add the shopping list to favorites
    alert(`Shopping list "${listName}" added to favorites!`);
  };

  // Update to use index instead of itemId
  const handleCheckItem = (index) => {
    setCheckedItems(prev => {
      const newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  // Group items by store for multi-store lists
  const itemsByStore = {};
  if (maxStores > 1) {
    shoppingList.forEach(item => {
      if (!itemsByStore[item.store]) {
        itemsByStore[item.store] = [];
      }
      itemsByStore[item.store].push(item);
    });
  }

  return (
    <div className="generated-list-page">
      <div className="header">
        <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
        <h1>{listName}</h1>
      </div>

      <div className="list-container">
        {maxStores === 1 ? (
          // Single store list
          <div className="store-section">
            <div className="store-header">
              <div className={`store-logo-container ${preferredStore.toLowerCase()}-container`}>
                <img 
                  src={storeLogo[preferredStore]} 
                  alt={preferredStore} 
                  className="store-logo-img" 
                />
                <span className="store-name">{preferredStore}</span>
              </div>
            </div>
            <div className="items-list">
              {shoppingList.map((item, index) => (
                <div 
                  key={index} 
                  className={`list-item ${checkedItems[index] ? 'checked' : ''} ${item.note ? 'alternate-store' : ''}`}
                  onClick={() => handleCheckItem(index)}
                >
                  <div className="item-info">
                    <div className="checkbox">
                      {checkedItems[index] && <span className="checkmark">X</span>}
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      {item.note && (
                        <p className="item-note">{item.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="item-price-container">
                    <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    {item.store && item.store !== preferredStore && (
                      <p className="item-store">{item.store}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : maxStores === 'custom' ? (
          // Custom selection list
          <div className="store-section">
            <div className="store-header">
              <div className="store-logo-container custom-container">
                <span className="store-name">Custom Selection</span>
              </div>
            </div>
            <div className="items-list">
              {shoppingList.map((item, index) => (
                <div 
                  key={index} 
                  className={`list-item ${checkedItems[index] ? 'checked' : ''}`}
                  onClick={() => handleCheckItem(index)}
                >
                  <div className="item-info">
                    <div className="checkbox">
                      {checkedItems[index] && <span className="checkmark">X</span>}
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-category">{item.category}</p>
                    </div>
                  </div>
                  <div className="item-price-container">
                    <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    <p className="item-store">{item.store}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Multi-store list
          Object.keys(itemsByStore).map((store, storeIndex) => (
            <div key={storeIndex} className="store-section">
              <div className="store-header">
                <div className={`store-logo-container ${store.toLowerCase()}-container`}>
                  <img 
                    src={storeLogo[store]} 
                    alt={store} 
                    className="store-logo-img" 
                  />
                  <span className="store-name">{store}</span>
                </div>
              </div>
              <div className="items-list">
                {itemsByStore[store].map((item, itemIndex) => {
                  // Calculate the global index for this item
                  const globalIndex = shoppingList.findIndex(i => 
                    i.id === item.id && i.name === item.name && i.store === item.store
                  );
                  return (
                    <div 
                      key={itemIndex} 
                      className={`list-item ${checkedItems[globalIndex] ? 'checked' : ''} ${item.note ? 'alternate-store' : ''}`}
                      onClick={() => handleCheckItem(globalIndex)}
                    >
                      <div className="item-info">
                        <div className="checkbox">
                          {checkedItems[globalIndex] && <span className="checkmark">X</span>}
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          {item.note && (
                            <p className="item-note">{item.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="item-price-container">
                        <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="action-buttons">
        <button className="action-button favorite-button" onClick={handleAddToFavorite}>
          Add to Favorite
        </button>
        <button className="action-button save-button" onClick={handleSave}>
          Save to History
        </button>
      </div>

      <BottomNavigation activeTab="shopping" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default GeneratedListPage; 