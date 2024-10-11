import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { changeCategoryStatus, getAllLowStockProducts, getAllProducts, getAllProductsAdmin } from "../../api/services/productService";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { pushNotificationsToVendor } from "../../api/services/notifications";

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Inventory = () => {

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [categoryStatusUpdated, setCategoryStatusUpdated] = useState(false);
  const [hasSentNotify, setHasSentNotify] = useState(false);

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.loggedUser.token);
  const role = useSelector((state) => state.auth.loggedUser.role);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!token) {
          console.error("No token found. Please log in.");
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        if (role === "vender") {
          const response = await getAllProducts(token);
          setProductData(response);
        } else if (role === "admin" || role === "csr") {
          // Call multiple APIs using Promise.all
          const [allProductsResponse, lowStockResponse,] = await Promise.all([
            getAllProductsAdmin(token),
            getAllLowStockProducts(token),
          ]);
          setProductData(allProductsResponse);
          setLowStockProducts(lowStockResponse);

        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.response || error);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, role, categoryStatusUpdated, hasSentNotify]);

  const handleCategoryListActiveDeactivation = async (status, category) => {
    const confirmSubmit = window.confirm("Are you sure you want to change the status of this category?");
    if (confirmSubmit) {
      try {
        const response = await changeCategoryStatus(status, category, token);
        if (response.status === 200) {
          alert("Category status updated successfully!");
          setCategoryStatusUpdated(prevState => !prevState);
        }
      } catch (error) {
        console.error("Failed to update category status", error);
        alert("Error updating category status");
      }
    }
  };


  const uniqueCategories = new Set(productData.map(obj => obj['category']));
  const categoriesWithCount = [];
  const categoriesWithProductList = [];

  uniqueCategories.forEach(value => {
    const count = productData.filter(obj => obj['category'] === value).length;
    categoriesWithCount.push({ ['category']: value, count });
  });

  uniqueCategories.forEach(category => {
    const filteredProducts = productData.filter(product => product.category === category);
    const productList = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
    }));

    const categoryStatus = filteredProducts.every(product => product.isCategoryActive);

    categoriesWithProductList.push({
      categoryName: category,
      productCount: filteredProducts.length,
      productList,
      status: categoryStatus
    });
  });

  // Chart.js data configuration
  const data = {
    labels: categoriesWithCount.map((category) => category.category),
    datasets: [
      {
        label: "Product Count",
        data: categoriesWithCount.map((category) => category.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const maxCount = Math.max(...categoriesWithCount.map(category => category.count));

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: maxCount + 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const NotifyVendor = async (productId) => {
    try {
      const confirmSubmit = window.confirm("Are you sure you want to Notify the Vendor?");
      if (confirmSubmit) {
        const response = await pushNotificationsToVendor(token, productId)
        if (response.status === 200) {
          alert("Vendor Notified Successfully");
          setHasSentNotify(prevState => !prevState);
        }
      }
    } catch (error) {
      console.log(error)
      alert("Error Occured while sending the Notifications");
    }
  }


  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              {productData.length > 0 && <h3><b>Total Products: {productData.length}</b></h3>}
            </div>

            <div className="mb-3">
              <h5><center>Product Categories Overview</center></h5>
              <Bar data={data} options={options} />
            </div>
            <hr style={{ height: '2px', border: 'none', backgroundColor: '#000' }} />
            <div className="mb-3">
              <h5><center>Category List</center></h5>
              {categoriesWithProductList.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Product Count</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesWithProductList.map((category) => (
                      <tr key={category.categoryName}>
                        <td>{category.categoryName}</td>
                        <td>{category.productCount}</td>
                        <td>{category.status ? "Active" : "Inactive"}</td>
                        <td>
                          <button className={`btn btn-sm ${category.status ? "btn-danger" : "btn-success"}`}
                            onClick={() => handleCategoryListActiveDeactivation(!category.status, category.categoryName)}>
                            {category.status ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "Nothing To Show"
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              {lowStockProducts.length > 0 && <h4><b>Low Stock Products: {lowStockProducts.length}</b></h4>}
            </div>

            <div className="mb-3">
              <h5><center>Products with Low Stock</center></h5>
              {lowStockProducts.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price(Rs.)</th>
                      <th>Current Stock Level</th>
                      <th>Low Stock Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td>{product.price}</td>
                        <td>{product.stockLevel}</td>
                        <td>{product.minStockLevel}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => NotifyVendor(product.id)}
                          >
                            Notify Vendor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>) : "Nothing to Show"}
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default Inventory