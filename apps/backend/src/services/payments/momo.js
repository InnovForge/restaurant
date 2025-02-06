import crypto from "crypto";

//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
/**
 * @param {string} amount
 * @param {string} Order's information
 * @returns {string} payUrl
 */
export const momo = async (amount, orderInfo) => {
  //parameters
  const partnerCode = "MOMO";
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretkey = process.env.MOMO_SECRET_KEY;
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  // var orderInfo = "pay with MoMo";
  const redirectUrl = process.env.CLIENT_URL;
  const ipnUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NGROK_URL + "/api/v1/payments/momo/callback"
      : process.env.SERVER_URL + "/api/v1/payments/momo/callback";
  console.log("ipnUrl", ipnUrl);
  // var ipnUrl = "http://localhost:3001/api/v1/payment/check";
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  // var amount = "50000";
  const requestType = "captureWallet";
  var extraData = ""; //pass empty value if your merchant does not have stores

  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  //puts raw signature
  // console.log("--------------------RAW SIGNATURE----------------");
  // console.log(rawSignature);
  //signature

  const signature = crypto.createHmac("sha256", secretkey).update(rawSignature).digest("hex");
  // console.log("--------------------SIGNATURE----------------");
  // console.log(signature);
  //
  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  // //Create the HTTPS objects
  // const https = require("https");
  // const options = {
  //   hostname: "test-payment.momo.vn",
  //   port: 443,
  //   path: "/v2/gateway/api/create",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Content-Length": Buffer.byteLength(requestBody),
  //   },
  // };
  //
  //
  const f = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = await f.json();
  if (data.resultCode !== 0) throw new Error(data.localMessage);

  return data.payUrl;
};
