import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import StoreWidget from "./StoreWidget";
import { getWardBusinesses, getUsername } from "helper/helper";

const StoresWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const stores = useSelector(state => state.stores)
  const query = useSelector(state => state.searchStoreQuery)
  const [user, setUser] = useState();
  const [wardbusinesses, setWardbusinesses] = useState([]);
  const [filteredbusiness, setFiltered] = useState([]);

//   useEffect(() => {
//     getUsername().then((user) => setUser(user));
//     console.log("STORES",stores)
//   }, []);

//   useEffect(() => {
//     if (user !== undefined) {
//       getWardBusinesses({ ward: user?.ward }).then(({ data }) => {
//         setWardbusinesses(data);
//       });
//     }
//   }, [user]);

  useEffect(() => {
    console.log("STORES:", stores);
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
