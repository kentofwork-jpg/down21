// netlify/functions/gas-proxy.js
// GASへのリクエストをサーバーサイドで中継する（CORS回避）

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzHThQtPKFDYNRpsde0Bi7j_u552bU0XHUp5QwHu5dLBazhiwO1LLTZZnMFeAGn9DwIQg/exec';

exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const qs = new URLSearchParams(params).toString();
    const url = GAS_URL + (qs ? '?' + qs : '');

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
