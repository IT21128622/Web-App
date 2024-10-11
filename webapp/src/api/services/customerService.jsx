import { apiClient } from "../axios/api";

//Approve customer
export const approveCustomer = async (token, approver, userId) => {
  try {
    const response = await apiClient.put(
      `/api/user/approve/${userId}/${approver}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response ? error.response.data : "An error occurred";
  }
};

//Deactivate customer
export const deactivateCustomer = async (
  token,
  approveremail,
  userId,
  role
) => {
  try {
    const response = await apiClient.put(
      `/api/user/deactivate/${userId}/${approveremail}/${role}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response ? error.response.data : "An error occurred";
  }
};

//Reactivate Customer
export const reactivateCustomer = async (
  token,
  approveremail,
  userId,
  role
) => {
  try {
    const response = await apiClient.put(
      `/api/user/reactivate/${userId}/${approveremail}/${role}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response ? error.response.data : "An error occurred";
  }
};
