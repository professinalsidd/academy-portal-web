import Axios from "../../base";

export const AllStudentPaymentAPI = async (token: string) => {
  try {
    const response = await Axios.get("/payments/allPaymentView", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const StudentPaymentAPI = async (token: string, studentId: string) => {
  try {
    console.log("url", `/payments/studentPaymentView/${studentId}`);
    const response = await Axios.get(
      `/payments/studentPaymentView/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addStudentPaymentAPI = async (token: string, payload: any) => {
  try {
    const response = await Axios.post("/payments/addPayment", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
