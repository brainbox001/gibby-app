import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

async function initializePayment(
  email: string,
  startAmount: number,
  callback: string,
  uuid : string,
){
  const params: any = {
    email,
    amount: startAmount * 100,
    callback_url: callback,
    reference : uuid
  };

  const config = {
    method: "post",
    url: "https://api.paystack.co/transaction/initialize",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: params,
  };
  let data: any;
  let status:number;
  try {
    const response = await axios(config);
    if(response.data && response.data.status) {
      data = response.data.data;
      status = 200;
    }
    else {
      status = 400;
      data = {error : 'An error occured while trying to make payment'}
    };

    return {status : response.status, data};

  } catch (error: any) {
    return {status : 400, data : {error : 'Request could not be completed'}};
  };
  
};
export default initializePayment;
