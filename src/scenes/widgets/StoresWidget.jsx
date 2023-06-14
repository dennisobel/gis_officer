import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StoreWidget from "./StoreWidget";

const StoresWidget = ({ userId, isProfile = false }) => {
  const stores = useSelector(state => state.stores)
  const query = useSelector(state => state.searchStoreQuery)
  const [filteredbusiness, setFiltered] = useState([]);

  useEffect(() => {
    let filtered = stores?.singleBusinessPermits.filter((el) => {
      const {
        branch_name,
        business_category,
        business_description,
        business_email,
        business_phone,
        payment_status,
        store_no
      } = el;
      const filteredEl = {
        branch_name,
        business_category,
        business_description,
        business_email,
        business_phone,
        payment_status,
        store_no
      };

      for (const key in filteredEl) {
        if (
          filteredEl[key]?.toString().toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    console.log("FILTERED:", filtered);
    setFiltered(filtered);
  }, [query, stores]);

  const storestorender = query && stores ? filteredbusiness : stores?.singleBusinessPermits;

  return (
    <>
      {storestorender.map(
        (store) => (
          <StoreWidget
            key={store._id}
            branch={store.branch_name}
            category={store.business_category}
            description={store.business_description}
            email={store.business_email}
            phone={store.business_phone}
            paymentstatus={store.payment_status}
            store_no={store.store_no}
            store={store}
          />
        )
      )}
    </>
  );
};

export default StoresWidget;
